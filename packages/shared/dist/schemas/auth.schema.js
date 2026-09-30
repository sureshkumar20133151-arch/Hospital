"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileSchema = exports.LoginSchema = exports.StaffRegisterSchema = exports.RegisterPatientSchema = exports.IndianPhoneRegex = exports.BloodGroupEnum = exports.GenderEnum = exports.UserRoleEnum = void 0;
const zod_1 = require("zod");
exports.UserRoleEnum = zod_1.z.enum([
    'PATIENT',
    'DOCTOR',
    'RECEPTIONIST',
    'ADMIN',
    'SUPER_ADMIN'
]);
exports.GenderEnum = zod_1.z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
exports.BloodGroupEnum = zod_1.z.enum([
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE',
    'UNKNOWN'
]);
// Indian mobile number regex: +91 followed by 10 digits or 10 digits starting with 6,7,8,9
exports.IndianPhoneRegex = /^(\+91[\-\s]?)?[6789]\d{9}$/;
exports.RegisterPatientSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters').max(100),
    email: zod_1.z.string().email('Please enter a valid email address'),
    phone: zod_1.z.string().regex(exports.IndianPhoneRegex, 'Please enter a valid 10-digit Indian phone number'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    dateOfBirth: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD')),
    gender: exports.GenderEnum,
    bloodGroup: exports.BloodGroupEnum.optional().default('UNKNOWN'),
    emergencyContactName: zod_1.z.string().optional(),
    emergencyContactPhone: zod_1.z.string().regex(exports.IndianPhoneRegex, 'Invalid phone').optional().or(zod_1.z.literal('')),
    // DPDP Act Requirement: Explicit consent for collecting identification and contact information
    dpdpConsentAccepted: zod_1.z.literal(true, {
        errorMap: () => ({
            message: 'You must provide consent under the Digital Personal Data Protection (DPDP) Act to register.'
        })
    })
});
exports.StaffRegisterSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().regex(exports.IndianPhoneRegex),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['DOCTOR', 'RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN']),
    departmentId: zod_1.z.string().uuid().optional(),
    // For doctors:
    nmcRegistrationNumber: zod_1.z.string().optional(),
    specialization: zod_1.z.string().optional(),
    qualification: zod_1.z.string().optional(),
    experienceYears: zod_1.z.number().int().min(0).optional(),
    consultationFee: zod_1.z.number().positive().optional()
});
exports.LoginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(3, 'Email or phone is required'),
    password: zod_1.z.string().min(1, 'Password is required')
});
exports.UpdateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(100).optional(),
    phone: zod_1.z.string().regex(exports.IndianPhoneRegex).optional(),
    emergencyContactName: zod_1.z.string().optional(),
    emergencyContactPhone: zod_1.z.string().regex(exports.IndianPhoneRegex).optional().or(zod_1.z.literal('')),
    addressLine1: zod_1.z.string().optional(),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pincode: zod_1.z.string().regex(/^\d{6}$/, 'Enter valid 6-digit Indian PIN code').optional().or(zod_1.z.literal('')),
    allergies: zod_1.z.array(zod_1.z.string()).optional(),
    chronicConditions: zod_1.z.array(zod_1.z.string()).optional()
});
//# sourceMappingURL=auth.schema.js.map