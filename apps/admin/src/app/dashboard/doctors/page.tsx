'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import {
  Users,
  Search,
  Award,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2
} from 'lucide-react';
import type { PaginatedResult, DoctorListItem } from '@hospital/shared';

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('');

  const { data: doctorData, isLoading, error } = useQuery({
    queryKey: ['admin-doctors-list', search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append('query', search);
      params.append('limit', '50');
      return fetchApi<PaginatedResult<DoctorListItem>>(`/doctors?${params.toString()}`);
    }
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hospital Medical Faculty Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered medical practitioners with verified National Medical Commission (NMC) credentials.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor or specialty..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading doctor profiles...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">
          Failed to load doctors.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase text-[10px]">
                <th className="py-3">Physician</th>
                <th className="py-3">Specialty & Dept</th>
                <th className="py-3">NMC Registration</th>
                <th className="py-3">Qualifications</th>
                <th className="py-3">Experience</th>
                <th className="py-3">OPD Fee</th>
                <th className="py-3">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctorData?.items?.map((doc) => (
                <tr key={doc.id} className="text-slate-700 hover:bg-slate-50">
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                        {doc.fullName.replace('Dr.', '').trim().slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong className="text-slate-900 block font-bold">{doc.fullName}</strong>
                        <span className="text-[10px] text-slate-400">{doc.languages?.join(', ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-slate-800 block">{doc.specialization}</span>
                    <span className="text-[11px] text-slate-500">{doc.departmentName}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {doc.nmcRegistrationNumber}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600">
                    {doc.qualifications?.join(', ')}
                  </td>
                  <td className="py-3.5 font-medium">
                    {doc.experienceYears}+ years
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {formatINR(doc.consultationFee)}
                  </td>
                  <td className="py-3.5 text-slate-600 font-semibold">
                    {doc.roomNumber || 'Main OPD'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
