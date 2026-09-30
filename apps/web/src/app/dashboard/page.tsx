'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatINR, formatDate } from '@/lib/utils';
import {
  Calendar,
  FileText,
  FlaskConical,
  CreditCard,
  ArrowRight,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { data: appointments, isLoading: apptsLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => fetchApi<any[]>('/appointments/my-patient-appointments')
  });

  const { data: reports } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => fetchApi<any[]>('/records/reports')
  });

  const { data: bills } = useQuery({
    queryKey: ['my-bills'],
    queryFn: () => fetchApi<any[]>('/billing/my-bills')
  });

  const upcomingAppointment = appointments?.find(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );

  const pendingBills = bills?.filter((b) => b.status === 'PENDING') || [];
  const totalPendingAmount = pendingBills.reduce((acc, b) => acc + (b.netPayable || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Appointments</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {appointments?.length || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Lab Reports Available</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {reports?.length || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Pending Bills</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {formatINR(totalPendingAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment Spotlight */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            <span>Upcoming OPD Consultation</span>
          </h2>
          <Link
            href="/dashboard/appointments"
            className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {apptsLoading ? (
          <p className="text-xs text-slate-500">Checking scheduled appointments...</p>
        ) : upcomingAppointment ? (
          <div className="bg-sky-50/60 rounded-2xl border border-sky-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                  Confirmed OPD
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {formatDate(upcomingAppointment.appointmentDate)} at {upcomingAppointment.timeSlot}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Dr. {upcomingAppointment.doctor?.fullName}
              </h3>
              <p className="text-xs text-sky-800 font-semibold mt-0.5">
                {upcomingAppointment.doctor?.specialization} • {upcomingAppointment.department?.name}
              </p>
              {upcomingAppointment.doctor?.roomNumber && (
                <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Room: {upcomingAppointment.doctor.roomNumber}</span>
                </p>
              )}
            </div>

            <div className="text-center sm:text-right bg-white p-4 rounded-xl border border-sky-100 shadow-sm shrink-0 w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                Daily Token
              </span>
              <span className="text-xl font-mono font-black text-sky-700 block mt-0.5">
                {upcomingAppointment.tokenNumber}
              </span>
              <span className="text-xs text-slate-600 font-medium block mt-1">
                Fee: {formatINR(upcomingAppointment.consultationFee || 0)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active upcoming appointments</p>
            <p className="text-xs text-slate-500 mt-1">Book a consultation with our experienced clinical specialists.</p>
            <Link
              href="/book-appointment"
              className="mt-4 inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              Book OPD Appointment
            </Link>
          </div>
        )}
      </div>

      {/* Quick Services Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/reports"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-sky-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Diagnostic Lab Reports
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Securely stream signed PDF copies of blood and imaging tests.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-all" />
        </Link>

        <Link
          href="/dashboard/bills"
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-sky-300 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Hospital Bills & Invoices
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pay OPD fees or clear pharmacy invoices via Razorpay.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-all" />
        </Link>
      </div>
    </div>
  );
}
