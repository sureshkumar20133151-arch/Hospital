'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { formatINR, formatDate } from '@/lib/utils';
import { CreditCard, CheckCircle2, AlertCircle, Receipt, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BillsPage() {
  const queryClient = useQueryClient();
  const [payingBillId, setPayingBillId] = useState<string | null>(null);
  const [successPaymentMsg, setSuccessPaymentMsg] = useState('');

  const { data: bills, isLoading, error } = useQuery({
    queryKey: ['my-bills'],
    queryFn: () => fetchApi<any[]>('/billing/my-bills')
  });

  // Handle Online Payment via Razorpay
  const handlePayNow = async (bill: any) => {
    setPayingBillId(bill.id);
    setSuccessPaymentMsg('');

    try {
      // 1. Create Razorpay order on backend
      const order = await fetchApi<any>('/billing/create-order', {
        method: 'POST',
        body: JSON.stringify({
          billId: bill.id,
          appointmentId: bill.appointmentId || undefined,
          amountInPaisa: Math.round(bill.netPayable * 100),
          receipt: bill.billNumber
        })
      });

      // 2. Mock payment verification in local dev/demo
      const verifyRes = await fetchApi<any>('/billing/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          razorpayOrderId: order.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_signature_verified',
          billId: bill.id,
          appointmentId: bill.appointmentId || undefined
        })
      });

      setSuccessPaymentMsg(`Payment of ${formatINR(bill.netPayable)} for invoice ${bill.billNumber} was successful!`);
      queryClient.invalidateQueries({ queryKey: ['my-bills'] });
    } catch (err: any) {
      alert(err.message || 'Payment processing encountered an error.');
    } finally {
      setPayingBillId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Hospital Bills & Payments</h2>
            <span className="flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>Razorpay Verified</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pay out-patient fees, diagnostic procedures, and pharmacy receipts using UPI, cards, or netbanking.
          </p>
        </div>
      </div>

      {successPaymentMsg && (
        <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-teal-600" />
          <span>{successPaymentMsg}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading invoices...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-xs">
          Failed to load billing history.
        </div>
      ) : bills?.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No invoices generated</p>
          <p className="text-xs text-slate-500 mt-1">
            Invoices appear here automatically whenever an appointment or test is requested.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bills?.map((bill) => (
            <div
              key={bill.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                    INV
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {bill.billNumber}
                      </span>
                      {bill.status === 'PAID' ? (
                        <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                          Payment Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date: {formatDate(bill.createdAt)} • Type: {bill.type}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Net Amount
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {formatINR(bill.netPayable)}
                  </span>
                </div>
              </div>

              {/* Item details */}
              <div className="mt-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">{bill.title}</p>
                {bill.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-1 text-[11px] text-slate-500">
                    <span>{item.description} (Qty: {item.quantity})</span>
                    <span>{formatINR(item.totalAmount)}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {bill.status === 'PENDING' && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handlePayNow(bill)}
                    disabled={payingBillId === bill.id}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>
                      {payingBillId === bill.id ? 'Processing Razorpay...' : `Pay ${formatINR(bill.netPayable)} Online`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
