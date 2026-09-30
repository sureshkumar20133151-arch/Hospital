import { z } from 'zod';

export const PaymentStatusEnum = z.enum([
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
  'CANCELLED'
]);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export const BillTypeEnum = z.enum([
  'CONSULTATION',
  'DIAGNOSTIC_TEST',
  'PHARMACY',
  'PROCEDURE',
  'IPD_ROOM',
  'GENERAL'
]);
export type BillType = z.infer<typeof BillTypeEnum>;

export const CreateRazorpayOrderSchema = z.object({
  appointmentId: z.string().uuid().optional(),
  billId: z.string().uuid().optional(),
  amountInPaisa: z.number().int().positive('Amount must be positive in paise'),
  currency: z.literal('INR').default('INR'),
  receipt: z.string().max(40),
  notes: z.record(z.string()).optional()
});
export type CreateRazorpayOrderInput = z.infer<typeof CreateRazorpayOrderSchema>;

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay signature is required'),
  billId: z.string().uuid().optional(),
  appointmentId: z.string().uuid().optional()
});
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

export const CreateBillSchema = z.object({
  patientId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  type: BillTypeEnum,
  title: z.string().min(2),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().int().positive().default(1),
      unitPrice: z.number().positive(),
      taxPercentage: z.number().min(0).default(0),
      totalAmount: z.number().positive()
    })
  ).min(1),
  subtotal: z.number().positive(),
  taxTotal: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  netPayable: z.number().positive(),
  dueDate: z.string().optional()
});
export type CreateBillInput = z.infer<typeof CreateBillSchema>;
