'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatINR, formatDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Video,
  CreditCard
} from 'lucide-react';

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => fetchApi<any[]>('/appointments/my-patient-appointments')
  });

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) =>
      fetchApi(`/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'CANCELLED',
          cancellationReason: 'Cancelled by patient from portal'
        })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
      setCancellingId(null);
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">Confirmed</span>;
      case 'COMPLETED':
        return <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">Cancelled</span>;
      case 'IN_PROGRESS':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">In Progress</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My OPD Appointments</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track daily queue tokens, consultation status, and appointment records.
          </p>
        </div>
        <Link
          href="/book-appointment"
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>New Appointment</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading appointments...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">
          Failed to load appointments.
        </div>
      ) : appointments?.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No appointments recorded</p>
          <p className="text-xs text-slate-500 mt-1">Book a consultation with an Aarogya Hospital specialist.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments?.map((appt) => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="text-center bg-slate-50 border border-slate-200 rounded-xl p-3 w-16 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Token
                  </span>
                  <span className="text-sm font-mono font-black text-sky-700 block mt-0.5">
                    {appt.tokenNumber.split('-').slice(-1)[0]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Dr. {appt.doctor?.fullName}
                    </h3>
                    {getStatusBadge(appt.status)}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {appt.doctor?.specialization} • {appt.department?.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(appt.appointmentDate)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appt.timeSlot}</span>
                    </span>
                    {appt.type === 'TELECONSULTATION' && (
                      <span className="flex items-center gap-1 text-teal-700 font-semibold">
                        <Video className="w-3.5 h-3.5" />
                        <span>Teleconsultation</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                {appt.status === 'CONFIRMED' && (
                  <button
                    onClick={() => cancelMutation.mutate(appt.id)}
                    disabled={cancelMutation.isPending}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-rose-200"
                  >
                    Cancel
                  </button>
                )}

                {appt.bill && appt.bill.status === 'PENDING' && (
                  <Link
                    href="/dashboard/bills"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>Pay {formatINR(appt.bill.netPayable)}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
