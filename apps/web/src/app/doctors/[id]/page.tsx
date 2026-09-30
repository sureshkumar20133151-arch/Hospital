'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  Building,
  Video,
  ArrowLeft,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => fetchApi<any>(`/doctors/${id}`),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The doctor profile requested does not exist or has been modified.</p>
        <Link href="/doctors" className="mt-4 inline-block text-sky-600 font-semibold hover:underline text-sm">
          ← Back to Doctor Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Doctors</span>
        </Link>

        {/* Doctor Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-2xl sm:text-3xl shrink-0">
                {doctor.fullName.replace('Dr.', '').trim().slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {doctor.fullName}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-sm font-semibold text-sky-700 mt-1">
                  {doctor.specialization} • {doctor.department?.name}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                    {doctor.qualifications?.join(', ')}
                  </span>
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-md font-mono text-[11px]">
                    NMC: {doctor.nmcRegistrationNumber}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {doctor.experienceYears}+ years clinical experience
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center sm:text-right shrink-0">
              <span className="text-xs text-slate-500 block">OPD Consultation Fee</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">
                {formatINR(doctor.consultationFee)}
              </span>
              <Link
                href={`/book-appointment?doctorId=${doctor.id}&departmentId=${doctor.departmentId}`}
                className="mt-3 inline-block w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors text-center"
              >
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Bio & Details */}
          {doctor.bio && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Professional Background
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {doctor.bio}
              </p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block mb-0.5">OPD Room</span>
              <strong className="text-slate-800 font-semibold">{doctor.roomNumber || 'Main OPD Block'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Consultation Languages</span>
              <strong className="text-slate-800 font-semibold">{doctor.languages?.join(', ')}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Telehealth Video Consults</span>
              <strong className="text-teal-700 font-semibold">
                {doctor.availableForTeleconsultation ? 'Available' : 'In-Person Only'}
              </strong>
            </div>
          </div>
        </div>

        {/* Weekly OPD Schedule */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            <span>Weekly OPD Consultation Schedule</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctor.schedules?.map((slot: any) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 block">
                    {slot.dayOfWeek}
                  </span>
                  <span className="text-xs text-slate-500">
                    {slot.startTime} - {slot.endTime} (15m slots)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                  OPD Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
