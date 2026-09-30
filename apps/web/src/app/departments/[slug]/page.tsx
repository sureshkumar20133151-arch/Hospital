'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatINR } from '@/lib/utils';
import {
  Calendar,
  Building,
  Award,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function DepartmentDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: department, isLoading, error } = useQuery({
    queryKey: ['department', slug],
    queryFn: () => fetchApi<any>(`/departments/${slug}`),
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Department Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The clinical specialty does not exist or has been relocated.</p>
        <Link href="/departments" className="mt-4 inline-block text-sky-600 font-semibold hover:underline text-sm">
          ← Back to All Specialties
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Specialties</span>
        </Link>

        {/* Department Overview Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Department of Excellence
            </span>
            <span className="text-[11px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold">
              Code: {department.code}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {department.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-3xl leading-relaxed">
            {department.description}
          </p>

          {department.headOfDepartment && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
              <span className="text-slate-400">Head of Department:</span>
              <strong className="text-slate-900 font-bold">{department.headOfDepartment}</strong>
            </div>
          )}
        </div>

        {/* Specialists in this Department */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
            Consultant Physicians & Surgeons in {department.name}
          </h2>

          {department.doctors?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              No doctors currently listed for this specialty.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {department.doctors?.map((doc: any) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-lg shrink-0">
                          {doc.fullName.replace('Dr.', '').trim().slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-lg font-bold text-slate-900">{doc.fullName}</h3>
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          </div>
                          <p className="text-xs font-semibold text-sky-700 mt-0.5">
                            {doc.specialization}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                              {doc.qualifications?.join(', ')}
                            </span>
                            <span className="text-slate-500">
                              {doc.experienceYears}+ yrs exp
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-500 block">Fee</span>
                        <span className="text-base font-extrabold text-slate-900">
                          {formatINR(doc.consultationFee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      View Schedule
                    </Link>
                    <Link
                      href={`/book-appointment?doctorId=${doc.id}&departmentId=${department.id}`}
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book OPD Token</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
