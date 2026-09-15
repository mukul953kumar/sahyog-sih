import React from 'react';
import { useApp } from '../context/AppContext';

export const AuditReportModal = () => {
  const { auditReportModalOpen, setAuditReportModalOpen, cooperativeInfo } = useApp();

  if (!auditReportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">account_balance</span>
            <div>
              <h3 className="text-base font-black">Cooperative Transparency & Member Payout Statement</h3>
              <p className="text-[11px] text-emerald-200">
                Cooperative Societies Act Section 63 Audited
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuditReportModalOpen(false)}
            className="text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex flex-col gap-3 text-xs text-slate-800">
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold block">Gross Direct Labour Paid:</span>
              <strong className="text-base font-black text-slate-900">
                {cooperativeInfo.metrics.directWorkerEarnings}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Direct Member Remittance:</span>
              <strong className="text-base font-black text-secondary">
                100.0% (Zero Platform Cut)
              </strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Total Middleman Fees Saved:</span>
              <strong className="text-slate-900">{cooperativeInfo.metrics.commissionsSaved}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Active Shareholder Members:</span>
              <strong className="text-slate-900">
                {cooperativeInfo.metrics.activeCoOwners} Co-Owners
              </strong>
            </div>
          </div>

          {/* Sample Payout Log Entries */}
          <div>
            <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">
              Recent Direct Bank Settlements (0% Platform Deductions)
            </span>
            <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200 font-mono text-[11px]">
              <div className="bg-slate-100 p-2 font-bold flex justify-between">
                <span>Bank Ref / Order</span>
                <span>Worker Share</span>
                <span>Commission</span>
                <span>Status</span>
              </div>
              <div className="p-2 flex justify-between items-center bg-white">
                <span className="font-sans font-semibold">#UTR-8821 • Ramesh K.</span>
                <strong className="text-emerald-700">₹450 (100%)</strong>
                <span className="text-slate-500">₹0</span>
                <span className="bg-emerald-100 text-emerald-800 font-sans text-[10px] px-1.5 py-0.5 rounded font-bold">Bank IMPS Credited</span>
              </div>
              <div className="p-2 flex justify-between items-center bg-white">
                <span className="font-sans font-semibold">#UPI-8790 • Sunita P.</span>
                <strong className="text-emerald-700">₹799 (100%)</strong>
                <span className="text-slate-500">₹0</span>
                <span className="bg-emerald-100 text-emerald-800 font-sans text-[10px] px-1.5 py-0.5 rounded font-bold">Settled</span>
              </div>
              <div className="p-2 flex justify-between items-center bg-white">
                <span className="font-sans font-semibold">#UTR-8642 • Mohammad A.</span>
                <strong className="text-emerald-700">₹420 (100%)</strong>
                <span className="text-slate-500">₹0</span>
                <span className="bg-emerald-100 text-emerald-800 font-sans text-[10px] px-1.5 py-0.5 rounded font-bold">Settled</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
            <strong>Audit Verification Statement:</strong> No aggregator platform margin was collected on any transaction. All welfare surplus is held in the registered cooperative mutual fund.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={() => alert('Cooperative Bank Settlement Log exported as SAHYOG_Settlements_Q3_2026.csv')}
            className="px-3 py-1.5 bg-slate-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download Settlement CSV</span>
          </button>
          <button
            onClick={() => setAuditReportModalOpen(false)}
            className="px-3 py-1.5 bg-primary text-white rounded font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
