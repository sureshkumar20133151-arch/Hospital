export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN' | 'SUPER_ADMIN';
  patientProfileId?: string;
  doctorProfileId?: string;
}

export interface DoctorListItem {
  id: string;
  userId: string;
  fullName: string;
  specialization: string;
  departmentId: string;
  departmentName: string;
  qualifications: string[];
  experienceYears: number;
  consultationFee: number;
  languages: string[];
  avatarUrl?: string | null;
  availableForTeleconsultation: boolean;
  roomNumber?: string | null;
  bio?: string | null;
  nmcRegistrationNumber?: string;
}

export interface AppointmentSummary {
  id: string;
  tokenNumber: string;
  appointmentDate: string;
  timeSlot: string;
  type: 'IN_PERSON' | 'TELECONSULTATION';
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'NO_SHOW';
  doctorId: string;
  doctorName: string;
  departmentName: string;
  patientId: string;
  patientName: string;
  consultationFee: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  meetLink?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  iconName?: string;
  headOfDepartment?: string;
  activeDoctorsCount?: number;
}
