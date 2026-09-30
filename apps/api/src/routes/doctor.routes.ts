import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import { validateQuery } from '../middlewares/validate.middleware';
import { DoctorSearchQuerySchema } from '@hospital/shared';

const router = Router();

router.get('/', validateQuery(DoctorSearchQuerySchema), DoctorController.searchDoctors);
router.get('/:id', DoctorController.getDoctorById);
router.get('/:id/slots', DoctorController.getAvailableSlots);

export default router;
