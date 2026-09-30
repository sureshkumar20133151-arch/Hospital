'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Calendar, User, LogOut, Menu, X, Shield, Activity } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { label: 'Find Doctors', href: '/doctors' },
    { label: 'Specialties', href: '/departments' },
    { label: 'Book Appointment', href: '/book-appointment', highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight block leading-tight">
                Aarogya Hospital
              </span>
              <span className="text-[11px] font-medium text-sky-700 tracking-wide block uppercase">
                Multi-Specialty Healthcare
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.highlight
                    ? 'bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5'
                    : pathname === link.href
                    ? 'text-sky-600 font-semibold'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                {link.highlight && <Calendar className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth State Button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-1.5 rounded-lg text-sm font-medium border border-slate-200"
                >
                  <User className="w-4 h-4 text-sky-600" />
                  <span>{user.patientProfile?.fullName || 'My Portal'}</span>
                  {user.patientProfile?.uhid && (
                    <span className="bg-sky-100 text-sky-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold">
                      {user.patientProfile.uhid}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => logout()}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-slate-700 hover:text-sky-600 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800 hover:text-sky-600"
          >
            Find Doctors
          </Link>
          <Link
            href="/departments"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800 hover:text-sky-600"
          >
            Specialties & Departments
          </Link>
          <Link
            href="/book-appointment"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-sky-600"
          >
            Book Appointment
          </Link>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm font-medium text-slate-900"
                >
                  <span>Patient Dashboard ({user.patientProfile?.fullName})</span>
                  <User className="w-4 h-4 text-sky-600" />
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left p-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium bg-sky-600 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
