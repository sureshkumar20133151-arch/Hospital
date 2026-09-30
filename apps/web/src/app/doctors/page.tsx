'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import {
  Search,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Award,
  Video,
  Building,
  Filter,
  CheckCircle2
} from 'lucide-react';
import type { PaginatedResult, DoctorListItem, DepartmentItem } from '@hospital/shared';

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // Fetch departments for filter dropdown
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchApi<DepartmentItem[]>('/departments')
  });

  // Fetch doctors with filters
  const { data: doctorData, isLoading, error } = useQuery({
    queryKey: ['doctors', searchTerm, selectedDept, selectedDay],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('query', searchTerm);
      if (selectedDept) params.append('departmentId', selectedDept);
      if (selectedDay) params.append('day', selectedDay);
      return fetchApi<PaginatedResult<DoctorListItem>>(`/doctors?${params.toString()}`);
    }
  });

  const daysOfWeek = [
    { label: 'All Days', value: '' },
    { label: 'Monday', value: 'MONDAY' },
    { label: 'Tuesday', value: 'TUESDAY' },
    { label: 'Wednesday', value: 'WEDNESDAY' },
    { label: 'Thursday', value: 'THURSDAY' },
    { label: 'Friday', value: 'FRIDAY' },
    { label: 'Saturday', value: 'SATURDAY' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
            Verified Medical Specialists
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Find Doctors & Book OPD Consultation
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            All practitioners are verified and registered with the National Medical Commission (NMC). Review OPD schedules and book your token online.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search query input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doctor name or condition..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Department dropdown */}
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="">All Specialties</option>
                {departments?.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Day of Week */}
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Doctor List */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-600">Loading verified doctors...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            <p className="font-semibold text-sm">Failed to load doctor directory.</p>
            <p className="text-xs text-red-600 mt-1">Please ensure the backend API server is running on port 5000.</p>
          </div>
        ) : doctorData?.items?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No doctors match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing search terms or selecting another department.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('');
                setSelectedDay('');
              }}
              className="mt-4 text-xs font-semibold text-sky-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctorData?.items?.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-xl shrink-0">
                        {doctor.fullName
                          .replace('Dr.', '')
                          .trim()
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900 leading-tight">
                            {doctor.fullName}
                          </h3>
                          <span title="NMC Verified">
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-sky-700 mt-0.5">
                          {doctor.specialization}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {doctor.departmentName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-500 block">Consultation</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        {formatINR(doctor.consultationFee)}
                      </span>
                    </div>
                  </div>

                  {/* Qualifications & Badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      <Award className="w-3 h-3 text-amber-600" />
                      <span>{doctor.qualifications.join(', ')}</span>
                    </div>
                    <div className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-mono text-[10px]">
                      {doctor.nmcRegistrationNumber}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {doctor.experienceYears}+ years experience
                    </div>
                  </div>

                  {/* OPD Room & Telehealth */}
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                    {doctor.roomNumber && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>Room: {doctor.roomNumber}</span>
                      </span>
                    )}
                    {doctor.availableForTeleconsultation && (
                      <span className="flex items-center gap-1 text-teal-700">
                        <Video className="w-3.5 h-3.5" />
                        <span>Telehealth Available</span>
                      </span>
                    )}
                    <span className="text-slate-500">
                      Languages: {doctor.languages.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View OPD Schedule
                  </Link>

                  <Link
                    href={`/book-appointment?doctorId=${doctor.id}&departmentId=${doctor.departmentId}`}
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
