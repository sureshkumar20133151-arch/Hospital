'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStaffAuthStore } from '@/lib/auth';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building,
  Stethoscope,
  ShieldCheck,
  LogOut,
  HeartPulse,
  ChevronRight
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useStaffAuthStore();

  const role = user?.role || 'RECEPTIONIST';

  const allItems = [
    {
      label: 'Command Center',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'RECEPTIONIST']
    },
    {
      label: 'OPD Appointments & Queue',
      href: '/dashboard/appointments',
      icon: Calendar,
      roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'RECEPTIONIST']
    },
    {
      label: 'Clinical Encounter & Rx',
      href: '/dashboard/consultations',
      icon: Stethoscope,
      roles: ['SUPER_ADMIN', 'ADMIN', 'DOCTOR']
    },
    {
      label: 'Doctors & Schedules',
      href: '/dashboard/doctors',
      icon: Users,
      roles: ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST']
    },
    {
      label: 'Clinical Specialties',
      href: '/dashboard/departments',
      icon: Building,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      label: 'DPDP Security & Audits',
      href: '/dashboard/audit-logs',
      icon: ShieldCheck,
      roles: ['SUPER_ADMIN', 'ADMIN']
    }
  ];

  const visibleItems = allItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight block leading-tight">
              Aarogya HMS
            </span>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
              Staff & Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
            Navigation
          </span>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Staff User Card & Logout */}
      <div className="pt-4 border-t border-slate-800">
        <div className="px-3 py-2 bg-slate-800/80 rounded-xl mb-3">
          <span className="text-xs font-bold text-white block truncate">
            {user?.fullName || 'Hospital Staff'}
          </span>
          <span className="text-[10px] text-sky-400 font-mono block uppercase font-semibold">
            {user?.role.replace('_', ' ')}
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
