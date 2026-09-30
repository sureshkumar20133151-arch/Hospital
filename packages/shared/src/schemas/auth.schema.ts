import { z } from 'zod';

export const UserRoleEnum = z.enum([
  'PATIENT',
  'DOCTOR',
  'RECEPTIONIST',
  'ADMIN',
  'SUPER_ADMIN'
]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const GenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
export type Gender = z.infer<typeof GenderEnum>;

export const BloodGroupEnum = z.enum([
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
export type BloodGroup = z.infer<typeof BloodGroupEnum>;

// Indian mobile number regex: +91 followed by 10 digits or 10 digits starting with 6,7,8,9
export const IndianPhoneRegex = /^(\+91[\-\s]?)?[6789]\d{9}$/;

export const RegisterPatientSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(IndianPhoneRegex, 'Please enter a valid 10-digit Indian phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  dateOfBirth: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD')),
  gender: GenderEnum,
  bloodGroup: BloodGroupEnum.optional().default('UNKNOWN'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().regex(IndianPhoneRegex, 'Invalid phone').optional().or(z.literal('')),
  // DPDP Act Requirement: Explicit consent for collecting identification and contact information
  dpdpConsentAccepted: z.literal(true, {
    errorMap: () => ({
      message: 'You must provide consent under the Digital Personal Data Protection (DPDP) Act to register.'
    })
  })
});
export type RegisterPatientInput = z.infer<typeof RegisterPatientSchema>;

export const StaffRegisterSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(IndianPhoneRegex),
  password: z.string().min(8),
  role: z.enum(['DOCTOR', 'RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN']),
  departmentId: z.string().uuid().optional(),
  // For doctors:
  nmcRegistrationNumber: z.string().optional(),
  specialization: z.string().optional(),
  qualification: z.string().optional(),
  experienceYears: z.number().int().min(0).optional(),
  consultationFee: z.number().positive().optional()
});
export type StaffRegisterInput = z.infer<typeof StaffRegisterSchema>;

export const LoginSchema = z.object({
  identifier: z.string().min(3, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required')
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(IndianPhoneRegex).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().regex(IndianPhoneRegex).optional().or(z.literal('')),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit Indian PIN code').optional().or(z.literal('')),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional()
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
