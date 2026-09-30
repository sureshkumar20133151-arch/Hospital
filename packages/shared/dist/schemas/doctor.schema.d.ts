import { z } from 'zod';
export declare const DayOfWeekEnum: z.ZodEnum<["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]>;
export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;
export declare const TimeSlotSchema: z.ZodObject<{
    startTime: z.ZodString;
    endTime: z.ZodString;
    maxPatients: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    endTime: string;
    maxPatients: number;
}, {
    startTime: string;
    endTime: string;
    maxPatients?: number | undefined;
}>;
export declare const DoctorScheduleInputSchema: z.ZodObject<{
    dayOfWeek: z.ZodEnum<["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    slotDurationMinutes: z.ZodDefault<z.ZodNumber>;
    maxPatientsPerSlot: z.ZodDefault<z.ZodNumber>;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    startTime: string;
    endTime: string;
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    slotDurationMinutes: number;
    maxPatientsPerSlot: number;
    isAvailable: boolean;
}, {
    startTime: string;
    endTime: string;
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    slotDurationMinutes?: number | undefined;
    maxPatientsPerSlot?: number | undefined;
    isAvailable?: boolean | undefined;
}>;
export declare const DoctorSearchQuerySchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    departmentId: z.ZodOptional<z.ZodString>;
    specialization: z.ZodOptional<z.ZodString>;
    day: z.ZodOptional<z.ZodEnum<["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    departmentId?: string | undefined;
    specialization?: string | undefined;
    query?: string | undefined;
    day?: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY" | undefined;
}, {
    departmentId?: string | undefined;
    specialization?: string | undefined;
    query?: string | undefined;
    day?: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type DoctorSearchQuery = z.infer<typeof DoctorSearchQuerySchema>;
export declare const CreateDoctorSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    departmentId: z.ZodString;
    specialization: z.ZodString;
    qualifications: z.ZodArray<z.ZodString, "many">;
    nmcRegistrationNumber: z.ZodString;
    experienceYears: z.ZodNumber;
    consultationFee: z.ZodNumber;
    languages: z.ZodArray<z.ZodString, "many">;
    bio: z.ZodOptional<z.ZodString>;
    roomNumber: z.ZodOptional<z.ZodString>;
    availableForTeleconsultation: z.ZodDefault<z.ZodBoolean>;
    schedules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodEnum<["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]>;
        startTime: z.ZodString;
        endTime: z.ZodString;
        slotDurationMinutes: z.ZodDefault<z.ZodNumber>;
        maxPatientsPerSlot: z.ZodDefault<z.ZodNumber>;
        isAvailable: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        startTime: string;
        endTime: string;
        dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        slotDurationMinutes: number;
        maxPatientsPerSlot: number;
        isAvailable: boolean;
    }, {
        startTime: string;
        endTime: string;
        dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        slotDurationMinutes?: number | undefined;
        maxPatientsPerSlot?: number | undefined;
        isAvailable?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    phone: string;
    departmentId: string;
    nmcRegistrationNumber: string;
    specialization: string;
    experienceYears: number;
    consultationFee: number;
    qualifications: string[];
    languages: string[];
    availableForTeleconsultation: boolean;
    userId?: string | undefined;
    bio?: string | undefined;
    roomNumber?: string | undefined;
    schedules?: {
        startTime: string;
        endTime: string;
        dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        slotDurationMinutes: number;
        maxPatientsPerSlot: number;
        isAvailable: boolean;
    }[] | undefined;
}, {
    fullName: string;
    email: string;
    phone: string;
    departmentId: string;
    nmcRegistrationNumber: string;
    specialization: string;
    experienceYears: number;
    consultationFee: number;
    qualifications: string[];
    languages: string[];
    userId?: string | undefined;
    bio?: string | undefined;
    roomNumber?: string | undefined;
    availableForTeleconsultation?: boolean | undefined;
    schedules?: {
        startTime: string;
        endTime: string;
        dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
        slotDurationMinutes?: number | undefined;
        maxPatientsPerSlot?: number | undefined;
        isAvailable?: boolean | undefined;
    }[] | undefined;
}>;
export type CreateDoctorInput = z.infer<typeof CreateDoctorSchema>;
//# sourceMappingURL=doctor.schema.d.ts.map