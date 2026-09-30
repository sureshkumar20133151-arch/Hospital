"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessReportRequestSchema = exports.CreateLabReportSchema = exports.LabReportTypeEnum = exports.CreatePrescriptionSchema = exports.PrescriptionItemSchema = exports.VitalsSchema = exports.MEDICAL_ADVICE_DISCLAIMER = void 0;
const zod_1 = require("zod");
exports.MEDICAL_ADVICE_DISCLAIMER = 'LEGAL & CLINICAL DISCLAIMER: All medical notes, prescriptions, and records generated or displayed are intended for official clinical care by authorized medical practitioners. This information does not replace in-person professional clinical evaluation, diagnosis, or emergency intervention. In case of medical emergencies, immediately contact hospital emergency hotline 1066 or visit the nearest emergency room.';
exports.VitalsSchema = zod_1.z.object({
    bloodPressureSystolic: zod_1.z.number().int().min(50).max(300).optional(),
    bloodPressureDiastolic: zod_1.z.number().int().min(30).max(200).optional(),
    pulseRateBpm: zod_1.z.number().int().min(30).max(250).optional(),
    temperatureFahrenheit: zod_1.z.number().min(90).max(110).optional(),
    oxygenSaturationSpo2: zod_1.z.number().int().min(50).max(100).optional(),
    respiratoryRate: zod_1.z.number().int().min(8).max(60).optional(),
    weightKg: zod_1.z.number().min(0.5).max(400).optional(),
    heightCm: zod_1.z.number().min(20).max(280).optional()
});
exports.PrescriptionItemSchema = zod_1.z.object({
    genericName: zod_1.z.string().min(1, 'Generic medicine name is required'),
    brandName: zod_1.z.string().optional(),
    dosage: zod_1.z.string().min(1, 'Dosage is required (e.g. 500mg)'),
    frequency: zod_1.z.string().min(1, 'Frequency is required (e.g. Once daily after food)'),
    durationDays: zod_1.z.number().int().positive('Duration must be at least 1 day'),
    instructions: zod_1.z.string().optional()
});
exports.CreatePrescriptionSchema = zod_1.z.object({
    appointmentId: zod_1.z.string().uuid(),
    patientId: zod_1.z.string().uuid(),
    diagnosis: zod_1.z.string().min(2, 'Diagnosis is required'),
    medicines: zod_1.z.array(exports.PrescriptionItemSchema).min(1, 'At least one medicine must be prescribed'),
    dietaryAdvice: zod_1.z.string().optional(),
    followUpDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    clinicalNotes: zod_1.z.string().optional(),
    disclaimerConfirmed: zod_1.z.boolean().default(true)
});
exports.LabReportTypeEnum = zod_1.z.enum([
    'PATHOLOGY',
    'RADIOLOGY',
    'CARDIOLOGY_ECG',
    'BIOCHEMISTRY',
    'MICROBIOLOGY',
    'HISTOPATHOLOGY',
    'OTHER'
]);
exports.CreateLabReportSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    appointmentId: zod_1.z.string().uuid().optional(),
    testName: zod_1.z.string().min(2),
    category: exports.LabReportTypeEnum,
    fileKey: zod_1.z.string().min(1, 'Secure storage file key is required'),
    fileName: zod_1.z.string().min(1),
    mimeType: zod_1.z.string(),
    fileSizeBytes: zod_1.z.number().int().positive(),
    summary: zod_1.z.string().optional(),
    isConfidential: zod_1.z.boolean().default(true)
});
exports.AccessReportRequestSchema = zod_1.z.object({
    reportId: zod_1.z.string().uuid(),
    purpose: zod_1.z.string().default('Clinical review by authorized individual')
});
//# sourceMappingURL=record.schema.js.map