import { z } from 'zod';
export declare const AppointmentStatusEnum: z.ZodEnum<["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"]>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;
export declare const AppointmentTypeEnum: z.ZodEnum<["IN_PERSON", "TELECONSULTATION"]>;
export type AppointmentType = z.infer<typeof AppointmentTypeEnum>;
export declare const BookAppointmentSchema: z.ZodObject<{
    doctorId: z.ZodString;
    departmentId: z.ZodString;
    appointmentDate: z.ZodString;
    timeSlot: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["IN_PERSON", "TELECONSULTATION"]>>;
    symptomsSummary: z.ZodOptional<z.ZodString>;
    patientNotes: z.ZodOptional<z.ZodString>;
    dpdpConsultationConsent: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    type: "IN_PERSON" | "TELECONSULTATION";
    departmentId: string;
    doctorId: string;
    appointmentDate: string;
    timeSlot: string;
    dpdpConsultationConsent: true;
    symptomsSummary?: string | undefined;
    patientNotes?: string | undefined;
}, {
    departmentId: string;
    doctorId: string;
    appointmentDate: string;
    timeSlot: string;
    dpdpConsultationConsent: true;
    type?: "IN_PERSON" | "TELECONSULTATION" | undefined;
    symptomsSummary?: string | undefined;
    patientNotes?: string | undefined;
}>;
export type BookAppointmentInput = z.infer<typeof BookAppointmentSchema>;
export declare const UpdateAppointmentStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"]>;
    cancellationReason: z.ZodOptional<z.ZodString>;
    rescheduledDate: z.ZodOptional<z.ZodString>;
    rescheduledSlot: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW";
    cancellationReason?: string | undefined;
    rescheduledDate?: string | undefined;
    rescheduledSlot?: string | undefined;
}, {
    status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW";
    cancellationReason?: string | undefined;
    rescheduledDate?: string | undefined;
    rescheduledSlot?: string | undefined;
}>;
export type UpdateAppointmentStatusInput = z.infer<typeof UpdateAppointmentStatusSchema>;
export declare const AppointmentFilterSchema: z.ZodObject<{
    doctorId: z.ZodOptional<z.ZodString>;
    patientId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"]>>;
    date: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW" | undefined;
    date?: string | undefined;
    doctorId?: string | undefined;
    patientId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    status?: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | "NO_SHOW" | undefined;
    date?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    doctorId?: string | undefined;
    patientId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export type AppointmentFilter = z.infer<typeof AppointmentFilterSchema>;
//# sourceMappingURL=appointment.schema.d.ts.map