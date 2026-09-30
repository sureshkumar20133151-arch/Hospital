'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useStaffAuthStore } from '@/lib/auth';
import { MEDICAL_ADVICE_DISCLAIMER } from '@hospital/shared';
import {
  Stethoscope,
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Activity,
  User,
  ShieldCheck
} from 'lucide-react';

interface MedicineRow {
  genericName: string;
  brandName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  instructions: string;
}

function ConsultationContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useStaffAuthStore();

  const appointmentIdFromUrl = searchParams.get('appointmentId') || '';

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(appointmentIdFromUrl);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Vitals
  const [bpSystolic, setBpSystolic] = useState<number | ''>(120);
  const [bpDiastolic, setBpDiastolic] = useState<number | ''>(80);
  const [pulse, setPulse] = useState<number | ''>(74);
  const [temperature, setTemperature] = useState<number | ''>(98.4);
  const [spo2, setSpo2] = useState<number | ''>(99);

  // Prescription medicines
  const [medicines, setMedicines] = useState<MedicineRow[]>([
    {
      genericName: 'Paracetamol',
      brandName: '',
      dosage: '650 mg',
      frequency: '1-0-1 after food',
      durationDays: 3,
      instructions: 'Take with warm water if fever exceeds 99°F'
    }
  ]);
  const [dietaryAdvice, setDietaryAdvice] = useState('Maintain adequate hydration and light balanced diet.');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch appointments available for consultation
  const { data: appointments } = useQuery({
    queryKey: ['consultation-appointments'],
    queryFn: () => fetchApi<any[]>('/appointments/doctor-appointments')
  });

  useEffect(() => {
    if (appointmentIdFromUrl) {
      setSelectedAppointmentId(appointmentIdFromUrl);
    }
  }, [appointmentIdFromUrl]);

  const selectedAppt = appointments?.find((a) => a.id === selectedAppointmentId);

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      {
        genericName: '',
        brandName: '',
        dosage: '',
        frequency: '1-0-1',
        durationDays: 5,
        instructions: ''
      }
    ]);
  };

  const removeMedicineRow = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof MedicineRow, value: any) => {
    const updated = [...medicines];
    (updated[index] as any)[field] = value;
    setMedicines(updated);
  };

  // Submit Clinical Encounter & Prescription
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAppt) throw new Error('Please select an active patient appointment');
      if (!diagnosis) throw new Error('Diagnosis is required');

      // 1. Save Medical Encounter
      await fetchApi('/records', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: selectedAppt.id,
          symptoms: symptoms || selectedAppt.symptomsSummary || 'Routine medical evaluation',
          diagnosis,
          clinicalNotes,
          vitals: {
            bloodPressureSystolic: Number(bpSystolic) || undefined,
            bloodPressureDiastolic: Number(bpDiastolic) || undefined,
            pulseRateBpm: Number(pulse) || undefined,
            temperatureFahrenheit: Number(temperature) || undefined,
            oxygenSaturationSpo2: Number(spo2) || undefined
          }
        })
      });

      // 2. Issue Prescription
      if (medicines.length > 0 && medicines[0].genericName) {
        await fetchApi('/records/prescriptions', {
          method: 'POST',
          body: JSON.stringify({
            appointmentId: selectedAppt.id,
            patientId: selectedAppt.patientId,
            diagnosis,
            dietaryAdvice,
            clinicalNotes,
            medicines
          })
        });
      }

      // 3. Mark appointment as completed
      await fetchApi(`/appointments/${selectedAppt.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'COMPLETED' })
      });
    },
    onSuccess: () => {
      setSuccessMsg('Clinical encounter and official prescription saved successfully. Patient status updated to Completed.');
      setErrorMsg('');
      queryClient.invalidateQueries({ queryKey: ['consultation-appointments'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to save clinical encounter.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    submitMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-900">Clinical Encounter & Prescription Console</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Record patient vitals, diagnosis, and issue verified generic prescriptions.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Patient Consultation Queue
            </label>
            <select
              value={selectedAppointmentId}
              onChange={(e) => setSelectedAppointmentId(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="">-- Choose Patient Appointment --</option>
              {appointments?.map((a) => (
                <option key={a.id} value={a.id}>
                  Token {a.tokenNumber} - {a.patient?.fullName} (UHID: {a.patient?.uhid}) - {a.timeSlot} [{a.status}]
                </option>
              ))}
            </select>
          </div>

          {selectedAppt && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 block font-bold">Patient Name:</span>
                <strong className="text-slate-900 text-sm">{selectedAppt.patient?.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">UHID:</span>
                <span className="font-mono text-sky-700 font-bold">{selectedAppt.patient?.uhid}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">Queue Token:</span>
                <span className="font-mono font-bold text-slate-800">{selectedAppt.tokenNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">Blood Group:</span>
                <span className="font-bold text-slate-800">{selectedAppt.patient?.bloodGroup}</span>
              </div>
            </div>
          )}

          {/* Vitals Recording */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Patient Vitals Examination</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  BP Systolic (mmHg)
                </label>
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="120"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  BP Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="80"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Pulse Rate (bpm)
                </label>
                <input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="72"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Temp (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="98.6"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="99"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis & Clinical Findings */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute upper respiratory tract infection, Essential hypertension Grade 1..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinical Observation & Examination Notes
              </label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Chest clear, heart sounds normal, throat mildly congested..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Prescription Medicine Items */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-sky-600" />
                <span>Prescription (Generic Medicine Names)</span>
              </h3>
              <button
                type="button"
                onClick={addMedicineRow}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-6 gap-3 items-end text-xs"
                >
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Generic Drug Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={med.genericName}
                      onChange={(e) => updateMedicine(idx, 'genericName', e.target.value)}
                      placeholder="e.g. Amoxicillin, Metformin"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      required
                      value={med.dosage}
                      onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                      placeholder="e.g. 500 mg"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                      placeholder="1-0-1"
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Days
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={med.durationDays}
                      onChange={(e) => updateMedicine(idx, 'durationDays', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end">
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineRow(idx)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Disclaimer Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
            <strong className="block font-bold mb-0.5">Statutory Prescription Disclaimer Embedded:</strong>
            {MEDICAL_ADVICE_DISCLAIMER}
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-5 h-5" />
            <span>{submitMutation.isPending ? 'Saving Clinical Record...' : 'Complete Encounter & Issue Prescription'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ConsultationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ConsultationContent />
    </Suspense>
  );
}
