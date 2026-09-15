import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';

export const InvoiceModal = () => {
  const { invoiceModalBooking, setInvoiceModalBooking, cooperativeInfo, activeCityConfig } = useApp();
  const printRef = useRef(null);

  if (!invoiceModalBooking) return null;

  const booking = invoiceModalBooking;
  const invoiceNumber = `SHG-INV-${booking.id.replace('SHG-', '') || '2026-7429'}`;
  const invoiceDate = booking.bookingDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const labourAmount = booking.labourAmount || 450;
  const insuranceAmount = booking.insuranceAmount || 10;
  const totalAmount = labourAmount + insuranceAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl w-full max-w-xl shadow-2xl border border-surface-variant/40 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-4 bg-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <div>
              <h2 className="font-bold text-base leading-tight">Cooperative Tax-Free Invoice</h2>
              <p className="text-[11px] text-white/80 font-mono">Invoice #{invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Print / Save PDF"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setInvoiceModalBooking(null)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div ref={printRef} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Official Cooperative Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-variant/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-primary">{cooperativeInfo?.fullName || 'SAHYOG Multi-State Cooperative Society'}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Reg No: <strong className="font-mono text-on-surface">{cooperativeInfo?.regNumber || 'UP-SLN-COOP-2024-8841'}</strong>
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Chapter: {activeCityConfig?.chapter || 'Sultanpur Central Guild'} • Ward {activeCityConfig?.ward || '12'}
              </p>
            </div>
            <div className="sm:text-right bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>0% Platform Commission</span>
              </span>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                Co-op Model (100% Direct Payout)
              </p>
            </div>
          </div>

          {/* Customer & Technician Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-container-low p-3.5 rounded-xl border border-surface-variant/30">
            <div>
              <span className="text-[10px] font-black uppercase text-on-surface-variant block mb-1">
                Billed To (Customer):
              </span>
              <p className="font-bold text-sm text-on-surface">Priya Sharma</p>
              <p className="text-on-surface-variant mt-0.5">{booking.address || 'Civil Lines, Sultanpur'}</p>
              <p className="text-on-surface-variant">Payment Method: <strong>{booking.paymentMethod || 'UPI (Escrow Auto-Settled)'}</strong></p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-on-surface-variant block mb-1">
                Service Performed By (Co-Owner):
              </span>
              <p className="font-bold text-sm text-on-surface">{booking.workerName || 'Awadhesh Sharma'}</p>
              <p className="text-on-surface-variant mt-0.5">{booking.workerTrade || 'Master Electrician'}</p>
              <p className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>e-Shram: #6610-9944-2101</span>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-surface-variant/40 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container text-on-surface-variant font-bold text-[11px] border-b border-surface-variant/40">
                <tr>
                  <th className="p-2.5">Service Description</th>
                  <th className="p-2.5 text-center">Type</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                <tr>
                  <td className="p-2.5">
                    <p className="font-bold text-on-surface">{booking.serviceTitle || 'Standard Electrical Diagnostic & Repair'}</p>
                    <p className="text-[10px] text-on-surface-variant">100% direct remuneration to technician bank account</p>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[11px]">Direct Labour</td>
                  <td className="p-2.5 text-right font-black text-on-surface">₹{labourAmount}.00</td>
                </tr>
                <tr>
                  <td className="p-2.5">
                    <p className="font-bold text-on-surface">Mutual Cooperative Health & Tool Pool</p>
                    <p className="text-[10px] text-on-surface-variant">Non-profit member welfare fund (Tool subsidy + Accidental insurance)</p>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[11px]">Welfare Pool</td>
                  <td className="p-2.5 text-right font-black text-on-surface">₹{insuranceAmount}.00</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="p-2.5">
                    <p className="font-bold text-emerald-900">Platform Intermediary Commission</p>
                    <p className="text-[10px] text-emerald-700">Zero corporate middleman take-rate under Co-op bylaws</p>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[11px] text-emerald-800 font-bold">0% Cut</td>
                  <td className="p-2.5 text-right font-black text-emerald-700">₹0.00</td>
                </tr>
              </tbody>
              <tfoot className="bg-surface-container-low font-bold border-t border-surface-variant/40">
                <tr>
                  <td colSpan={2} className="p-2.5 text-right text-on-surface">Total Amount Paid (Escrow Settled):</td>
                  <td className="p-2.5 text-right text-base font-black text-primary">₹{totalAmount}.00</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legal Exemption & DPI Verification Footer */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="space-y-1">
              <p className="font-bold text-on-surface">
                GST Exemption Note:
              </p>
              <p className="text-on-surface-variant text-[10px] leading-relaxed">
                Services rendered by member co-owners of registered primary cooperative societies are exempt from commercial intermediary GST surcharge under Section 12AA / Co-operative Act.
              </p>
              <p className="text-primary font-mono text-[10px] font-bold">
                Settlement Hash: 0x8f2d...c914 • Escrow Verified
              </p>
            </div>
            <div className="text-center shrink-0 p-2 bg-white rounded-lg border border-surface-variant/40">
              <div className="w-16 h-16 bg-slate-900 text-white flex flex-col items-center justify-center rounded p-1 mx-auto">
                <span className="material-symbols-outlined text-[28px]">qr_code_2</span>
              </div>
              <span className="text-[9px] font-mono text-on-surface-variant mt-1 block">DPI Verified</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-surface-container-low border-t border-surface-variant/30 flex items-center justify-between">
          <span className="text-[11px] text-on-surface-variant">
            Date: <strong>{invoiceDate}</strong>
          </span>
          <button
            type="button"
            onClick={() => setInvoiceModalBooking(null)}
            className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-container transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
