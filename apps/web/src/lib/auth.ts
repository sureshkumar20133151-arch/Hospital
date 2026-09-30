import { create } from 'zustand';
import { fetchApi } from './api';

export interface PatientProfile {
  id: string;
  uhid: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface UserSession {
  id: string;
  email: string;
  phone: string;
  role: 'PATIENT' | 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN' | 'SUPER_ADMIN';
  patientProfile?: PatientProfile;
}

interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserSession | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await fetchApi<UserSession>('/auth/me');
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }
}));
