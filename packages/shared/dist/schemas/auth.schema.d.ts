import { z } from 'zod';
export declare const UserRoleEnum: z.ZodEnum<["PATIENT", "DOCTOR", "RECEPTIONIST", "ADMIN", "SUPER_ADMIN"]>;
export type UserRole = z.infer<typeof UserRoleEnum>;
export declare const GenderEnum: z.ZodEnum<["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]>;
export type Gender = z.infer<typeof GenderEnum>;
export declare const BloodGroupEnum: z.ZodEnum<["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "UNKNOWN"]>;
export type BloodGroup = z.infer<typeof BloodGroupEnum>;
export declare const IndianPhoneRegex: RegExp;
export declare const RegisterPatientSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    dateOfBirth: z.ZodUnion<[z.ZodString, z.ZodString]>;
    gender: z.ZodEnum<["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]>;
    bloodGroup: z.ZodDefault<z.ZodOptional<z.ZodEnum<["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE", "UNKNOWN"]>>>;
    emergencyContactName: z.ZodOptional<z.ZodString>;
    emergencyContactPhone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    dpdpConsentAccepted: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
    bloodGroup: "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE" | "UNKNOWN";
    dpdpConsentAccepted: true;
    emergencyContactName?: string | undefined;
    emergencyContactPhone?: string | undefined;
}, {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
    dpdpConsentAccepted: true;
    bloodGroup?: "A_POSITIVE" | "A_NEGATIVE" | "B_POSITIVE" | "B_NEGATIVE" | "AB_POSITIVE" | "AB_NEGATIVE" | "O_POSITIVE" | "O_NEGATIVE" | "UNKNOWN" | undefined;
    emergencyContactName?: string | undefined;
    emergencyContactPhone?: string | undefined;
}>;
export type RegisterPatientInput = z.infer<typeof RegisterPatientSchema>;
export declare const StaffRegisterSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["DOCTOR", "RECEPTIONIST", "ADMIN", "SUPER_ADMIN"]>;
    departmentId: z.ZodOptional<z.ZodString>;
    nmcRegistrationNumber: z.ZodOptional<z.ZodString>;
    specialization: z.ZodOptional<z.ZodString>;
    qualification: z.ZodOptional<z.ZodString>;
    experienceYears: z.ZodOptional<z.ZodNumber>;
    consultationFee: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: "DOCTOR" | "RECEPTIONIST" | "ADMIN" | "SUPER_ADMIN";
    departmentId?: string | undefined;
    nmcRegistrationNumber?: string | undefined;
    specialization?: string | undefined;
    qualification?: string | undefined;
    experienceYears?: number | undefined;
    consultationFee?: number | undefined;
}, {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: "DOCTOR" | "RECEPTIONIST" | "ADMIN" | "SUPER_ADMIN";
    departmentId?: string | undefined;
    nmcRegistrationNumber?: string | undefined;
    specialization?: string | undefined;
    qualification?: string | undefined;
    experienceYears?: number | undefined;
    consultationFee?: number | undefined;
}>;
export type StaffRegisterInput = z.infer<typeof StaffRegisterSchema>;
export declare const LoginSchema: z.ZodObject<{
    identifier: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    identifier: string;
}, {
    password: string;
    identifier: string;
}>;
export type LoginInput = z.infer<typeof LoginSchema>;
export declare const UpdateProfileSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    emergencyContactName: z.ZodOptional<z.ZodString>;
    emergencyContactPhone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    addressLine1: z.ZodOptional<z.ZodString>;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    pincode: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    allergies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    chronicConditions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    fullName?: string | undefined;
    phone?: string | undefined;
    emergencyContactName?: string | undefined;
    emergencyContactPhone?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    pincode?: string | undefined;
    allergies?: string[] | undefined;
    chronicConditions?: string[] | undefined;
}, {
    fullName?: string | undefined;
    phone?: string | undefined;
    emergencyContactName?: string | undefined;
    emergencyContactPhone?: string | undefined;
    addressLine1?: string | undefined;
    addressLine2?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    pincode?: string | undefined;
    allergies?: string[] | undefined;
    chronicConditions?: string[] | undefined;
}>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
//# sourceMappingURL=auth.schema.d.ts.map