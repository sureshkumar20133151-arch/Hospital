'use client';

import React from 'react';
import { useStaffAuthStore } from '@/lib/auth';
import { ShieldCheck, PhoneCall, Bell, Clock } from 'lucide-react';

export default function AdminNavbar() {
  const { user } = useStaffAuthStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500">
          Hospital Node: <strong className="text-slate-800">Bengaluru Tertiary Care Center</strong>
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DPDP Act Audit Trail Live</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-bold">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Hotline: 1066</span>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
            {user?.fullName?.slice(0, 2).toUpperCase() || 'ST'}
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              {user?.fullName}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
