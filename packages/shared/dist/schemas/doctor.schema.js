"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDoctorSchema = exports.DoctorSearchQuerySchema = exports.DoctorScheduleInputSchema = exports.TimeSlotSchema = exports.DayOfWeekEnum = void 0;
const zod_1 = require("zod");
exports.DayOfWeekEnum = zod_1.z.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
]);
exports.TimeSlotSchema = zod_1.z.object({
    startTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM in 24h'),
    endTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM in 24h'),
    maxPatients: zod_1.z.number().int().positive().default(1)
});
exports.DoctorScheduleInputSchema = zod_1.z.object({
    dayOfWeek: exports.DayOfWeekEnum,
    startTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    endTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    slotDurationMinutes: zod_1.z.number().int().min(10).max(60).default(15),
    maxPatientsPerSlot: zod_1.z.number().int().positive().default(1),
    isAvailable: zod_1.z.boolean().default(true)
});
exports.DoctorSearchQuerySchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    departmentId: zod_1.z.string().optional(),
    specialization: zod_1.z.string().optional(),
    day: exports.DayOfWeekEnum.optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(10)
});
exports.CreateDoctorSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid().optional(),
    fullName: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    departmentId: zod_1.z.string().uuid(),
    specialization: zod_1.z.string().min(2),
    qualifications: zod_1.z.array(zod_1.z.string()).min(1, 'At least one qualification required (e.g. MBBS, MD)'),
    nmcRegistrationNumber: zod_1.z.string().min(3, 'National Medical Commission (NMC) registration number is mandatory'),
    experienceYears: zod_1.z.number().int().min(0),
    consultationFee: zod_1.z.number().positive('Consultation fee must be greater than 0'),
    languages: zod_1.z.array(zod_1.z.string()).min(1),
    bio: zod_1.z.string().max(1000).optional(),
    roomNumber: zod_1.z.string().optional(),
    availableForTeleconsultation: zod_1.z.boolean().default(true),
    schedules: zod_1.z.array(exports.DoctorScheduleInputSchema).optional()
});
//# sourceMappingURL=doctor.schema.js.map