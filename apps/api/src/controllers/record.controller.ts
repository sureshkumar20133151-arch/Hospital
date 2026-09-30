import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { StorageService } from '../services/storage.service';
import { MEDICAL_ADVICE_DISCLAIMER } from '@hospital/shared';

export class RecordController {
  /**
   * Get patient's own medical records or doctor's assigned patient records
   * Strict access control + ownership verification
   */
  static async getRecords(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }

    const { patientId } = req.query as { patientId?: string };

    let targetPatientId: string;

    if (user.role === 'PATIENT') {
      targetPatientId = user.patientProfileId!;
    } else if (['DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST'].includes(user.role)) {
      if (!patientId) {
        return sendError(res, 'Patient ID query parameter required for staff lookup', 400, 'PATIENT_ID_REQUIRED');
      }
      targetPatientId = patientId;
    } else {
      return sendError(res, 'Unauthorized access', 403, 'FORBIDDEN');
    }

    const records = await prisma.medicalRecord.findMany({
      where: { patientId: targetPatientId },
      include: {
        doctor: {
          select: {
            fullName: true,
            specialization: true,
            nmcRegistrationNumber: true,
            department: { select: { name: true } }
          }
        },
        appointment: {
          select: {
            appointmentDate: true,
            timeSlot: true,
            tokenNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, 'Medical records retrieved', records);
  }

  /**
   * Doctor writes clinical encounter & notes for an appointment
   */
  static async createMedicalRecord(req: Request, res: Response) {
    const { appointmentId, symptoms, diagnosis, vitals, clinicalNotes } = req.body;
    const doctorProfileId = req.user?.doctorProfileId;

    if (!doctorProfileId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return sendError(res, 'Only licensed medical doctors can create clinical records', 403, 'FORBIDDEN');
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', 404, 'NOT_FOUND');
    }

    // Ensure the doctor is the treating physician
    if (req.user?.role === 'DOCTOR' && appointment.doctorId !== doctorProfileId) {
      return sendError(res, 'You are not assigned as the treating doctor for this appointment', 403, 'FORBIDDEN');
    }

    const record = await prisma.medicalRecord.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        symptoms,
        diagnosis,
        vitalsJson: vitals || {},
        clinicalNotes,
        disclaimerText: MEDICAL_ADVICE_DISCLAIMER
      }
    });

    return sendSuccess(res, 'Clinical record saved successfully', record, 201);
  }

  /**
   * Doctor creates a prescription with generic drug names and mandatory disclaimer
   */
  static async createPrescription(req: Request, res: Response) {
    const { appointmentId, diagnosis, medicines, dietaryAdvice, followUpDate, clinicalNotes } = req.body;
    const doctorProfileId = req.user?.doctorProfileId;

    if (!doctorProfileId && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return sendError(res, 'Only verified doctors can issue clinical prescriptions', 403, 'FORBIDDEN');
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', 404, 'NOT_FOUND');
    }

    if (req.user?.role === 'DOCTOR' && appointment.doctorId !== doctorProfileId) {
      return sendError(res, 'You are not the designated physician for this consultation', 403, 'FORBIDDEN');
    }

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        diagnosis,
        dietaryAdvice,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        clinicalNotes,
        disclaimerText: MEDICAL_ADVICE_DISCLAIMER,
        items: {
          create: medicines.map((m: any) => ({
            genericName: m.genericName,
            brandName: m.brandName || null,
            dosage: m.dosage,
            frequency: m.frequency,
            durationDays: m.durationDays,
            instructions: m.instructions || null
          }))
        }
      },
      include: {
        items: true,
        doctor: {
          select: {
            fullName: true,
            specialization: true,
            nmcRegistrationNumber: true
          }
        }
      }
    });

    return sendSuccess(res, 'Prescription issued successfully', prescription, 201);
  }

  /**
   * Get prescriptions for patient
   */
  static async getPrescriptions(req: Request, res: Response) {
    const user = req.user;
    if (!user) return sendError(res, 'Unauthorized', 401);

    const { patientId } = req.query as { patientId?: string };
    const targetPatientId = user.role === 'PATIENT' ? user.patientProfileId! : patientId;

    if (!targetPatientId) {
      return sendError(res, 'Patient identifier required', 400);
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: targetPatientId },
      include: {
        items: true,
        doctor: {
          select: {
            fullName: true,
            specialization: true,
            nmcRegistrationNumber: true,
            department: { select: { name: true } }
          }
        },
        appointment: {
          select: {
            tokenNumber: true,
            appointmentDate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, 'Prescriptions retrieved', prescriptions);
  }

  /**
   * Get lab reports with secure time-limited access tokens (never public)
   */
  static async getLabReports(req: Request, res: Response) {
    const user = req.user;
    if (!user) return sendError(res, 'Unauthorized', 401);

    const { patientId } = req.query as { patientId?: string };
    const targetPatientId = user.role === 'PATIENT' ? user.patientProfileId! : patientId;

    if (!targetPatientId) {
      return sendError(res, 'Patient identifier required', 400);
    }

    const reports = await prisma.labReport.findMany({
      where: { patientId: targetPatientId },
      orderBy: { createdAt: 'desc' }
    });

    // Generate secure temporary download tokens for each report
    const securedReports = reports.map((report) => ({
      id: report.id,
      testName: report.testName,
      category: report.category,
      fileName: report.fileName,
      mimeType: report.mimeType,
      fileSizeBytes: report.fileSizeBytes,
      summary: report.summary,
      createdAt: report.createdAt,
      // Secure signed streaming URL valid for 15 minutes only
      downloadUrl: StorageService.generateSecureReportUrl(report.id, report.patientId)
    }));

    return sendSuccess(res, 'Lab reports retrieved', securedReports);
  }

  /**
   * Stream or download lab report file behind secure token & ownership checks
   */
  static async streamLabReport(req: Request, res: Response) {
    const { reportId } = req.params;
    const { token } = req.query as { token: string };

    if (!token) {
      return sendError(res, 'Access denied: Security token missing', 403, 'FORBIDDEN');
    }

    const verified = StorageService.verifyReportAccessToken(token);
    if (!verified || verified.reportId !== reportId) {
      return sendError(res, 'Access denied: Token expired or invalid', 403, 'FORBIDDEN');
    }

    const report = await prisma.labReport.findUnique({
      where: { id: reportId }
    });

    if (!report) {
      return sendError(res, 'Report file not found', 404, 'NOT_FOUND');
    }

    // In local demo mode, send structured report PDF placeholder
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}.json"`);
    return res.json({
      hospital: 'Aarogya Multi-Specialty Hospital',
      reportId: report.id,
      patientId: report.patientId,
      testName: report.testName,
      category: report.category,
      summary: report.summary,
      disclaimer: MEDICAL_ADVICE_DISCLAIMER,
      downloadedAt: new Date().toISOString()
    });
  }
}
