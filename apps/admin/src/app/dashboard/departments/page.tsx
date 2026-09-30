'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { Building, Plus, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import type { DepartmentItem } from '@hospital/shared';

export default function AdminDepartmentsPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data: departments, isLoading, error } = useQuery({
    queryKey: ['admin-departments'],
    queryFn: () => fetchApi<DepartmentItem[]>('/departments')
  });

  const createDeptMutation = useMutation({
    mutationFn: () =>
      fetchApi('/departments', {
        method: 'POST',
        body: JSON.stringify({
          name,
          slug: slug.toLowerCase() || name.toLowerCase().replace(/\s+/g, '-'),
          code: code.toUpperCase(),
          description,
          headOfDepartment
        })
      }),
    onSuccess: () => {
      setSuccessMsg('Specialty department created successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
      setName('');
      setSlug('');
      setCode('');
      setDescription('');
      setHeadOfDepartment('');
      setShowAddModal(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to create department.');
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    createDeptMutation.mutate();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clinical Specialties & Centers of Excellence</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure tertiary departments and specialist faculty allocation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Specialty</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="mb-8 p-6 rounded-2xl border border-sky-200 bg-sky-50/50">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Register New Hospital Department
          </h3>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. Dermatology & Cosmetology"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Short Code (3-4 Chars) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DERM"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Head of Department
                </label>
                <input
                  type="text"
                  value={headOfDepartment}
                  onChange={(e) => setHeadOfDepartment(e.target.value)}
                  placeholder="e.g. Dr. H. Nair"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Clinical Scope & Facilities Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Diagnostic and surgical capabilities for this discipline..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={createDeptMutation.isPending}
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
              >
                {createDeptMutation.isPending ? 'Saving...' : 'Save Department'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading departments...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">
          Failed to fetch departments.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments?.map((dept) => (
            <div
              key={dept.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-sm">{dept.name}</h3>
                  <span className="font-mono text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {dept.description}
                </p>
                {dept.headOfDepartment && (
                  <p className="text-xs text-slate-700 font-medium">
                    HOD: <strong className="text-slate-900">{dept.headOfDepartment}</strong>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{dept.activeDoctorsCount || 1} Specialist(s)</span>
                </span>
                <span className="text-teal-700 font-semibold text-[11px]">Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
