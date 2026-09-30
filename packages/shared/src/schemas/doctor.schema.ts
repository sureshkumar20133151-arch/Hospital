import { z } from 'zod';

export const DayOfWeekEnum = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
]);
export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;

export const TimeSlotSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM in 24h'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM in 24h'),
  maxPatients: z.number().int().positive().default(1)
});

export const DoctorScheduleInputSchema = z.object({
  dayOfWeek: DayOfWeekEnum,
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  slotDurationMinutes: z.number().int().min(10).max(60).default(15),
  maxPatientsPerSlot: z.number().int().positive().default(1),
  isAvailable: z.boolean().default(true)
});

export const DoctorSearchQuerySchema = z.object({
  query: z.string().optional(),
  departmentId: z.string().optional(),
  specialization: z.string().optional(),
  day: DayOfWeekEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});
export type DoctorSearchQuery = z.infer<typeof DoctorSearchQuerySchema>;

export const CreateDoctorSchema = z.object({
  userId: z.string().uuid().optional(),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string(),
  departmentId: z.string().uuid(),
  specialization: z.string().min(2),
  qualifications: z.array(z.string()).min(1, 'At least one qualification required (e.g. MBBS, MD)'),
  nmcRegistrationNumber: z.string().min(3, 'National Medical Commission (NMC) registration number is mandatory'),
  experienceYears: z.number().int().min(0),
  consultationFee: z.number().positive('Consultation fee must be greater than 0'),
  languages: z.array(z.string()).min(1),
  bio: z.string().max(1000).optional(),
  roomNumber: z.string().optional(),
  availableForTeleconsultation: z.boolean().default(true),
  schedules: z.array(DoctorScheduleInputSchema).optional()
});
export type CreateDoctorInput = z.infer<typeof CreateDoctorSchema>;
