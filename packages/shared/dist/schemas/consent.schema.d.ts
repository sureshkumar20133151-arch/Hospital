import { z } from 'zod';
export declare const ConsentPurposeEnum: z.ZodEnum<["ACCOUNT_CREATION", "MEDICAL_CONSULTATION", "TELEHEALTH_SERVICES", "DIAGNOSTIC_REPORTS_STORAGE", "PRESCRIPTION_MANAGEMENT", "SMS_WHATSAPP_NOTIFICATIONS", "BILLING_AND_PAYMENTS", "INSURANCE_TPA_COORDINATION"]>;
export type ConsentPurpose = z.infer<typeof ConsentPurposeEnum>;
export declare const DpdpConsentRecordSchema: z.ZodObject<{
    purpose: z.ZodEnum<["ACCOUNT_CREATION", "MEDICAL_CONSULTATION", "TELEHEALTH_SERVICES", "DIAGNOSTIC_REPORTS_STORAGE", "PRESCRIPTION_MANAGEMENT", "SMS_WHATSAPP_NOTIFICATIONS", "BILLING_AND_PAYMENTS", "INSURANCE_TPA_COORDINATION"]>;
    isGranted: z.ZodBoolean;
    version: z.ZodDefault<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    consentText: z.ZodString;
    grantedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    purpose: "ACCOUNT_CREATION" | "MEDICAL_CONSULTATION" | "TELEHEALTH_SERVICES" | "DIAGNOSTIC_REPORTS_STORAGE" | "PRESCRIPTION_MANAGEMENT" | "SMS_WHATSAPP_NOTIFICATIONS" | "BILLING_AND_PAYMENTS" | "INSURANCE_TPA_COORDINATION";
    isGranted: boolean;
    version: string;
    consentText: string;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    grantedAt?: string | undefined;
}, {
    purpose: "ACCOUNT_CREATION" | "MEDICAL_CONSULTATION" | "TELEHEALTH_SERVICES" | "DIAGNOSTIC_REPORTS_STORAGE" | "PRESCRIPTION_MANAGEMENT" | "SMS_WHATSAPP_NOTIFICATIONS" | "BILLING_AND_PAYMENTS" | "INSURANCE_TPA_COORDINATION";
    isGranted: boolean;
    consentText: string;
    version?: string | undefined;
    ipAddress?: string | undefined;
    userAgent?: string | undefined;
    grantedAt?: string | undefined;
}>;
export type DpdpConsentRecord = z.infer<typeof DpdpConsentRecordSchema>;
export declare const WithdrawConsentSchema: z.ZodObject<{
    purposes: z.ZodArray<z.ZodEnum<["ACCOUNT_CREATION", "MEDICAL_CONSULTATION", "TELEHEALTH_SERVICES", "DIAGNOSTIC_REPORTS_STORAGE", "PRESCRIPTION_MANAGEMENT", "SMS_WHATSAPP_NOTIFICATIONS", "BILLING_AND_PAYMENTS", "INSURANCE_TPA_COORDINATION"]>, "many">;
    reason: z.ZodOptional<z.ZodString>;
    acknowledgement: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    purposes: ("ACCOUNT_CREATION" | "MEDICAL_CONSULTATION" | "TELEHEALTH_SERVICES" | "DIAGNOSTIC_REPORTS_STORAGE" | "PRESCRIPTION_MANAGEMENT" | "SMS_WHATSAPP_NOTIFICATIONS" | "BILLING_AND_PAYMENTS" | "INSURANCE_TPA_COORDINATION")[];
    acknowledgement: true;
    reason?: string | undefined;
}, {
    purposes: ("ACCOUNT_CREATION" | "MEDICAL_CONSULTATION" | "TELEHEALTH_SERVICES" | "DIAGNOSTIC_REPORTS_STORAGE" | "PRESCRIPTION_MANAGEMENT" | "SMS_WHATSAPP_NOTIFICATIONS" | "BILLING_AND_PAYMENTS" | "INSURANCE_TPA_COORDINATION")[];
    acknowledgement: true;
    reason?: string | undefined;
}>;
export type WithdrawConsentInput = z.infer<typeof WithdrawConsentSchema>;
export declare const DataErasureRequestSchema: z.ZodObject<{
    reason: z.ZodString;
    acknowledgeStatutoryRetention: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    acknowledgeStatutoryRetention: true;
}, {
    reason: string;
    acknowledgeStatutoryRetention: true;
}>;
export type DataErasureRequestInput = z.infer<typeof DataErasureRequestSchema>;
//# sourceMappingURL=consent.schema.d.ts.map