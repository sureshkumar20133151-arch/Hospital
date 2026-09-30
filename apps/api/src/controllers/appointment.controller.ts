import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { NotificationService } from '../services/notification.service';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentController {
  /**
   * Book appointment with DPDP consultation consent and queue token assignment
   */
  static async bookAppointment(req: Request, res: Response) {
    const {
      doctorId,
      departmentId,
      appointmentDate,
      timeSlot,
      type = 'IN_PERSON',
      symptomsSummary,
      patientNotes,
      dpdpConsultationConsent
    } = req.body;

    if (!dpdpConsultationConsent) {
      return sendError(
        res,
        'Explicit DPDP consent is required to share health and symptom data for doctor consultation.',
        400,
        'DPDP_CONSENT_REQUIRED'
      );
    }

    const patientProfileId = req.user?.patientProfileId;
    if (!patientProfileId) {
      return sendError(res, 'Patient profile not found. Please log in as a patient.', 403, 'PATIENT_PROFILE_REQUIRED');
    }

    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientProfileId },
      include: { user: true }
    });
    if (!patient) {
      return sendError(res, 'Patient profile record not found', 404, 'NOT_FOUND');
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: { department: true, user: true }
    });
    if (!doctor) {
      return sendError(res, 'Doctor not found', 404, 'NOT_FOUND');
    }

    const bookingDate = new Date(`${appointmentDate}T00:00:00.000Z`);

    // Check if slot is already occupied
    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: bookingDate,
        timeSlot,
        status: { notIn: ['CANCELLED', 'RESCHEDULED'] }
      }
    });

    if (existing) {
      return sendError(res, 'The selected time slot is already booked. Please choose another slot.', 409, 'SLOT_UNAVAILABLE');
    }

    // Generate unique daily queue token number (e.g. CARD-20260929-001)
    const dateStr = appointmentDate.replace(/-/g, '');
    const dailyAppointmentsCount = await prisma.appointment.count({
      where: {
        departmentId,
        appointmentDate: bookingDate
      }
    });
    const tokenNumber = `${doctor.department.code}-${dateStr}-${String(dailyAppointmentsCount + 1).padStart(3, '0')}`;

    // Create appointment, billing invoice, and DPDP consultation consent in a single atomic transaction
    const appointment = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.create({
        data: {
          tokenNumber,
          patientId: patientProfileId,
          doctorId,
          departmentId,
          appointmentDate: bookingDate,
          timeSlot,
          type,
          status: 'CONFIRMED',
          symptomsSummary,
          patientNotes,
          consultationFee: doctor.consultationFee,
          meetLink: type === 'TELECONSULTATION' ? `https://telehealth.aarogyahospital.example.com/room/${tokenNumber}` : null
        }
      });

      // Generate invoice / bill for consultation fee
      const billCount = await tx.bill.count();
      const billNumber = `INV-${new Date().getFullYear()}-${String(billCount + 1).padStart(5, '0')}`;

      await tx.bill.create({
        data: {
          billNumber,
          patientId: patientProfileId,
          appointmentId: appt.id,
          type: 'CONSULTATION',
          title: `OPD Consultation - Dr. ${doctor.fullName} (${doctor.department.name})`,
          subtotal: doctor.consultationFee,
          taxTotal: 0,
          discountAmount: 0,
          netPayable: doctor.consultationFee,
          status: 'PENDING',
          items: {
            create: [
              {
                description: `Doctor Consultation Fee (${type === 'TELECONSULTATION' ? 'Telehealth' : 'In-Person OPD'})`,
                quantity: 1,
                unitPrice: doctor.consultationFee,
                taxPercentage: 0,
                totalAmount: doctor.consultationFee
              }
            ]
          }
        }
      });

      // Record DPDP Consultation Consent
      await tx.dpdpConsent.create({
        data: {
          patientId: patientProfileId,
          purpose: 'MEDICAL_CONSULTATION',
          isGranted: true,
          ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
          consentText: `Patient consented to share health notes and symptoms with Dr. ${doctor.fullName} for appointment ${tokenNumber}.`
        }
      });

      return appt;
    });

    // Send asynchronous SMS and Email confirmation
    NotificationService.sendAppointmentNotification({
      patientName: patient.fullName,
      phone: patient.user.phone,
      email: patient.user.email,
      doctorName: doctor.fullName,
      departmentName: doctor.department.name,
      date: appointmentDate,
      time: timeSlot,
      tokenNumber
    }).catch((err) => console.error('[Notification Trigger Error]', err));

    return sendSuccess(res, 'Appointment successfully booked', appointment, 201);
  }

  /**
   * Get appointments for logged-in patient
   */
  static async getMyPatientAppointments(req: Request, res: Response) {
    const patientProfileId = req.user?.patientProfileId;
    if (!patientProfileId) {
      return sendError(res, 'Patient profile required', 403, 'FORBIDDEN');
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patientProfileId },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            avatarUrl: true,
            roomNumber: true
          }
        },
        department: {
          select: { id: true, name: true, code: true }
        },
        bill: {
          select: { id: true, billNumber: true, netPayable: true, status: true }
        },
        prescription: {
          select: { id: true, diagnosis: true }
        }
      },
      orderBy: { appointmentDate: 'desc' }
    });

    return sendSuccess(res, 'Patient appointments retrieved', appointments);
  }

  /**
   * Get appointments for logged-in doctor
   */
  static async getDoctorAppointments(req: Request, res: Response) {
    const doctorProfileId = req.user?.doctorProfileId;
    if (!doctorProfileId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'RECEPTIONIST') {
      return sendError(res, 'Doctor or staff profile required', 403, 'FORBIDDEN');
    }

    const { date, status } = req.query as any;

    const where: any = {};
    if (doctorProfileId) {
      where.doctorId = doctorProfileId;
    }
    if (status) {
      where.status = status as AppointmentStatus;
    }
    if (date) {
      const targetDate = new Date(`${date}T00:00:00.000Z`);
      const nextDay = new Date(`${date}T23:59:59.999Z`);
      where.appointmentDate = { gte: targetDate, lte: nextDay };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            uhid: true,
            fullName: true,
            gender: true,
            dateOfBirth: true,
            bloodGroup: true
          }
        },
        doctor: {
          select: { id: true, fullName: true, specialization: true }
        },
        department: {
          select: { id: true, name: true }
        },
        prescription: true,
        medicalRecord: true
      },
      orderBy: [{ appointmentDate: 'asc' }, { timeSlot: 'asc' }]
    });

    return sendSuccess(res, 'Doctor appointments retrieved', appointments);
  }

  /**
   * Update appointment status (cancel, check-in, complete, etc.)
   */
  static async updateAppointmentStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true }
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', 404, 'NOT_FOUND');
    }

    // Role ownership check
    if (req.user?.role === 'PATIENT' && appointment.patientId !== req.user.patientProfileId) {
      return sendError(res, 'Unauthorized access to appointment', 403, 'FORBIDDEN');
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: status as AppointmentStatus,
        cancellationReason: cancellationReason || null
      }
    });

    return sendSuccess(res, 'Appointment status updated', updated);
  }
}
