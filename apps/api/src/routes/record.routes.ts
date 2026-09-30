import { Router } from 'express';
import { RecordController } from '../controllers/record.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { auditAccess } from '../middlewares/audit.middleware';
import { CreatePrescriptionSchema } from '@hospital/shared';

const router = Router();

// Medical encounter clinical records
router.get(
  '/',
  requireAuth,
  auditAccess({ action: 'VIEW_MEDICAL_RECORDS', resourceType: 'MedicalRecord' }),
  RecordController.getRecords
);

router.post(
  '/',
  requireAuth,
  requireRole(['DOCTOR', 'ADMIN']),
  RecordController.createMedicalRecord
);

// Prescriptions
router.get(
  '/prescriptions',
  requireAuth,
  auditAccess({ action: 'VIEW_PRESCRIPTIONS', resourceType: 'Prescription' }),
  RecordController.getPrescriptions
);

router.post(
  '/prescriptions',
  requireAuth,
  requireRole(['DOCTOR', 'ADMIN']),
  validateBody(CreatePrescriptionSchema),
  RecordController.createPrescription
);

// Diagnostic Lab Reports
router.get(
  '/reports',
  requireAuth,
  auditAccess({ action: 'VIEW_LAB_REPORTS', resourceType: 'LabReport' }),
  RecordController.getLabReports
);

// Secure time-limited signed stream for lab report download
router.get(
  '/reports/:reportId/stream',
  auditAccess({
    action: 'DOWNLOAD_LAB_REPORT',
    resourceType: 'LabReport',
    extractResourceId: (req) => req.params.reportId
  }),
  RecordController.streamLabReport
);

export default router;
