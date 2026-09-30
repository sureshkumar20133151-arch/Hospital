'use client';

import React from 'react';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, Lock, Activity, Eye, Download, UserCheck } from 'lucide-react';

export default function AuditLogsPage() {
  // Demonstration DPDP audit trail records recorded by the middleware
  const mockAuditLogs = [
    {
      id: 'aud-001',
      action: 'VIEW_LAB_REPORTS',
      resourceType: 'LabReport',
      actorRole: 'PATIENT',
      actorEmail: 'patient@aarogyahospital.example.com',
      targetUhid: 'AH-2026-00001',
      ipAddress: '192.168.1.42',
      timestamp: new Date().toISOString()
    },
    {
      id: 'aud-002',
      action: 'DOWNLOAD_LAB_REPORT',
      resourceType: 'LabReport (Signed Token)',
      actorRole: 'PATIENT',
      actorEmail: 'patient@aarogyahospital.example.com',
      targetUhid: 'AH-2026-00001',
      ipAddress: '192.168.1.42',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'aud-003',
      action: 'VIEW_MEDICAL_RECORDS',
      resourceType: 'MedicalRecord',
      actorRole: 'DOCTOR',
      actorEmail: 'cardio.consultant@aarogyahospital.example.com',
      targetUhid: 'AH-2026-00001',
      ipAddress: '10.0.4.18',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: 'aud-004',
      action: 'DPDP_DATA_EXPORT_DOWNLOADED',
      resourceType: 'PatientProfile (Section 11)',
      actorRole: 'PATIENT',
      actorEmail: 'patient@aarogyahospital.example.com',
      targetUhid: 'AH-2026-00001',
      ipAddress: '192.168.1.42',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">
              DPDP Act 2023 Compliance & Security Access Audit
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Statutory immutable log tracking every access, view, and export of sensitive health records.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Audit Engine: Active</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase text-[10px]">
              <th className="py-3">Timestamp</th>
              <th className="py-3">Action Recorded</th>
              <th className="py-3">Health Resource</th>
              <th className="py-3">Actor / Role</th>
              <th className="py-3">Target Patient UHID</th>
              <th className="py-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockAuditLogs.map((log) => (
              <tr key={log.id} className="text-slate-700 hover:bg-slate-50">
                <td className="py-3.5 font-mono text-[11px] text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}, {formatDate(log.timestamp)}
                </td>
                <td className="py-3.5">
                  <span className="font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 font-medium text-slate-800">
                  {log.resourceType}
                </td>
                <td className="py-3.5">
                  <span className="font-bold text-slate-900 block">{log.actorRole}</span>
                  <span className="text-[10px] text-slate-400">{log.actorEmail}</span>
                </td>
                <td className="py-3.5 font-mono font-bold text-slate-800">
                  {log.targetUhid}
                </td>
                <td className="py-3.5 font-mono text-slate-500 text-[11px]">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          DPDP Act Notice: Patient records are access-controlled. Unauthorized data exfiltration or access by personnel is subject to strict penal sanctions under Section 33 of the DPDP Act 2023.
        </span>
      </div>
    </div>
  );
}
