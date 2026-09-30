'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FileText, Pill, Stethoscope, AlertTriangle, Calendar, Award } from 'lucide-react';

export default function RecordsPage() {
  const { data: prescriptions, isLoading: rxLoading } = useQuery({
    queryKey: ['my-prescriptions'],
    queryFn: () => fetchApi<any[]>('/records/prescriptions')
  });

  const { data: records, isLoading: recLoading } = useQuery({
    queryKey: ['my-clinical-records'],
    queryFn: () => fetchApi<any[]>('/records')
  });

  return (
    <div className="space-y-6">
      {/* Statutory Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong>Official Medical Records Notice:</strong> Clinical notes and prescriptions are issued strictly by registered medical practitioners during consultations. Prescribed medicines must be taken strictly as per generic instructions. Do not self-medicate or alter dosages without consulting your physician.
        </p>
      </div>

      {/* Prescriptions Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Pill className="w-5 h-5 text-sky-600" />
          <span>Doctor Prescriptions</span>
        </h2>

        {rxLoading ? (
          <p className="text-xs text-slate-500">Loading prescriptions...</p>
        ) : prescriptions?.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No prescriptions recorded yet.
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions?.map((rx) => (
              <div
                key={rx.id}
                className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Dr. {rx.doctor?.fullName} ({rx.doctor?.department?.name})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      NMC Reg: {rx.doctor?.nmcRegistrationNumber} • Date: {formatDate(rx.createdAt)}
                    </p>
                  </div>
                  <div className="text-xs bg-sky-100 text-sky-800 font-semibold px-2.5 py-0.5 rounded-full w-fit">
                    Diagnosis: {rx.diagnosis}
                  </div>
                </div>

                {/* Medicines List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-200 font-bold uppercase text-[10px]">
                        <th className="py-2">Generic Medicine</th>
                        <th className="py-2">Dosage</th>
                        <th className="py-2">Frequency</th>
                        <th className="py-2">Duration</th>
                        <th className="py-2">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rx.items?.map((item: any) => (
                        <tr key={item.id} className="text-slate-800">
                          <td className="py-2 font-semibold text-slate-900">
                            {item.genericName}
                            {item.brandName && (
                              <span className="text-slate-500 font-normal block text-[11px]">
                                ({item.brandName})
                              </span>
                            )}
                          </td>
                          <td className="py-2">{item.dosage}</td>
                          <td className="py-2 font-medium">{item.frequency}</td>
                          <td className="py-2">{item.durationDays} Days</td>
                          <td className="py-2 text-slate-600">{item.instructions || 'As advised'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rx.dietaryAdvice && (
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                    <strong>Dietary / Lifestyle Advice:</strong> {rx.dietaryAdvice}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Notes Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          <span>Clinical Encounter Records</span>
        </h2>

        {recLoading ? (
          <p className="text-xs text-slate-500">Loading clinical records...</p>
        ) : records?.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No clinical records logged yet.
          </div>
        ) : (
          <div className="space-y-4">
            {records?.map((record) => (
              <div
                key={record.id}
                className="border border-slate-200 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    Clinical Encounter with Dr. {record.doctor?.fullName}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {formatDate(record.createdAt)}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 mt-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-500 block mb-1">Symptoms Recorded:</span>
                    <p>{record.symptoms}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-500 block mb-1">Diagnosis:</span>
                    <p className="font-semibold text-slate-900">{record.diagnosis}</p>
                  </div>
                </div>

                {record.clinicalNotes && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <strong>Clinical Notes:</strong> {record.clinicalNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
