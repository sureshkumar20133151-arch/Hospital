"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataErasureRequestSchema = exports.WithdrawConsentSchema = exports.DpdpConsentRecordSchema = exports.ConsentPurposeEnum = void 0;
const zod_1 = require("zod");
exports.ConsentPurposeEnum = zod_1.z.enum([
    'ACCOUNT_CREATION',
    'MEDICAL_CONSULTATION',
    'TELEHEALTH_SERVICES',
    'DIAGNOSTIC_REPORTS_STORAGE',
    'PRESCRIPTION_MANAGEMENT',
    'SMS_WHATSAPP_NOTIFICATIONS',
    'BILLING_AND_PAYMENTS',
    'INSURANCE_TPA_COORDINATION'
]);
exports.DpdpConsentRecordSchema = zod_1.z.object({
    purpose: exports.ConsentPurposeEnum,
    isGranted: zod_1.z.boolean(),
    version: zod_1.z.string().default('v1.0'),
    ipAddress: zod_1.z.string().optional(),
    userAgent: zod_1.z.string().optional(),
    consentText: zod_1.z.string(),
    grantedAt: zod_1.z.string().datetime().optional()
});
exports.WithdrawConsentSchema = zod_1.z.object({
    purposes: zod_1.z.array(exports.ConsentPurposeEnum).min(1, 'Select at least one consent purpose to withdraw'),
    reason: zod_1.z.string().optional(),
    acknowledgement: zod_1.z.literal(true, {
        errorMap: () => ({
            message: 'You must acknowledge that withdrawing consent will disable certain healthcare services.'
        })
    })
});
exports.DataErasureRequestSchema = zod_1.z.object({
    reason: zod_1.z.string().min(5, 'Please describe the reason for data erasure'),
    acknowledgeStatutoryRetention: zod_1.z.literal(true, {
        errorMap: () => ({
            message: 'National Medical Commission (NMC) regulations require medical clinical records to be retained for a minimum statutory period (3-7 years) despite erasure of web account credentials.'
        })
    })
});
//# sourceMappingURL=consent.schema.js.map