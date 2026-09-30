import { z } from 'zod';
export declare const MEDICAL_ADVICE_DISCLAIMER = "LEGAL & CLINICAL DISCLAIMER: All medical notes, prescriptions, and records generated or displayed are intended for official clinical care by authorized medical practitioners. This information does not replace in-person professional clinical evaluation, diagnosis, or emergency intervention. In case of medical emergencies, immediately contact hospital emergency hotline 1066 or visit the nearest emergency room.";
export declare const VitalsSchema: z.ZodObject<{
    bloodPressureSystolic: z.ZodOptional<z.ZodNumber>;
    bloodPressureDiastolic: z.ZodOptional<z.ZodNumber>;
    pulseRateBpm: z.ZodOptional<z.ZodNumber>;
    temperatureFahrenheit: z.ZodOptional<z.ZodNumber>;
    oxygenSaturationSpo2: z.ZodOptional<z.ZodNumber>;
    respiratoryRate: z.ZodOptional<z.ZodNumber>;
    weightKg: z.ZodOptional<z.ZodNumber>;
    heightCm: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    bloodPressureSystolic?: number | undefined;
    bloodPressureDiastolic?: number | undefined;
    pulseRateBpm?: number | undefined;
    temperatureFahrenheit?: number | undefined;
    oxygenSaturationSpo2?: number | undefined;
    respiratoryRate?: number | undefined;
    weightKg?: number | undefined;
    heightCm?: number | undefined;
}, {
    bloodPressureSystolic?: number | undefined;
    bloodPressureDiastolic?: number | undefined;
    pulseRateBpm?: number | undefined;
    temperatureFahrenheit?: number | undefined;
    oxygenSaturationSpo2?: number | undefined;
    respiratoryRate?: number | undefined;
    weightKg?: number | undefined;
    heightCm?: number | undefined;
}>;
export type Vitals = z.infer<typeof VitalsSchema>;
export declare const PrescriptionItemSchema: z.ZodObject<{
    genericName: z.ZodString;
    brandName: z.ZodOptional<z.ZodString>;
    dosage: z.ZodString;
    frequency: z.ZodString;
    durationDays: z.ZodNumber;
    instructions: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    genericName: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    brandName?: string | undefined;
    instructions?: string | undefined;
}, {
    genericName: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    brandName?: string | undefined;
    instructions?: string | undefined;
}>;
export type PrescriptionItem = z.infer<typeof PrescriptionItemSchema>;
export declare const CreatePrescriptionSchema: z.ZodObject<{
    appointmentId: z.ZodString;
    patientId: z.ZodString;
    diagnosis: z.ZodString;
    medicines: z.ZodArray<z.ZodObject<{
        genericName: z.ZodString;
        brandName: z.ZodOptional<z.ZodString>;
        dosage: z.ZodString;
        frequency: z.ZodString;
        durationDays: z.ZodNumber;
        instructions: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        genericName: string;
        dosage: string;
        frequency: string;
        durationDays: number;
        brandName?: string | undefined;
        instructions?: string | undefined;
    }, {
        genericName: string;
        dosage: string;
        frequency: string;
        durationDays: number;
        brandName?: string | undefined;
        instructions?: string | undefined;
    }>, "many">;
    dietaryAdvice: z.ZodOptional<z.ZodString>;
    followUpDate: z.ZodOptional<z.ZodString>;
    clinicalNotes: z.ZodOptional<z.ZodString>;
    disclaimerConfirmed: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    appointmentId: string;
    diagnosis: string;
    medicines: {
        genericName: string;
        dosage: string;
        frequency: string;
        durationDays: number;
        brandName?: string | undefined;
        instructions?: string | undefined;
    }[];
    disclaimerConfirmed: boolean;
    dietaryAdvice?: string | undefined;
    followUpDate?: string | undefined;
    clinicalNotes?: string | undefined;
}, {
    patientId: string;
    appointmentId: string;
    diagnosis: string;
    medicines: {
        genericName: string;
        dosage: string;
        frequency: string;
        durationDays: number;
        brandName?: string | undefined;
        instructions?: string | undefined;
    }[];
    dietaryAdvice?: string | undefined;
    followUpDate?: string | undefined;
    clinicalNotes?: string | undefined;
    disclaimerConfirmed?: boolean | undefined;
}>;
export type CreatePrescriptionInput = z.infer<typeof CreatePrescriptionSchema>;
export declare const LabReportTypeEnum: z.ZodEnum<["PATHOLOGY", "RADIOLOGY", "CARDIOLOGY_ECG", "BIOCHEMISTRY", "MICROBIOLOGY", "HISTOPATHOLOGY", "OTHER"]>;
export type LabReportType = z.infer<typeof LabReportTypeEnum>;
export declare const CreateLabReportSchema: z.ZodObject<{
    patientId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodString>;
    testName: z.ZodString;
    category: z.ZodEnum<["PATHOLOGY", "RADIOLOGY", "CARDIOLOGY_ECG", "BIOCHEMISTRY", "MICROBIOLOGY", "HISTOPATHOLOGY", "OTHER"]>;
    fileKey: z.ZodString;
    fileName: z.ZodString;
    mimeType: z.ZodString;
    fileSizeBytes: z.ZodNumber;
    summary: z.ZodOptional<z.ZodString>;
    isConfidential: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    patientId: string;
    testName: string;
    category: "OTHER" | "PATHOLOGY" | "RADIOLOGY" | "CARDIOLOGY_ECG" | "BIOCHEMISTRY" | "MICROBIOLOGY" | "HISTOPATHOLOGY";
    fileKey: string;
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    isConfidential: boolean;
    appointmentId?: string | undefined;
    summary?: string | undefined;
}, {
    patientId: string;
    testName: string;
    category: "OTHER" | "PATHOLOGY" | "RADIOLOGY" | "CARDIOLOGY_ECG" | "BIOCHEMISTRY" | "MICROBIOLOGY" | "HISTOPATHOLOGY";
    fileKey: string;
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    appointmentId?: string | undefined;
    summary?: string | undefined;
    isConfidential?: boolean | undefined;
}>;
export type CreateLabReportInput = z.infer<typeof CreateLabReportSchema>;
export declare const AccessReportRequestSchema: z.ZodObject<{
    reportId: z.ZodString;
    purpose: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reportId: string;
    purpose: string;
}, {
    reportId: string;
    purpose?: string | undefined;
}>;
//# sourceMappingURL=record.schema.d.ts.map