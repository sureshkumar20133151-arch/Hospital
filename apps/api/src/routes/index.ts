import { Router } from 'express';
import authRoutes from './auth.routes';
import departmentRoutes from './department.routes';
import doctorRoutes from './doctor.routes';
import appointmentRoutes from './appointment.routes';
import recordRoutes from './record.routes';
import billingRoutes from './billing.routes';
import privacyRoutes from './privacy.routes';
import { sendSuccess } from '../utils/response';
import { env } from '../config/env';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  return sendSuccess(res, 'Aarogya Multi-Specialty Hospital API is running', {
    hospital: env.HOSPITAL_NAME,
    status: 'healthy',
    market: 'India',
    emergencyHotline: env.HOSPITAL_EMERGENCY_HOTLINE,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/records', recordRoutes);
router.use('/billing', billingRoutes);
router.use('/privacy', privacyRoutes);

export default router;
