import React from 'react';
import { PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function EmergencyBanner() {
  return (
    <div className="bg-red-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-semibold uppercase tracking-wider text-[11px] sm:text-xs bg-red-800 px-1.5 py-0.5 rounded">
            24x7 Emergency & Trauma
          </span>
          <span className="hidden md:inline text-red-100">Immediate Ambulance & Critical Care response</span>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <a
            href="tel:1066"
            className="flex items-center gap-1.5 font-bold hover:underline bg-white text-red-700 px-2.5 py-0.5 rounded-full shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Hotline: 1066</span>
          </a>
          <a href="tel:+918040000000" className="hidden sm:flex items-center gap-1 hover:text-red-100">
            <span>Hospital Board: +91 80 4000 0000</span>
          </a>
        </div>
      </div>
    </div>
  );
}
