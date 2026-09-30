import { z } from 'zod';

export const AppointmentStatusEnum = z.enum([
  'PENDING',
  'CONFIRMED',
  'CHECKED_IN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'RESCHEDULED',
  'NO_SHOW'
]);
export type AppointmentStatus = z.infer<typeof AppointmentStatusEnum>;

export const AppointmentTypeEnum = z.enum(['IN_PERSON', 'TELECONSULTATION']);
export type AppointmentType = z.infer<typeof AppointmentTypeEnum>;

export const BookAppointmentSchema = z.object({
  doctorId: z.string().uuid('Valid doctor ID is required'),
  departmentId: z.string().uuid('Valid department ID is required'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
  timeSlot: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format must be HH:MM'),
  type: AppointmentTypeEnum.default('IN_PERSON'),
  symptomsSummary: z.string().max(500, 'Symptoms summary cannot exceed 500 characters').optional(),
  patientNotes: z.string().max(1000).optional(),
  // DPDP Consent for collecting specific appointment and symptom records for medical consultation
  dpdpConsultationConsent: z.literal(true, {
    errorMap: () => ({
      message: 'Consent under the DPDP Act is required to share health symptom data with the consulting physician.'
    })
  })
});
export type BookAppointmentInput = z.infer<typeof BookAppointmentSchema>;

export const UpdateAppointmentStatusSchema = z.object({
  status: AppointmentStatusEnum,
  cancellationReason: z.string().optional(),
  rescheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  rescheduledSlot: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional()
});
export type UpdateAppointmentStatusInput = z.infer<typeof UpdateAppointmentStatusSchema>;

export const AppointmentFilterSchema = z.object({
  doctorId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  status: AppointmentStatusEnum.optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});
export type AppointmentFilter = z.infer<typeof AppointmentFilterSchema>;
