'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchApi, API_BASE_URL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Mail
} from 'lucide-react';

export default function PrivacyCenterPage() {
  const [erasureReason, setErasureReason] = useState('');
  const [retentionAcknowledged, setRetentionAcknowledged] = useState(false);
  const [erasureStatusMsg, setErasureStatusMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch recorded consents
  const { data: consents, isLoading: consentsLoading } = useQuery({
    queryKey: ['my-consents'],
    queryFn: () => fetchApi<any[]>('/privacy/consents')
  });

  // Export My Data (Right to Access)
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await fetchApi<any>('/privacy/export-my-data');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Aarogya_Health_Data_Export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Failed to generate data export.');
    } finally {
      setIsExporting(false);
    }
  };

  // Submit Erasure Request
  const erasureMutation = useMutation({
    mutationFn: () =>
      fetchApi('/privacy/request-erasure', {
        method: 'POST',
        body: JSON.stringify({
          reason: erasureReason,
          acknowledgeStatutoryRetention: true
        })
      }),
    onSuccess: (data: any) => {
      setErasureStatusMsg(
        'Data erasure request registered. Your request is queued for review with the Hospital Data Protection Officer (DPO).'
      );
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to submit erasure request.');
    }
  });

  const handleSubmitErasure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retentionAcknowledged) {
      alert('Statutory clinical retention acknowledgment is required.');
      return;
    }
    erasureMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* DPDP Act 2023 Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Digital Personal Data Protection (DPDP) Privacy Center
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Under the <strong>Digital Personal Data Protection Act, 2023</strong> of India, you hold fundamental rights over your personal health and demographic data. Review your active consents, export your complete digital health file, or request account erasure below.
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-sky-600" />
            <span>Data Protection Officer: <strong>dpo@aarogyahospital.example.com</strong></span>
          </div>
          <div>
            <span>Grievance Response Window: <strong>Within 72 Hours</strong></span>
          </div>
        </div>
      </div>

      {/* Right to Access & Data Portability */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-600" />
              <span>Right to Access & Data Portability (Section 11)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Download a machine-readable JSON archive containing all your demographic data, appointments, prescriptions, diagnostic summaries, and payment transactions.
            </p>
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating Archive...' : 'Download My Full Health Data'}</span>
          </button>
        </div>
      </div>

      {/* Consent Records History */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Recorded Consent Ledger</span>
        </h3>

        {consentsLoading ? (
          <p className="text-xs text-slate-500">Loading consent ledger...</p>
        ) : consents?.length === 0 ? (
          <p className="text-xs text-slate-500">No recorded consents.</p>
        ) : (
          <div className="space-y-3">
            {consents?.map((consent) => (
              <div
                key={consent.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{consent.purpose}</span>
                    <span className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.2 rounded font-semibold text-[10px]">
                      Consent Active
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                    {consent.consentText}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  Recorded: {formatDate(consent.grantedAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right to Erasure / Deletion Request */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2 text-rose-700">
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Right to Erasure & Account Deletion (Section 12)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed max-w-2xl">
          You may request deletion of your web credentials and demographic profile. Please note that National Medical Commission (NMC) regulations mandate that hospital inpatient and outpatient clinical records be preserved for a statutory period (3-7 years) for medical-legal compliance.
        </p>

        {erasureStatusMsg ? (
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{erasureStatusMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitErasure} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reason for Erasure Request
              </label>
              <textarea
                rows={2}
                required
                value={erasureReason}
                onChange={(e) => setErasureReason(e.target.value)}
                placeholder="Please describe why you wish to delete your portal account..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
              <input
                type="checkbox"
                id="retentionAck"
                checked={retentionAcknowledged}
                onChange={(e) => setRetentionAcknowledged(e.target.checked)}
                required
                className="w-4 h-4 text-rose-600 rounded border-slate-300 mt-0.5 cursor-pointer focus:ring-rose-500"
              />
              <label htmlFor="retentionAck" className="text-xs text-rose-900 cursor-pointer leading-relaxed">
                I understand that while my portal login credentials will be deactivated, my medical consultation notes and diagnostic reports must be retained by Aarogya Hospital in compliance with NMC and clinical establishment statutory laws.
              </label>
            </div>

            <button
              type="submit"
              disabled={erasureMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Submit Data Erasure Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
