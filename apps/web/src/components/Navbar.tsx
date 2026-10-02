'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Activity,
  Bone,
  Brain,
  Baby,
  Stethoscope,
  Pill,
  Syringe,
  Microscope,
  Ambulance,
  Building2,
  FileCheck2,
  Award,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const specialtiesList = [
    { name: 'Cardiology', href: '/departments/cardiology', icon: HeartPulse, desc: 'Cath Lab, Angioplasty & Heart Failure Clinic' },
    { name: 'Orthopedics & Spine', href: '/departments/orthopedics', icon: Bone, desc: 'Robotic Joint Replacement & Fracture Trauma' },
    { name: 'Neurology & Stroke', href: '/departments/neurology', icon: Brain, desc: 'Acute Stroke Unit, Epilepsy & Brain Spine Care' },
    { name: 'Pediatrics & NICU', href: '/departments/pediatrics', icon: Baby, desc: 'Tertiary Neonatal ICU & Child Health' },
    { name: 'Obstetrics & Gynaecology', href: '/departments/gynecology', icon: Activity, desc: 'Maternity Care, High-Risk Pregnancy & Laparoscopy' },
    { name: 'General Medicine & Diabetology', href: '/departments/general-medicine', icon: Stethoscope, desc: 'Internal Medicine, Hypertension & Lifestyle Clinics' }
  ];

  const facilitiesList = [
    { name: '24/7 In-House Pharmacy', href: '/departments', icon: Pill, desc: 'Ground Floor Block A, 100% Genuine Medicines' },
    { name: '24/7 Diagnostic Lab & Imaging', href: '/dashboard/reports', icon: Microscope, desc: 'CT, MRI, Ultrasound, NABL Automated Pathology' },
    { name: 'Trauma & Critical Care (ICU)', href: '/departments', icon: Syringe, desc: 'Multi-Bedded Medical, Surgical & Cardiac ICU' },
    { name: 'Emergency GPS Ambulance', href: 'tel:1066', icon: Ambulance, desc: 'Fully Equipped Advanced Cardiac Life Support Units' }
  ];

  const patientSchemes = [
    { name: 'Cashless Insurance (TPA)', href: '/book-appointment', icon: Shield, desc: 'Star Health, HDFC ERGO, Medi Assist, Paramount & 35+ TPAs' },
    { name: 'CM Comprehensive Scheme (CMCHIS)', href: '/book-appointment', icon: FileCheck2, desc: 'Tamil Nadu Government Healthcare Scheme Support' },
    { name: 'Master Health Checkup', href: '/book-appointment', icon: Sparkles, desc: 'Executive Cardiac, Diabetic & Comprehensive Screenings' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand (Madurai / India Tertiary Hospital Styling) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 tracking-tight block leading-tight">
                  Aarogya
                </span>
                <span className="text-xs bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded border border-sky-200">
                  HOSPITAL
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider block uppercase">
                Tertiary Multi-Specialty Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Professional Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/' ? 'text-sky-600 font-semibold' : 'text-slate-700 hover:text-sky-600'
              }`}
            >
              Home
            </Link>

            {/* Dropdown 1: Centres of Excellence / Specialties */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'specialties' ? null : 'specialties')}
                className={`px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1 transition-colors ${
                  activeDropdown === 'specialties' ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600'
                }`}
              >
                <span>Specialties</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'specialties' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'specialties' && (
                <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Centres of Clinical Excellence</span>
                    <Link
                      href="/departments"
                      onClick={() => setActiveDropdown(null)}
                      className="text-xs font-semibold text-sky-600 hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {specialtiesList.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50/70 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-sky-600">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-500 leading-snug">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 2: 24/7 Facilities & In-House Services */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'facilities' ? null : 'facilities')}
                className={`px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1 transition-colors ${
                  activeDropdown === 'facilities' ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600'
                }`}
              >
                <span>24/7 Facilities</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'facilities' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'facilities' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                  <div className="p-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital Infrastructure</span>
                  </div>
                  <div className="space-y-1">
                    {facilitiesList.map((fac) => {
                      const Icon = fac.icon;
                      return (
                        <Link
                          key={fac.name}
                          href={fac.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
                              {fac.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {fac.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 3: Insurance & Health Schemes */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'schemes' ? null : 'schemes')}
                className={`px-3 py-2 text-sm font-medium rounded-lg inline-flex items-center gap-1 transition-colors ${
                  activeDropdown === 'schemes' ? 'text-sky-600 bg-sky-50' : 'text-slate-700 hover:text-sky-600'
                }`}
              >
                <span>Insurance & Schemes</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'schemes' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'schemes' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                  <div className="p-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cashless TPA & Government Tie-ups</span>
                  </div>
                  <div className="space-y-1">
                    {patientSchemes.map((scheme) => {
                      const Icon = scheme.icon;
                      return (
                        <div
                          key={scheme.name}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800">
                              {scheme.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {scheme.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Link: Find Doctors */}
            <Link
              href="/doctors"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/doctors' ? 'text-sky-600 font-semibold' : 'text-slate-700 hover:text-sky-600'
              }`}
            >
              Find Doctors
            </Link>
          </nav>

          {/* Right Action: Book Appointment CTA + Auth Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Primary Action Button */}
            <Link
              href="/book-appointment"
              className="bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book OPD Appointment</span>
            </Link>

            {/* User Session Profile / Login */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200"
                >
                  <User className="w-4 h-4 text-sky-600" />
                  <span>{user.patientProfile?.fullName || 'Patient Portal'}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold text-slate-700 hover:text-sky-600 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-5 pt-4 pb-8 space-y-4 shadow-xl">
          <Link
            href="/book-appointment"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold py-3 rounded-xl shadow-md"
          >
            Book OPD Appointment
          </Link>

          <div className="space-y-1 font-medium text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm border-b border-slate-100"
            >
              Home
            </Link>
            <Link
              href="/departments"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm border-b border-slate-100"
            >
              Clinical Specialties & Departments
            </Link>
            <Link
              href="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm border-b border-slate-100"
            >
              Find Doctors & Consultations
            </Link>
            <Link
              href="/dashboard/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm border-b border-slate-100"
            >
              24/7 Diagnostic Lab Reports
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 bg-slate-100 rounded-xl text-sm font-semibold text-slate-900"
                >
                  <span>Patient Dashboard ({user.patientProfile?.fullName})</span>
                  <User className="w-4 h-4 text-sky-600" />
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left p-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold border border-slate-300 rounded-xl text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-xl"
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
