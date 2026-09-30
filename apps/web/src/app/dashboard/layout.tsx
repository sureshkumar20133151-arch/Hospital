'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  FlaskConical,
  CreditCard,
  ShieldCheck,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + pathname);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Appointments', href: '/dashboard/appointments', icon: Calendar },
    { label: 'Prescriptions & Notes', href: '/dashboard/records', icon: FileText },
    { label: 'Diagnostic Lab Reports', href: '/dashboard/reports', icon: FlaskConical },
    { label: 'Bills & Payments', href: '/dashboard/bills', icon: CreditCard },
    { label: 'DPDP Privacy Center', href: '/dashboard/privacy', icon: ShieldCheck }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Patient Profile Header Card */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {user.patientProfile?.fullName?.slice(0, 2).toUpperCase() || 'PT'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold">{user.patientProfile?.fullName || 'Patient Portal'}</h1>
                <span className="text-[11px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-medium">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Unique Hospital ID (UHID):{' '}
                <strong className="text-sky-300 font-mono text-sm tracking-wide">
                  {user.patientProfile?.uhid || 'AH-XXXXX'}
                </strong>
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                <span>Blood: <strong className="text-white">{user.patientProfile?.bloodGroup || 'O+'}</strong></span>
                <span>•</span>
                <span>Contact: <strong className="text-white">{user.phone}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book-appointment"
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book OPD Token</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 block">
                Patient Services
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-sky-600" />}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-3">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
