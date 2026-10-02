import React from 'react';
import { PhoneCall, Ambulance, Clock, Pill, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function EmergencyBanner() {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs py-2 px-4 shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: 24/7 Hospital Highlights */}
        <div className="flex items-center flex-wrap gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-red-600/90 text-white px-2.5 py-0.5 rounded-full font-semibold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>24x7 EMERGENCY & TRAUMA</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-300">
            <Ambulance className="w-3.5 h-3.5 text-red-400" />
            <span>GPS Rapid Ambulance Dispatch</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300">
            <Pill className="w-3.5 h-3.5 text-teal-400" />
            <span>24/7 In-House Pharmacy</span>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>24/7 Diagnostics & Blood Bank</span>
          </div>
        </div>

        {/* Right Side: Emergency Hotline & Cashless Insurance TPA Desk */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cashless Insurance / CMCHIS Desk</span>
          </div>

          <a
            href="tel:1066"
            className="flex items-center gap-1.5 font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-1 rounded-full shadow-sm transition-all text-xs"
          >
            <PhoneCall className="w-3 h-3 text-white" />
            <span>Emergency: 1066</span>
          </a>

          <a
            href="tel:+914527110000"
            className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
          >
            <span>OPD Enquiry: +91 452 711 0000</span>
          </a>
        </div>
      </div>
    </div>
  );
}
