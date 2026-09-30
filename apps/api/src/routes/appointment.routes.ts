import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { BookAppointmentSchema, UpdateAppointmentStatusSchema } from '@hospital/shared';

const router = Router();

router.post(
  '/book',
  requireAuth,
  requireRole(['PATIENT']),
  validateBody(BookAppointmentSchema),
  AppointmentController.bookAppointment
);

router.get(
  '/my-patient-appointments',
  requireAuth,
  requireRole(['PATIENT']),
  AppointmentController.getMyPatientAppointments
);

router.get(
  '/doctor-appointments',
  requireAuth,
  requireRole(['DOCTOR', 'ADMIN', 'SUPER_ADMIN', 'RECEPTIONIST']),
  AppointmentController.getDoctorAppointments
);

router.patch(
  '/:id/status',
  requireAuth,
  validateBody(UpdateAppointmentStatusSchema),
  AppointmentController.updateAppointmentStatus
);

export default router;
