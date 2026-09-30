"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBillSchema = exports.VerifyPaymentSchema = exports.CreateRazorpayOrderSchema = exports.BillTypeEnum = exports.PaymentStatusEnum = void 0;
const zod_1 = require("zod");
exports.PaymentStatusEnum = zod_1.z.enum([
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
    'CANCELLED'
]);
exports.BillTypeEnum = zod_1.z.enum([
    'CONSULTATION',
    'DIAGNOSTIC_TEST',
    'PHARMACY',
    'PROCEDURE',
    'IPD_ROOM',
    'GENERAL'
]);
exports.CreateRazorpayOrderSchema = zod_1.z.object({
    appointmentId: zod_1.z.string().uuid().optional(),
    billId: zod_1.z.string().uuid().optional(),
    amountInPaisa: zod_1.z.number().int().positive('Amount must be positive in paise'),
    currency: zod_1.z.literal('INR').default('INR'),
    receipt: zod_1.z.string().max(40),
    notes: zod_1.z.record(zod_1.z.string()).optional()
});
exports.VerifyPaymentSchema = zod_1.z.object({
    razorpayOrderId: zod_1.z.string().min(1, 'Razorpay order ID is required'),
    razorpayPaymentId: zod_1.z.string().min(1, 'Razorpay payment ID is required'),
    razorpaySignature: zod_1.z.string().min(1, 'Razorpay signature is required'),
    billId: zod_1.z.string().uuid().optional(),
    appointmentId: zod_1.z.string().uuid().optional()
});
exports.CreateBillSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    appointmentId: zod_1.z.string().uuid().optional(),
    type: exports.BillTypeEnum,
    title: zod_1.z.string().min(2),
    items: zod_1.z.array(zod_1.z.object({
        description: zod_1.z.string().min(1),
        quantity: zod_1.z.number().int().positive().default(1),
        unitPrice: zod_1.z.number().positive(),
        taxPercentage: zod_1.z.number().min(0).default(0),
        totalAmount: zod_1.z.number().positive()
    })).min(1),
    subtotal: zod_1.z.number().positive(),
    taxTotal: zod_1.z.number().min(0).default(0),
    discountAmount: zod_1.z.number().min(0).default(0),
    netPayable: zod_1.z.number().positive(),
    dueDate: zod_1.z.string().optional()
});
//# sourceMappingURL=billing.schema.js.map