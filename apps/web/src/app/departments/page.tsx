'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  Stethoscope,
  Pill,
  Wind,
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import type { DepartmentItem } from '@hospital/shared';

const iconMap: Record<string, any> = {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Activity,
  Stethoscope,
  Pill,
  Wind
};

export default function DepartmentsPage() {
  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchApi<DepartmentItem[]>('/departments')
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
            Clinical Disciplines
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Centers of Medical Excellence
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Equipped with modern surgical theaters, intensive care units, and experienced clinical faculties across tertiary specialties.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-slate-600">Loading clinical departments...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            <p className="font-semibold text-sm">Failed to load hospital departments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments?.map((dept) => {
              const Icon = iconMap[dept.iconName || 'Stethoscope'] || Stethoscope;
              return (
                <Link
                  key={dept.id}
                  href={`/departments/${dept.slug}`}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      {dept.description}
                    </p>
                    {dept.headOfDepartment && (
                      <p className="text-xs text-slate-700 font-medium">
                        Head: <span className="font-semibold text-slate-900">{dept.headOfDepartment}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600">
                    <span>
                      {dept.activeDoctorsCount ? `${dept.activeDoctorsCount} Specialists Available` : 'View Doctors'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
