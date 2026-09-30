import { create } from 'zustand';
import { fetchApi } from './api';

export type StaffRole = 'DOCTOR' | 'RECEPTIONIST' | 'ADMIN' | 'SUPER_ADMIN';

export interface StaffUser {
  id: string;
  email: string;
  phone: string;
  role: StaffRole;
  fullName: string;
  doctorProfile?: {
    id: string;
    fullName: string;
    specialization: string;
    departmentId: string;
    nmcRegistrationNumber: string;
    roomNumber?: string;
  };
}

interface StaffAuthState {
  user: StaffUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: StaffUser | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useStaffAuthStore = create<StaffAuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await fetchApi<StaffUser>('/auth/me');
      if (['DOCTOR', 'RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
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
        window.location.href = '/login';
      }
    }
  }
}));
