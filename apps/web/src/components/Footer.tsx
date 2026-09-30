import React from 'react';
import Link from 'next/link';
import { HeartPulse, ShieldCheck, Award, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About & Accreditations */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Aarogya Hospital</span>
            </div>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              Delivering tertiary multi-specialty clinical excellence, compassionate patient care, and 24x7 emergency medical response across India.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-[11px] bg-slate-800 border border-slate-700 text-sky-400 px-2.5 py-1 rounded">
                <Award className="w-3.5 h-3.5" />
                <span>NABH Accredited</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] bg-slate-800 border border-slate-700 text-teal-400 px-2.5 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NABL Diagnostic Labs</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] bg-slate-800 border border-slate-700 text-emerald-400 px-2.5 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Patient Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  Find Doctors & Specialists
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-white transition-colors">
                  Clinical Specialties
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="hover:text-white transition-colors">
                  Book OPD Appointment
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reports" className="hover:text-white transition-colors">
                  Download Diagnostic Reports
                </Link>
              </li>
              <li>
                <Link href="/dashboard/bills" className="hover:text-white transition-colors">
                  Pay Bills Online (Razorpay)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Departments */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Centers of Excellence</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Cardiology & Cardiac Catheterization</li>
              <li>Orthopedics & Robotic Joint Replacement</li>
              <li>Neurology & Acute Stroke Center</li>
              <li>Pediatrics & Neonatal Intensive Care (NICU)</li>
              <li>Obstetrics & Gynecology</li>
              <li>General Medicine & Diabetology</li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Emergency & Location</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 mt-1 shrink-0" />
                <span>Plot 42, Health City, Sector 5, Bengaluru, Karnataka 560100, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  Emergency: <strong className="text-red-400">1066</strong> (Toll-Free 24x7)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Hospital Board: +91 80 4000 0000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>care@aarogyahospital.example.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>OPD Hours: Mon - Sat (08:00 - 20:00)</span>
              </div>
            </div>
          </div>
        </div>

        {/* DPDP and Copyright Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Aarogya Multi-Specialty Hospital. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard/privacy" className="hover:text-slate-300">
              DPDP Act Privacy Policy & Rights
            </Link>
            <Link href="/dashboard/privacy" className="hover:text-slate-300">
              Data Retention & Consent Terms
            </Link>
            <span>DPO Contact: dpo@aarogyahospital.example.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
