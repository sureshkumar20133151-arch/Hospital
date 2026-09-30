"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentFilterSchema = exports.UpdateAppointmentStatusSchema = exports.BookAppointmentSchema = exports.AppointmentTypeEnum = exports.AppointmentStatusEnum = void 0;
const zod_1 = require("zod");
exports.AppointmentStatusEnum = zod_1.z.enum([
    'PENDING',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'RESCHEDULED',
    'NO_SHOW'
]);
exports.AppointmentTypeEnum = zod_1.z.enum(['IN_PERSON', 'TELECONSULTATION']);
exports.BookAppointmentSchema = zod_1.z.object({
    doctorId: zod_1.z.string().uuid('Valid doctor ID is required'),
    departmentId: zod_1.z.string().uuid('Valid department ID is required'),
    appointmentDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD'),
    timeSlot: zod_1.z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format must be HH:MM'),
    type: exports.AppointmentTypeEnum.default('IN_PERSON'),
    symptomsSummary: zod_1.z.string().max(500, 'Symptoms summary cannot exceed 500 characters').optional(),
    patientNotes: zod_1.z.string().max(1000).optional(),
    // DPDP Consent for collecting specific appointment and symptom records for medical consultation
    dpdpConsultationConsent: zod_1.z.literal(true, {
        errorMap: () => ({
            message: 'Consent under the DPDP Act is required to share health symptom data with the consulting physician.'
        })
    })
});
exports.UpdateAppointmentStatusSchema = zod_1.z.object({
    status: exports.AppointmentStatusEnum,
    cancellationReason: zod_1.z.string().optional(),
    rescheduledDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    rescheduledSlot: zod_1.z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional()
});
exports.AppointmentFilterSchema = zod_1.z.object({
    doctorId: zod_1.z.string().uuid().optional(),
    patientId: zod_1.z.string().uuid().optional(),
    status: exports.AppointmentStatusEnum.optional(),
    date: zod_1.z.string().optional(),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(10)
});
//# sourceMappingURL=appointment.schema.js.map