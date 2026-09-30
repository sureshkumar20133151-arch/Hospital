import { z } from 'zod';
export declare const PaymentStatusEnum: z.ZodEnum<["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"]>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export declare const BillTypeEnum: z.ZodEnum<["CONSULTATION", "DIAGNOSTIC_TEST", "PHARMACY", "PROCEDURE", "IPD_ROOM", "GENERAL"]>;
export type BillType = z.infer<typeof BillTypeEnum>;
export declare const CreateRazorpayOrderSchema: z.ZodObject<{
    appointmentId: z.ZodOptional<z.ZodString>;
    billId: z.ZodOptional<z.ZodString>;
    amountInPaisa: z.ZodNumber;
    currency: z.ZodDefault<z.ZodLiteral<"INR">>;
    receipt: z.ZodString;
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    amountInPaisa: number;
    currency: "INR";
    receipt: string;
    appointmentId?: string | undefined;
    billId?: string | undefined;
    notes?: Record<string, string> | undefined;
}, {
    amountInPaisa: number;
    receipt: string;
    appointmentId?: string | undefined;
    billId?: string | undefined;
    currency?: "INR" | undefined;
    notes?: Record<string, string> | undefined;
}>;
export type CreateRazorpayOrderInput = z.infer<typeof CreateRazorpayOrderSchema>;
export declare const VerifyPaymentSchema: z.ZodObject<{
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodString;
    razorpaySignature: z.ZodString;
    billId: z.ZodOptional<z.ZodString>;
    appointmentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    appointmentId?: string | undefined;
    billId?: string | undefined;
}, {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    appointmentId?: string | undefined;
    billId?: string | undefined;
}>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
export declare const CreateBillSchema: z.ZodObject<{
    patientId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["CONSULTATION", "DIAGNOSTIC_TEST", "PHARMACY", "PROCEDURE", "IPD_ROOM", "GENERAL"]>;
    title: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        description: z.ZodString;
        quantity: z.ZodDefault<z.ZodNumber>;
        unitPrice: z.ZodNumber;
        taxPercentage: z.ZodDefault<z.ZodNumber>;
        totalAmount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        description: string;
        quantity: number;
        unitPrice: number;
        taxPercentage: number;
        totalAmount: number;
    }, {
        description: string;
        unitPrice: number;
        totalAmount: number;
        quantity?: number | undefined;
        taxPercentage?: number | undefined;
    }>, "many">;
    subtotal: z.ZodNumber;
    taxTotal: z.ZodDefault<z.ZodNumber>;
    discountAmount: z.ZodDefault<z.ZodNumber>;
    netPayable: z.ZodNumber;
    dueDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "CONSULTATION" | "DIAGNOSTIC_TEST" | "PHARMACY" | "PROCEDURE" | "IPD_ROOM" | "GENERAL";
    patientId: string;
    title: string;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        taxPercentage: number;
        totalAmount: number;
    }[];
    subtotal: number;
    taxTotal: number;
    discountAmount: number;
    netPayable: number;
    appointmentId?: string | undefined;
    dueDate?: string | undefined;
}, {
    type: "CONSULTATION" | "DIAGNOSTIC_TEST" | "PHARMACY" | "PROCEDURE" | "IPD_ROOM" | "GENERAL";
    patientId: string;
    title: string;
    items: {
        description: string;
        unitPrice: number;
        totalAmount: number;
        quantity?: number | undefined;
        taxPercentage?: number | undefined;
    }[];
    subtotal: number;
    netPayable: number;
    appointmentId?: string | undefined;
    taxTotal?: number | undefined;
    discountAmount?: number | undefined;
    dueDate?: string | undefined;
}>;
export type CreateBillInput = z.infer<typeof CreateBillSchema>;
//# sourceMappingURL=billing.schema.d.ts.map