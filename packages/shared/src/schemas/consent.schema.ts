import { z } from 'zod';

export const ConsentPurposeEnum = z.enum([
  'ACCOUNT_CREATION',
  'MEDICAL_CONSULTATION',
  'TELEHEALTH_SERVICES',
  'DIAGNOSTIC_REPORTS_STORAGE',
  'PRESCRIPTION_MANAGEMENT',
  'SMS_WHATSAPP_NOTIFICATIONS',
  'BILLING_AND_PAYMENTS',
  'INSURANCE_TPA_COORDINATION'
]);
export type ConsentPurpose = z.infer<typeof ConsentPurposeEnum>;

export const DpdpConsentRecordSchema = z.object({
  purpose: ConsentPurposeEnum,
  isGranted: z.boolean(),
  version: z.string().default('v1.0'),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  consentText: z.string(),
  grantedAt: z.string().datetime().optional()
});
export type DpdpConsentRecord = z.infer<typeof DpdpConsentRecordSchema>;

export const WithdrawConsentSchema = z.object({
  purposes: z.array(ConsentPurposeEnum).min(1, 'Select at least one consent purpose to withdraw'),
  reason: z.string().optional(),
  acknowledgement: z.literal(true, {
    errorMap: () => ({
      message: 'You must acknowledge that withdrawing consent will disable certain healthcare services.'
    })
  })
});
export type WithdrawConsentInput = z.infer<typeof WithdrawConsentSchema>;

export const DataErasureRequestSchema = z.object({
  reason: z.string().min(5, 'Please describe the reason for data erasure'),
  acknowledgeStatutoryRetention: z.literal(true, {
    errorMap: () => ({
      message: 'National Medical Commission (NMC) regulations require medical clinical records to be retained for a minimum statutory period (3-7 years) despite erasure of web account credentials.'
    })
  })
});
export type DataErasureRequestInput = z.infer<typeof DataErasureRequestSchema>;
