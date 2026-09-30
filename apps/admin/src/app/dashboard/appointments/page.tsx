'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useStaffAuthStore } from '@/lib/auth';
import { formatDate, formatINR } from '@/lib/utils';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Stethoscope,
  Filter,
  Video,
  Building
} from 'lucide-react';

export default function AdminAppointmentsPage() {
  const queryClient = useQueryClient();
  const { user } = useStaffAuthStore();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['admin-all-appointments', statusFilter],
    queryFn: () => {
      const url = statusFilter
        ? `/appointments/doctor-appointments?status=${statusFilter}`
        : '/appointments/doctor-appointments';
      return fetchApi<any[]>(url);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      fetchApi(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-appointments'] });
    }
  });

  const statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Checked In', value: 'CHECKED_IN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">OPD Queue & Appointments Console</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Call out queue tokens, check in walk-ins, and advance consultation lifecycle states.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading consultations...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">
          Failed to load queue. Please ensure backend is active.
        </div>
      ) : appointments?.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No appointments found matching current filter.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments?.map((appt) => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="text-center bg-slate-900 text-white rounded-xl p-3 w-20 shrink-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">
                    Token
                  </span>
                  <span className="text-sm font-mono font-black text-sky-400 block mt-0.5">
                    {appt.tokenNumber.split('-').slice(-1)[0]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {appt.patient?.fullName}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      UHID: {appt.patient?.uhid}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {appt.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    Attending: <strong>Dr. {appt.doctor?.fullName}</strong> ({appt.department?.name})
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>Date: {formatDate(appt.appointmentDate)}</span>
                    <span>•</span>
                    <span>Slot: {appt.timeSlot}</span>
                    <span>•</span>
                    <span>Blood: {appt.patient?.bloodGroup}</span>
                    {appt.type === 'TELECONSULTATION' && (
                      <span className="text-teal-700 font-semibold flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>Teleconsult</span>
                      </span>
                    )}
                  </div>

                  {appt.symptomsSummary && (
                    <p className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong>Patient Note:</strong> {appt.symptomsSummary}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Advancement Actions */}
              <div className="flex flex-wrap items-center gap-2 justify-end pt-3 lg:pt-0 border-t lg:border-0 border-slate-100">
                {appt.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'CHECKED_IN' })}
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm"
                  >
                    Check In Patient
                  </button>
                )}

                {appt.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'IN_PROGRESS' })}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm"
                  >
                    Call into Chamber
                  </button>
                )}

                {appt.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: appt.id, status: 'COMPLETED' })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm"
                  >
                    Mark Consultation Done
                  </button>
                )}

                <Link
                  href={`/dashboard/consultations?appointmentId=${appt.id}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Clinical Rx</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
