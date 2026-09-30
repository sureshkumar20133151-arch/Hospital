import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { requireAuth } from '../middlewares/auth.middleware';
import { RegisterPatientSchema, LoginSchema } from '@hospital/shared';

const router = Router();

router.post('/register', validateBody(RegisterPatientSchema), AuthController.registerPatient);
router.post('/login', validateBody(LoginSchema), AuthController.login);
router.get('/me', requireAuth, AuthController.me);
router.post('/logout', requireAuth, AuthController.logout);

export default router;
