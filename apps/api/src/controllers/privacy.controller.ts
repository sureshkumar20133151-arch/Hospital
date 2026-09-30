import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';

export class PrivacyController {
  /**
   * DPDP Act Right to Access: Export all personal data & health records
   */
  static async exportMyData(req: Request, res: Response) {
    const patientProfileId = req.user?.patientProfileId;
    if (!patientProfileId) {
      return sendError(res, 'Patient profile required', 403, 'FORBIDDEN');
    }

    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientProfileId },
      include: {
        user: { select: { email: true, phone: true, createdAt: true } },
        appointments: {
          include: {
            doctor: { select: { fullName: true, specialization: true } },
            department: { select: { name: true } }
          }
        },
        medicalRecords: {
          include: {
            doctor: { select: { fullName: true, specialization: true } }
          }
        },
        prescriptions: {
          include: { items: true, doctor: { select: { fullName: true } } }
        },
        labReports: {
          select: { id: true, testName: true, category: true, fileName: true, summary: true, createdAt: true }
        },
        bills: {
          include: { items: true, payments: true }
        },
        consents: true
      }
    });

    if (!patient) {
      return sendError(res, 'Patient data not found', 404, 'NOT_FOUND');
    }

    const exportPackage = {
      complianceNotice: 'Data export generated in accordance with Section 11 of the Digital Personal Data Protection Act (DPDP Act), 2023.',
      hospital: 'Aarogya Multi-Specialty Hospital',
      exportedAt: new Date().toISOString(),
      patientInfo: {
        uhid: patient.uhid,
        fullName: patient.fullName,
        email: patient.user.email,
        phone: patient.user.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
        address: {
          line1: patient.addressLine1,
          line2: patient.addressLine2,
          city: patient.city,
          state: patient.state,
          pincode: patient.pincode
        },
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions
      },
      appointments: patient.appointments,
      clinicalRecords: patient.medicalRecords,
      prescriptions: patient.prescriptions,
      diagnosticReports: patient.labReports,
      billingHistory: patient.bills,
      dpdpConsentHistory: patient.consents
    };

    return sendSuccess(res, 'Personal data export ready', exportPackage);
  }

  /**
   * DPDP Act Right to Erasure / Deletion request
   */
  static async requestErasure(req: Request, res: Response) {
    const patientProfileId = req.user?.patientProfileId;
    if (!patientProfileId) {
      return sendError(res, 'Patient profile required', 403, 'FORBIDDEN');
    }

    const { reason, acknowledgeStatutoryRetention } = req.body;

    if (!acknowledgeStatutoryRetention) {
      return sendError(
        res,
        'National Medical Commission (NMC) regulations require hospital clinical records to be preserved for 3-7 years. Acknowledgment is required.',
        400,
        'STATUTORY_ACKNOWLEDGEMENT_REQUIRED'
      );
    }

    // Flag patient profile for erasure review by Data Protection Officer (DPO)
    const updated = await prisma.patientProfile.update({
      where: { id: patientProfileId },
      data: {
        erasureRequestedAt: new Date()
      }
    });

    // Record audit trail entry
    await prisma.auditLog.create({
      data: {
        actorUserId: req.user?.id,
        targetPatientId: patientProfileId,
        action: 'DATA_ERASURE_REQUESTED',
        resourceType: 'PatientProfile',
        resourceId: patientProfileId,
        details: { reason }
      }
    });

    return sendSuccess(res, 'Data erasure request registered. Hospital DPO will review according to NMC and DPDP statutory rules.', {
      erasureRequestedAt: updated.erasureRequestedAt,
      status: 'PENDING_DPO_STATUTORY_REVIEW'
    });
  }

  /**
   * Get all active and past consent records
   */
  static async getConsents(req: Request, res: Response) {
    const patientProfileId = req.user?.patientProfileId;
    if (!patientProfileId) {
      return sendError(res, 'Patient profile required', 403, 'FORBIDDEN');
    }

    const consents = await prisma.dpdpConsent.findMany({
      where: { patientId: patientProfileId },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, 'Consent records retrieved', consents);
  }
}
