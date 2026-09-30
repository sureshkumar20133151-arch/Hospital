import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from '../config/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { env } from '../config/env';

export class BillingController {
  private static getRazorpayClient(): Razorpay {
    return new Razorpay({
      key_id: env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      key_secret: env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
    });
  }

  /**
   * Create Razorpay Order for consultation fee or bill payment
   */
  static async createOrder(req: Request, res: Response) {
    const { billId, appointmentId, amountInPaisa, currency = 'INR', receipt } = req.body;
    const patientProfileId = req.user?.patientProfileId;

    if (!patientProfileId) {
      return sendError(res, 'Patient profile required', 403, 'FORBIDDEN');
    }

    try {
      let razorpayOrderId: string;

      // Check if real keys are configured
      if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_ID.startsWith('rzp_test_') && env.RAZORPAY_KEY_ID !== 'rzp_test_mock_key') {
        const rzp = BillingController.getRazorpayClient();
        const order = await rzp.orders.create({
          amount: amountInPaisa,
          currency,
          receipt: receipt || `rec_${Date.now()}`
        });
        razorpayOrderId = order.id;
      } else {
        // Mock Razorpay order ID for development
        razorpayOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      }

      // Record pending payment in database
      const payment = await prisma.payment.create({
        data: {
          patientId: patientProfileId,
          billId: billId || null,
          appointmentId: appointmentId || null,
          razorpayOrderId,
          amountInPaisa,
          currency,
          status: 'PENDING'
        }
      });

      return sendSuccess(res, 'Razorpay order created', {
        orderId: razorpayOrderId,
        amount: amountInPaisa,
        currency,
        keyId: env.RAZORPAY_KEY_ID,
        paymentId: payment.id
      });
    } catch (error: any) {
      console.error('[Razorpay Order Creation Failed]', error);
      return sendError(res, error.message || 'Payment order generation failed', 500);
    }
  }

  /**
   * Verify Razorpay payment signature & update bill/appointment status
   */
  static async verifyPayment(req: Request, res: Response) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, billId, appointmentId } = req.body;

    let isValid = false;

    // In mock mode:
    if (env.RAZORPAY_KEY_ID === 'rzp_test_mock_key' || !env.RAZORPAY_KEY_SECRET) {
      isValid = true; // Auto-verify in development mock
    } else {
      const generatedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isValid = generatedSignature === razorpaySignature;
    }

    if (!isValid) {
      return sendError(res, 'Invalid payment signature. Payment verification failed.', 400, 'PAYMENT_VERIFICATION_FAILED');
    }

    // Update payment record and related bill/appointment atomically
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: 'PAID',
          paidAt: new Date()
        }
      });

      if (billId) {
        await tx.bill.update({
          where: { id: billId },
          data: { status: 'PAID' }
        });
      }

      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CONFIRMED' }
        });
      }
    });

    return sendSuccess(res, 'Payment verified successfully. Receipt generated.', {
      razorpayOrderId,
      razorpayPaymentId,
      status: 'PAID'
    });
  }

  /**
   * Get all bills for the logged in patient
   */
  static async getMyBills(req: Request, res: Response) {
    const patientProfileId = req.user?.patientProfileId;
    if (!patientProfileId) {
      return sendError(res, 'Patient profile required', 403, 'FORBIDDEN');
    }

    const bills = await prisma.bill.findMany({
      where: { patientId: patientProfileId },
      include: {
        items: true,
        payments: true,
        appointment: {
          select: {
            tokenNumber: true,
            appointmentDate: true,
            doctor: { select: { fullName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendSuccess(res, 'Patient bills retrieved', bills);
  }
}
