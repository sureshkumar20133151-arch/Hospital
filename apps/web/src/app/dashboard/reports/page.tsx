'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi, API_BASE_URL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  FlaskConical,
  Download,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function ReportsPage() {
  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['my-reports'],
    queryFn: () => fetchApi<any[]>('/records/reports')
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Diagnostic & Imaging Reports</h2>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>NABL Accredited Lab</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access-controlled lab results. All downloads use short-lived, encrypted security tokens.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Retrieving diagnostic records...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">
          Failed to fetch reports.
        </div>
      ) : reports?.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No diagnostic reports found</p>
          <p className="text-xs text-slate-500 mt-1">
            Reports are uploaded here once verified by our pathologists and radiologists.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports?.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{report.testName}</h3>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {report.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reported on: {formatDate(report.createdAt)} • File: {report.fileName}
                  </p>
                  {report.summary && (
                    <p className="mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-xl">
                      <strong>Observation Summary:</strong> {report.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Secure Download Button using signed token */}
              <a
                href={`${API_BASE_URL}${report.downloadUrl}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          DPDP Act Security Guarantee: Direct public links to lab reports are blocked. All access requests are logged in the hospital audit trail.
        </span>
      </div>
    </div>
  );
}
