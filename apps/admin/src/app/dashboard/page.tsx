'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useStaffAuthStore } from '@/lib/auth';
import { formatINR, formatDate } from '@/lib/utils';
import {
  Users,
  Calendar,
  Building,
  CreditCard,
  Clock,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function StaffCommandCenter() {
  const { user } = useStaffAuthStore();
  const role = user?.role || 'ADMIN';

  // Fetch doctors count
  const { data: doctorsData } = useQuery({
    queryKey: ['admin-doctors'],
    queryFn: () => fetchApi<{ total: number }>('/doctors?limit=1')
  });

  // Fetch departments count
  const { data: departments } = useQuery({
    queryKey: ['admin-departments'],
    queryFn: () => fetchApi<any[]>('/departments')
  });

  // Fetch appointments
  const { data: appointments, isLoading: apptsLoading } = useQuery({
    queryKey: ['admin-appointments'],
    queryFn: () => fetchApi<any[]>('/appointments/doctor-appointments')
  });

  const totalAppointments = appointments?.length || 0;
  const confirmedCount = appointments?.filter((a) => a.status === 'CONFIRMED' || a.status === 'CHECKED_IN').length || 0;
  const completedCount = appointments?.filter((a) => a.status === 'COMPLETED').length || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
            {role.replace('_', ' ')} COMMAND CONSOLE
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time OPD queue management, doctor schedule coordination, and clinical services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role === 'DOCTOR' ? (
            <Link
              href="/dashboard/consultations"
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Open Clinical Console</span>
            </Link>
          ) : (
            <Link
              href="/dashboard/appointments"
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Manage OPD Queue</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Consultations</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {totalAppointments}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Active in Queue</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {confirmedCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Verified Specialists</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {doctorsData?.total || 5}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Specialties Active</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 block">
              {departments?.length || 8}
            </span>
          </div>
        </div>
      </div>

      {/* OPD Queue Snapshot */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today&apos;s OPD Token Queue</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live queue tokens scheduled for attending consultants.</p>
          </div>
          <Link
            href="/dashboard/appointments"
            className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
          >
            <span>View All Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {apptsLoading ? (
          <p className="text-xs text-slate-500">Checking patient tokens...</p>
        ) : appointments?.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No consultations currently in queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Queue Token</th>
                  <th className="py-2.5">Patient Details</th>
                  <th className="py-2.5">Attending Doctor</th>
                  <th className="py-2.5">Time Slot</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments?.slice(0, 5).map((appt) => (
                  <tr key={appt.id} className="text-slate-700">
                    <td className="py-3 font-mono font-bold text-sky-700">
                      {appt.tokenNumber}
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-slate-900 block">{appt.patient?.fullName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">UHID: {appt.patient?.uhid}</span>
                    </td>
                    <td className="py-3 font-medium text-slate-800">
                      Dr. {appt.doctor?.fullName}
                    </td>
                    <td className="py-3">{appt.timeSlot}</td>
                    <td className="py-3">
                      <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {role === 'DOCTOR' ? (
                        <Link
                          href={`/dashboard/consultations?appointmentId=${appt.id}`}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          Consult Patient
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard/appointments"
                          className="text-sky-600 hover:underline font-bold text-[11px]"
                        >
                          Update Status
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
