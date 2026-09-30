import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  FileText,
  CreditCard,
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  PhoneCall,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const quickActions = [
    {
      title: 'Book OPD Appointment',
      desc: 'Choose specialist doctor, select time slot & get instant digital queue token.',
      icon: Calendar,
      href: '/book-appointment',
      color: 'from-sky-500 to-sky-600',
      badge: 'Fast Track'
    },
    {
      title: 'Find Doctors & Specialists',
      desc: 'Browse verified medical consultants across 8+ clinical disciplines.',
      icon: Search,
      href: '/doctors',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Diagnostic Lab Reports',
      desc: 'Access pathology and radiology reports securely behind verified patient auth.',
      icon: FileText,
      href: '/dashboard/reports',
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Protected'
    },
    {
      title: 'Pay Hospital Bills Online',
      desc: 'Instant consultation fees and IPD/OPD bill clearance via Razorpay.',
      icon: CreditCard,
      href: '/dashboard/bills',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const specialties = [
    {
      name: 'Cardiology',
      slug: 'cardiology',
      desc: 'Interventional cardiology, heart failure clinic, 24x7 emergency Cath Lab.',
      icon: HeartPulse,
      color: 'text-red-600 bg-red-50 border-red-100'
    },
    {
      name: 'Orthopedics',
      slug: 'orthopedics',
      desc: 'Joint replacement, robotic surgery, fracture trauma care & spine clinic.',
      icon: Bone,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      name: 'Neurology',
      slug: 'neurology',
      desc: 'Comprehensive stroke center, epilepsy management, EEG & neuro-ICU.',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      name: 'Pediatrics',
      slug: 'pediatrics',
      desc: 'Tertiary NICU/PICU, routine vaccination, and child developmental milestones.',
      icon: Baby,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    },
    {
      name: 'Obstetrics & Gynecology',
      slug: 'gynecology',
      desc: 'Maternity care, painless labor suites, high-risk pregnancy & laparoscopy.',
      icon: Activity,
      color: 'text-rose-600 bg-rose-50 border-rose-100'
    },
    {
      name: 'General Medicine',
      slug: 'general-medicine',
      desc: 'Internal medicine, diabetes, hypertension, and annual health screenings.',
      icon: HeartPulse,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-sky-100/80 text-sky-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>NABH Accredited Tertiary Healthcare Facility (India)</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Advanced Clinical Care. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600">
                Compassionate Healing.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Find experienced specialist doctors, book OPD consultations with instant digital queue tokens, access access-controlled lab reports, and manage healthcare online with full DPDP privacy protection.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book-appointment"
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 text-base"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Doctor Appointment</span>
              </Link>
              <Link
                href="/doctors"
                className="bg-white hover:bg-slate-100 text-slate-800 font-semibold px-6 py-3 rounded-xl border border-slate-300 shadow-sm transition-all flex items-center gap-2 text-base"
              >
                <Search className="w-5 h-5 text-slate-600" />
                <span>Explore Doctors</span>
              </Link>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {action.badge && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                    <span>Access now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 24x7 Emergency Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <PhoneCall className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-red-200 block">
                24x7 Emergency Response Hotline
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-0.5">
                Immediate Critical & Trauma Care
              </h2>
              <p className="text-sm text-red-100 mt-1 max-w-xl">
                Dedicated resuscitation bays, emergency operating suites, and rapid GPS ambulance dispatch across the city.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:1066"
              className="bg-white text-red-700 hover:bg-red-50 font-bold px-6 py-3.5 rounded-xl shadow-md text-base flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Dial 1066 Toll-Free</span>
            </a>
          </div>
        </div>
      </section>

      {/* Clinical Specialties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Centers of Excellence
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Multi-Specialty Clinical Departments
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl">
              Led by National Medical Commission (NMC) certified senior medical specialists utilizing state-of-the-art diagnostic and surgical equipment.
            </p>
          </div>
          <Link
            href="/departments"
            className="mt-4 md:mt-0 text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            <span>View All Specialties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((dept) => {
            const Icon = dept.icon;
            return (
              <Link
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${dept.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {dept.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600">
                  <span>View Doctors & OPD Schedule</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us & Compliance */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <Award className="w-8 h-8 text-sky-400 mb-3" />
              <h3 className="text-lg font-bold">NABH & NABL Accreditations</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Operating strictly under National Accreditation Board standards for infection control, surgical safety, and precision pathology testing.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <ShieldCheck className="w-8 h-8 text-teal-400 mb-3" />
              <h3 className="text-lg font-bold">DPDP Act 2023 Compliant</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Your medical history, prescriptions, and reports are protected by end-to-end access controls. No health records are ever made public.
              </p>
            </div>
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <Clock className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold">Digital Queue Management</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Live queue token system minimizing waiting times for out-patient consultations, with instant SMS and WhatsApp appointment reminders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
