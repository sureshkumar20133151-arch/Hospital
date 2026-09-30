'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { formatINR } from '@/lib/utils';
import {
  Calendar,
  Clock,
  User,
  Building,
  Video,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ArrowRight,
  Info
} from 'lucide-react';
import type { DepartmentItem, DoctorListItem } from '@hospital/shared';

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

  const preselectedDoctorId = searchParams.get('doctorId') || '';
  const preselectedDepartmentId = searchParams.get('departmentId') || '';

  const [selectedDeptId, setSelectedDeptId] = useState(preselectedDepartmentId);
  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultationType, setConsultationType] = useState<'IN_PERSON' | 'TELECONSULTATION'>('IN_PERSON');
  const [symptomsSummary, setSymptomsSummary] = useState('');
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // 1. Fetch departments
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchApi<DepartmentItem[]>('/departments')
  });

  // 2. Fetch doctors (filtered by department if selected)
  const { data: doctorsData } = useQuery({
    queryKey: ['doctors', selectedDeptId],
    queryFn: () => {
      const url = selectedDeptId ? `/doctors?departmentId=${selectedDeptId}&limit=50` : '/doctors?limit=50';
      return fetchApi<{ items: DoctorListItem[] }>(url);
    }
  });

  useEffect(() => {
    if (preselectedDoctorId && doctorsData?.items) {
      const doc = doctorsData.items.find((d) => d.id === preselectedDoctorId);
      if (doc && !selectedDeptId) {
        setSelectedDeptId(doc.departmentId);
      }
    }
  }, [preselectedDoctorId, doctorsData, selectedDeptId]);

  // 3. Fetch doctor available slots on selected date
  const { data: slotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', selectedDoctorId, appointmentDate],
    queryFn: () => fetchApi<any>(`/doctors/${selectedDoctorId}/slots?date=${appointmentDate}`),
    enabled: !!selectedDoctorId && !!appointmentDate
  });

  const selectedDoctor = doctorsData?.items?.find((d) => d.id === selectedDoctorId);

  // Booking Mutation
  const bookMutation = useMutation({
    mutationFn: (payload: any) =>
      fetchApi('/appointments/book', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    onSuccess: (data) => {
      setBookingSuccess(data);
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err.message || 'Failed to book appointment. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/book-appointment?doctorId=${selectedDoctorId}`);
      return;
    }

    if (!selectedDoctorId) {
      setErrorMsg('Please select a doctor');
      return;
    }

    if (!selectedSlot) {
      setErrorMsg('Please select an available time slot');
      return;
    }

    if (!dpdpConsent) {
      setErrorMsg('DPDP Act consent is mandatory to process health data for medical consultation');
      return;
    }

    bookMutation.mutate({
      doctorId: selectedDoctorId,
      departmentId: selectedDeptId || selectedDoctor?.departmentId,
      appointmentDate,
      timeSlot: selectedSlot,
      type: consultationType,
      symptomsSummary,
      dpdpConsultationConsent: true
    });
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block">
            Online Out-Patient Department (OPD)
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Book Doctor Consultation
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Select your preferred specialist and time slot to receive your official daily queue token.
          </p>
        </div>

        {!authLoading && !isAuthenticated && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs sm:text-sm text-amber-900">
                <strong>Patient Sign-In Recommended:</strong> To record your Unique Health ID (UHID) and retain your medical history, please log in.
              </div>
            </div>
            <Link
              href="/auth/login"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shrink-0"
            >
              Sign In
            </Link>
          </div>
        )}

        {bookingSuccess ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Appointment Confirmed
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              Daily OPD Token Assigned
            </h2>

            <div className="my-6 max-w-sm mx-auto bg-slate-900 text-white rounded-2xl p-6 shadow-md">
              <span className="text-xs text-slate-400 block uppercase tracking-widest">
                Your Queue Token Number
              </span>
              <span className="text-3xl font-mono font-black text-sky-400 block mt-1 tracking-wider">
                {bookingSuccess.tokenNumber}
              </span>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                <p>Date: <strong className="text-white">{appointmentDate}</strong></p>
                <p>Time Slot: <strong className="text-white">{bookingSuccess.timeSlot}</strong></p>
                <p>Consultation Fee: <strong className="text-white">{formatINR(bookingSuccess.consultationFee)}</strong></p>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              A confirmation SMS and email have been dispatched. Please report to the hospital OPD desk 15 minutes prior to your allocated time slot.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard/appointments"
                className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm"
              >
                View in My Appointments
              </Link>
              <Link
                href="/dashboard/bills"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Fee Online (Razorpay)</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>Select Department & Doctor</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Specialty Department
                  </label>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => {
                      setSelectedDeptId(e.target.value);
                      setSelectedDoctorId('');
                      setSelectedSlot('');
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="">All Specialties</option>
                    {departments?.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Doctor
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => {
                      setSelectedDoctorId(e.target.value);
                      setSelectedSlot('');
                    }}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    <option value="">Select a Doctor</option>
                    {doctorsData?.items?.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.fullName} ({doc.specialization}) - {formatINR(doc.consultationFee)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedDoctor && (
                <div className="mt-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{selectedDoctor.fullName}</span>
                    <span className="text-slate-600">
                      {selectedDoctor.qualifications?.join(', ')} • NMC: {selectedDoctor.nmcRegistrationNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Fee</span>
                    <strong className="text-sm text-slate-900 font-extrabold">
                      {formatINR(selectedDoctor.consultationFee)}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8 pt-6 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>Select Appointment Date & Time Slot</span>
              </h3>

              <div className="mb-4 max-w-xs">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Consultation Date
                </label>
                <input
                  type="date"
                  min={minDateStr}
                  max={maxDateStr}
                  value={appointmentDate}
                  onChange={(e) => {
                    setAppointmentDate(e.target.value);
                    setSelectedSlot('');
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Available OPD Slots ({slotsData?.dayOfWeek || 'Select Doctor'})
                </label>

                {slotsLoading ? (
                  <p className="text-xs text-slate-500">Checking slot availability...</p>
                ) : !selectedDoctorId ? (
                  <p className="text-xs text-slate-400">Please select a doctor first to see available slots.</p>
                ) : slotsData?.availableSlots?.length === 0 ? (
                  <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    No OPD slots scheduled for this doctor on the selected date. Please choose another weekday.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {slotsData?.availableSlots?.map((s: any) => (
                      <button
                        type="button"
                        key={s.slot}
                        disabled={s.isBooked}
                        onClick={() => setSelectedSlot(s.slot)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          s.isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : selectedSlot === s.slot
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-sky-400'
                        }`}
                      >
                        {s.slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 pt-6 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span>Consultation Mode & Notes</span>
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setConsultationType('IN_PERSON')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    consultationType === 'IN_PERSON'
                      ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">In-Person OPD</strong>
                    <span className="text-xs text-slate-500">Hospital Consultation Room</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultationType('TELECONSULTATION')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    consultationType === 'TELECONSULTATION'
                      ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Video className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">Teleconsultation</strong>
                    <span className="text-xs text-slate-500">Secure Online Video Call</span>
                  </div>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brief Health Concerns or Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={symptomsSummary}
                  onChange={(e) => setSymptomsSummary(e.target.value)}
                  placeholder="e.g., Routine blood pressure follow up, persistent cough for 3 days..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mb-8 pt-6 border-t border-slate-100">
              <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="dpdpConsent"
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    required
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 mt-1 cursor-pointer focus:ring-sky-500"
                  />
                  <label htmlFor="dpdpConsent" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                    <strong className="text-slate-900 font-bold block mb-1">
                      Digital Personal Data Protection (DPDP) Act Consent (Mandatory)
                    </strong>
                    I voluntarily consent to Aarogya Multi-Specialty Hospital and its attending medical faculty collecting, storing, and processing my health notes, appointment history, and contact details for the specific purpose of healthcare delivery, clinical diagnosis, and appointment notifications under Section 6 of the DPDP Act 2023. I understand my data remains confidential and can be exported or managed from the Privacy Center.
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={bookMutation.isPending}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 text-base"
            >
              {bookMutation.isPending ? (
                <span>Confirming Token & Slot...</span>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Confirm Appointment & Generate Queue Token</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <BookAppointmentContent />
    </Suspense>
  );
}
