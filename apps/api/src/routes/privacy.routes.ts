import { Router } from 'express';
import { PrivacyController } from '../controllers/privacy.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { auditAccess } from '../middlewares/audit.middleware';
import { DataErasureRequestSchema } from '@hospital/shared';

const router = Router();

// DPDP Right to Access / Data Portability Export
router.get(
  '/export-my-data',
  requireAuth,
  requireRole(['PATIENT']),
  auditAccess({ action: 'DPDP_DATA_EXPORT_DOWNLOADED', resourceType: 'PatientProfile' }),
  PrivacyController.exportMyData
);

// DPDP Right to Erasure Request
router.post(
  '/request-erasure',
  requireAuth,
  requireRole(['PATIENT']),
  validateBody(DataErasureRequestSchema),
  PrivacyController.requestErasure
);

// Consent history
router.get(
  '/consents',
  requireAuth,
  requireRole(['PATIENT']),
  PrivacyController.getConsents
);

export default router;
