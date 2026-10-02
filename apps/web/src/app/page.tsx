'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Award,
  Ambulance,
  Pill,
  Clock,
  ArrowRight,
  HeartPulse,
  Bone,
  Brain,
  Baby,
  Activity,
  Stethoscope,
  Microscope,
  Users,
  Star,
  Building2
} from 'lucide-react';

export default function HomePage() {
  // Slider slides referencing authentic hospital hero banners from Velammal, MMHRC, Preethi & Saravana
  const heroSlides = [
    {
      id: 1,
      image: '/images/hospital_building_large.jpg',
      badge: 'NABH & NABL ACCREDITED TERTIARY HOSPITAL',
      title: 'Aarogya Multi-Specialty Hospital',
      highlight: 'Advanced Medical Excellence & Compassionate Healing',
      description:
        'A 250+ bed premier hospital facility with 45+ senior consultant physicians, robotic surgical suites, and dedicated 24x7 emergency & trauma response.',
      primaryBtn: { text: 'Book Online OPD (Line 1: ON-Token)', href: '/book-appointment' },
      secondaryBtn: { text: 'Meet Our 45+ Specialists', href: '/doctors' },
      tagline: 'Dual Dedicated OPD Queues • 24/7 In-House Pharmacy • Cashless TPA / CMCHIS'
    },
    {
      id: 2,
      image: '/images/ref_mmhrc_banner.jpg',
      badge: 'MULTI-SPECIALTY CENTRES OF EXCELLENCE',
      title: 'Expert Clinical Care in Cardiology & Surgery',
      highlight: 'State-of-the-Art Cath Lab & Intensive Care',
      description:
        'Equipped with advanced diagnostic laboratories, digital imaging, and high-precision surgical theaters led by National Medical Commission (NMC) specialists.',
      primaryBtn: { text: 'Find Doctors & OPD Schedule', href: '/doctors' },
      secondaryBtn: { text: 'Explore Specialties', href: '/departments' },
      tagline: 'Over 1.2 Lakh+ Treated Patients • Zero Waiting Hall Crowding'
    },
    {
      id: 3,
      image: '/images/ref_preethi_banner.jpg',
      badge: '24x7 EMERGENCY & TRAUMA CRITICAL CARE',
      title: 'Orthopaedics, Joint Replacement & Emergency',
      highlight: 'Instant Ambulance & Resuscitation Response',
      description:
        '24x7 GPS Ambulance dispatch across the city, round-the-clock blood bank, emergency trauma surgery, and on-site dispensing pharmacy.',
      primaryBtn: { text: 'Dial 1066 Emergency Hotline', href: 'tel:1066' },
      secondaryBtn: { text: 'Book Consultation Slot', href: '/book-appointment' },
      tagline: 'Emergency Hotline 1066 • Ground Floor 24x7 Pharmacy (Block A)'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const quickActions = [
    {
      title: 'Online OPD Booking (Line 1)',
      desc: 'Pick specialist doctor, choose time slot & get instant ON-series token.',
      icon: Calendar,
      href: '/book-appointment',
      color: 'from-sky-500 to-sky-600',
      badge: 'Token: ON-01',
      img: '/images/doctor_consultation.jpg'
    },
    {
      title: 'Direct Walk-in OPD (Line 2)',
      desc: 'Hospital reception token desk for on-the-spot visits & immediate consults.',
      icon: Users,
      href: '/departments',
      color: 'from-teal-500 to-teal-600',
      badge: 'Token: WK-01',
      img: '/images/nurse_care.jpg'
    },
    {
      title: '24/7 In-House Pharmacy',
      desc: 'Ground floor Block A. 100% genuine medications & doctor e-prescription fulfillment.',
      icon: Pill,
      href: '/departments',
      color: 'from-emerald-500 to-emerald-600',
      badge: '24 Hours',
      img: '/images/pharmacy_store.jpg'
    },
    {
      title: 'NABL Diagnostic Lab & Reports',
      desc: 'Access verified pathology, MRI, CT & blood test results under DPDP privacy.',
      icon: Microscope,
      href: '/dashboard/reports',
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Protected',
      img: '/images/hospital_building.jpg'
    }
  ];

  const specialties = [
    {
      name: 'Cardiology & Cath Lab',
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
      
      {/* 🏥 1. Full-Size Hospital Hero Carousel Banner */}
      <section className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-slate-950">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Full-Size Hospital / Medical Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover object-center opacity-45 scale-105 transform transition-transform duration-[6000ms]"
            />

            {/* Gradient Overlays for High-Contrast Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>

            {/* Slide Content */}
            <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl text-left">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-sky-500/20 backdrop-blur-md text-sky-200 border border-sky-400/30 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>{slide.badge}</span>
                </div>

                {/* Title & Highlight */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                  {slide.title} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                    {slide.highlight}
                  </span>
                </h1>

                <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
                  {slide.description}
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.primaryBtn.href}
                    className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl transition-all flex items-center gap-2.5 text-sm sm:text-base hover:scale-[1.02]"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>{slide.primaryBtn.text}</span>
                  </Link>

                  <Link
                    href={slide.secondaryBtn.href}
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md font-bold px-6 py-3.5 rounded-xl border border-white/30 shadow-md transition-all flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Search className="w-5 h-5 text-sky-300" />
                    <span>{slide.secondaryBtn.text}</span>
                  </Link>
                </div>

                {/* Tagline */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{slide.tagline}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

        {/* Carousel Prev / Next Controls */}
        <div className="absolute bottom-6 right-6 sm:right-12 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur border border-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-6 bg-sky-400' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur border border-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 2. Dual Queue & Live Doctor Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Doctor Team & Clinical Faculty */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <div className="relative h-[360px] sm:h-[420px] w-full">
                <Image
                  src="/images/doctors_team.jpg"
                  alt="Aarogya Multi-Specialty Hospital Medical Team of Doctors and Nurses"
                  fill
                  priority
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>
                
                {/* Overlay Text */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-200">Board-Certified Senior Consultants</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    45+ Full-Time Medical Specialists, Surgeons & Critical Care Nurses
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Delivering clinical excellence across Cardiology, Orthopedics, Neurology, Pediatrics, and Trauma surgery.
                  </p>
                </div>
              </div>

              {/* Floating Live Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-red-600 tracking-wider">Rapid Response</div>
                  <div className="text-xs font-black text-slate-900">1066 Ambulance</div>
                </div>
              </div>

              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-100 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Live Queue</div>
                  <div className="text-xs font-bold font-mono text-emerald-700">Token: ON-01</div>
                </div>
              </div>
            </div>

            {/* Mini Facility Previews */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="/images/doctor_consultation.jpg"
                    alt="Doctor Consultation OPD"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">OPD Consultation</div>
                  <div className="text-[11px] text-slate-500">Dual Dedicated Lines</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src="/images/pharmacy_store.jpg"
                    alt="In-house Pharmacy"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">24/7 In-House Pharmacy</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">Block A Ground Floor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Two-Queue Logic Explainer */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
                Zero Waiting Hall Crowding
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                How Our Dual-Queue System Works
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Whether you plan in advance or visit unexpectedly, our separate queues ensure fair, transparent, and prompt consultations.
              </p>

              <div className="mt-6 space-y-4">
                {/* Line 1 Card */}
                <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                        ON
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Line 1: Online Pre-Booked</div>
                        <div className="text-xs text-slate-500">Reserved via Web Portal with Time-Slot</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white text-sky-700 px-2 py-1 rounded-md border border-sky-200">
                      ON-Series
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 pl-11">
                    Pay online, arrive at your designated slot, check in, and proceed with priority.
                  </p>
                </div>

                {/* Line 2 Card */}
                <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                        WK
                      </span>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Line 2: Direct Walk-In</div>
                        <div className="text-xs text-slate-500">Reception Front-Desk Registration</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white text-teal-700 px-2 py-1 rounded-md border border-teal-200">
                      WK-Series
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 pl-11">
                    Instant registration at hospital entrance. Called in sequence by consulting physician.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">Need Immediate Help?</div>
                  <div className="text-xs text-red-600 font-semibold">Toll-Free 1066 (24x7)</div>
                </div>
                <Link
                  href="/book-appointment"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  Book Token Now
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Key Hospital Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          {hospitalStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Quick Action Grid with Photographic Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Patient Convenience
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Access Key Hospital Services
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Designed for swift booking, seamless medicine pickup, and private medical report downloads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={action.img}
                    alt={action.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  {action.badge && (
                    <span className="absolute top-3 right-3 text-[11px] font-bold uppercase tracking-wider bg-white/95 text-sky-800 px-2.5 py-0.5 rounded-full shadow">
                      {action.badge}
                    </span>
                  )}
                </div>
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {action.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                    <span>Access service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. 24x7 Emergency Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

      {/* 5. Clinical Specialties Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

      {/* 6. Why Choose Us & Accreditations */}
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
