import { z } from 'zod';

export const MEDICAL_ADVICE_DISCLAIMER =
  'LEGAL & CLINICAL DISCLAIMER: All medical notes, prescriptions, and records generated or displayed are intended for official clinical care by authorized medical practitioners. This information does not replace in-person professional clinical evaluation, diagnosis, or emergency intervention. In case of medical emergencies, immediately contact hospital emergency hotline 1066 or visit the nearest emergency room.';

export const VitalsSchema = z.object({
  bloodPressureSystolic: z.number().int().min(50).max(300).optional(),
  bloodPressureDiastolic: z.number().int().min(30).max(200).optional(),
  pulseRateBpm: z.number().int().min(30).max(250).optional(),
  temperatureFahrenheit: z.number().min(90).max(110).optional(),
  oxygenSaturationSpo2: z.number().int().min(50).max(100).optional(),
  respiratoryRate: z.number().int().min(8).max(60).optional(),
  weightKg: z.number().min(0.5).max(400).optional(),
  heightCm: z.number().min(20).max(280).optional()
});
export type Vitals = z.infer<typeof VitalsSchema>;

export const PrescriptionItemSchema = z.object({
  genericName: z.string().min(1, 'Generic medicine name is required'),
  brandName: z.string().optional(),
  dosage: z.string().min(1, 'Dosage is required (e.g. 500mg)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. Once daily after food)'),
  durationDays: z.number().int().positive('Duration must be at least 1 day'),
  instructions: z.string().optional()
});
export type PrescriptionItem = z.infer<typeof PrescriptionItemSchema>;

export const CreatePrescriptionSchema = z.object({
  appointmentId: z.string().uuid(),
  patientId: z.string().uuid(),
  diagnosis: z.string().min(2, 'Diagnosis is required'),
  medicines: z.array(PrescriptionItemSchema).min(1, 'At least one medicine must be prescribed'),
  dietaryAdvice: z.string().optional(),
  followUpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  clinicalNotes: z.string().optional(),
  disclaimerConfirmed: z.boolean().default(true)
});
export type CreatePrescriptionInput = z.infer<typeof CreatePrescriptionSchema>;

export const LabReportTypeEnum = z.enum([
  'PATHOLOGY',
  'RADIOLOGY',
  'CARDIOLOGY_ECG',
  'BIOCHEMISTRY',
  'MICROBIOLOGY',
  'HISTOPATHOLOGY',
  'OTHER'
]);
export type LabReportType = z.infer<typeof LabReportTypeEnum>;

export const CreateLabReportSchema = z.object({
  patientId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  testName: z.string().min(2),
  category: LabReportTypeEnum,
  fileKey: z.string().min(1, 'Secure storage file key is required'),
  fileName: z.string().min(1),
  mimeType: z.string(),
  fileSizeBytes: z.number().int().positive(),
  summary: z.string().optional(),
  isConfidential: z.boolean().default(true)
});
export type CreateLabReportInput = z.infer<typeof CreateLabReportSchema>;

export const AccessReportRequestSchema = z.object({
  reportId: z.string().uuid(),
  purpose: z.string().default('Clinical review by authorized individual')
});
