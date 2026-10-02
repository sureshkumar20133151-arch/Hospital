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
  Sparkles,
  Pill,
  Ambulance,
  Building2,
  Users,
  CheckCircle2,
  Stethoscope,
  Microscope,
  ShieldAlert
} from 'lucide-react';

export default function HomePage() {
  const quickActions = [
    {
      title: 'Online OPD Booking (Line 1)',
      desc: 'Pick specialist doctor, choose time slot & get instant ON-series token.',
      icon: Calendar,
      href: '/book-appointment',
      color: 'from-sky-500 to-sky-600',
      badge: 'Token: ON-01'
    },
    {
      title: 'Direct Walk-in OPD (Line 2)',
      desc: 'Hospital reception token desk for on-the-spot visits & immediate consults.',
      icon: Users,
      href: '/departments',
      color: 'from-teal-500 to-teal-600',
      badge: 'Token: WK-01'
    },
    {
      title: '24/7 In-House Pharmacy',
      desc: 'Ground floor Block A. 100% genuine medications & doctor e-prescription fulfillment.',
      icon: Pill,
      href: '/departments',
      color: 'from-emerald-500 to-emerald-600',
      badge: '24 Hours'
    },
    {
      title: 'NABL Diagnostic Lab & Reports',
      desc: 'Access verified pathology, MRI, CT & blood test results under DPDP privacy.',
      icon: Microscope,
      href: '/dashboard/reports',
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Protected'
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
      name: 'Orthopedics & Spine',
      slug: 'orthopedics',
      desc: 'Joint replacement, robotic surgery, fracture trauma care & spine clinic.',
      icon: Bone,
      color: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      name: 'Neurology & Stroke Unit',
      slug: 'neurology',
      desc: 'Comprehensive stroke center, epilepsy management, EEG & neuro-ICU.',
      icon: Brain,
      color: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      name: 'Pediatrics & Neonatology',
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
      name: 'General Medicine & Diabetology',
      slug: 'general-medicine',
      desc: 'Internal medicine, diabetes, hypertension, and annual health screenings.',
      icon: Stethoscope,
      color: 'text-teal-600 bg-teal-50 border-teal-100'
    }
  ];

  const hospitalStats = [
    { label: 'Specialist Doctors', value: '45+' },
    { label: 'Hospital Beds & ICU', value: '250+' },
    { label: 'Satisfied Patients', value: '1.2 Lakh+' },
    { label: 'Emergency Response', value: '24/7' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section with Rich Multi-Specialty Hospital Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 pt-10 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-900 text-xs font-bold px-3 py-1.5 rounded-full mb-5 border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>NABH Accredited Tertiary Care Hospital • Madurai / India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                World-Class Healthcare,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600">
                  Trusted Specialists
                </span>{' '}
                & Zero-Wait OPD.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Serving thousands of families with advanced multi-specialty care. Choose your preferred queue: <strong>Pre-book online for scheduled slots (ON-Tokens)</strong> or <strong>walk in directly at reception (WK-Tokens)</strong>.
              </p>

              {/* Action Buttons: Line 1 vs Line 2 */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/book-appointment"
                  className="bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2.5 text-base hover:scale-[1.02]"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Online OPD (Line 1: ON-Token)</span>
                </Link>

                <Link
                  href="/doctors"
                  className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all flex items-center gap-2 text-base"
                >
                  <Search className="w-5 h-5 text-slate-600" />
                  <span>Find Doctors</span>
                </Link>
              </div>

              {/* Live Trust Badges */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dual Dedicated OPD Queues</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cashless Insurance & CMCHIS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>DPDP Act 2023 Data Privacy</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Interactive Queue & Emergency Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
                      Live Hospital Operations
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                      OPD Queue & Emergency Desk
                    </h3>
                  </div>
                  <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Now
                  </span>
                </div>

                {/* 2-Queue Visualizer */}
                <div className="mt-6 space-y-4">
                  {/* Queue 1 Box */}
                  <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-sky-600 text-white text-xs font-bold flex items-center justify-center">
                          ON
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Line 1: Online Pre-Booked</div>
                          <div className="text-[11px] text-slate-500">Website Slot Reservation</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-sky-200 text-sky-800">
                        Token: ON-01...
                      </span>
                    </div>
                  </div>

                  {/* Queue 2 Box */}
                  <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                          WK
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Line 2: Direct Walk-In</div>
                          <div className="text-[11px] text-slate-500">Front Desk Physical Entry</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-teal-200 text-teal-800">
                        Token: WK-01...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xl font-black text-slate-900">1066</div>
                    <div className="text-[11px] font-semibold text-red-600">Ambulance Hotline</div>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-xl font-black text-slate-900">24x7</div>
                    <div className="text-[11px] font-semibold text-emerald-600">In-House Pharmacy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {action.badge && (
                        <span className="text-[11px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-100 px-2.5 py-0.5 rounded-full">
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
                    <span>Access service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Key Numbers Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            {hospitalStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 24x7 Emergency Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
              className="bg-white text-red-700 hover:bg-red-50 font-bold px-6 py-3.5 rounded-xl shadow-md text-base flex items-center gap-2 transition-transform hover:scale-105"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Dial 1066 (24x7 Hotline)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Clinical Specialties Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Centres of Excellence
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
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all flex flex-col justify-between group"
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
              <h3 className="text-lg font-bold">Dual Dedicated OPD Queues</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Online reservations (Line 1: ON-Tokens) and direct reception check-ins (Line 2: WK-Tokens) running in parallel without crowding.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
