import { Router } from 'express';
import { BillingController } from '../controllers/billing.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validateBody } from '../middlewares/validate.middleware';
import { CreateRazorpayOrderSchema, VerifyPaymentSchema } from '@hospital/shared';

const router = Router();

router.post(
  '/create-order',
  requireAuth,
  requireRole(['PATIENT']),
  validateBody(CreateRazorpayOrderSchema),
  BillingController.createOrder
);

router.post(
  '/verify-payment',
  requireAuth,
  requireRole(['PATIENT']),
  validateBody(VerifyPaymentSchema),
  BillingController.verifyPayment
);

router.get(
  '/my-bills',
  requireAuth,
  requireRole(['PATIENT']),
  BillingController.getMyBills
);

export default router;
