import React from 'react';
import { useApp } from '../context/AppContext';

export const DigiLockerModal = () => {
  const { digiLockerWorkerModal, setDigiLockerWorkerModal, t } = useApp();

  if (!digiLockerWorkerModal) return null;

  const worker = digiLockerWorkerModal;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-200 flex flex-col">
        {/* DigiLocker Official Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white text-blue-800 flex items-center justify-center font-black text-xs">
              DL
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wide">DigiLocker Verified</span>
              <span className="text-[10px] text-blue-200 leading-none">
                National Digital Document Authority
              </span>
            </div>
          </div>
          <button
            onClick={() => setDigiLockerWorkerModal(null)}
            className="text-white/80 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-4 flex flex-col gap-3 bg-slate-50 text-xs">
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-xs flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-blue-600 material-symbols-fill">
              verified
            </span>
            <div>
              <h4 className="text-sm font-black text-slate-900">
                National Trade Certificate (NTC)
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Trade: Certified Wireman & Residential Electrician
              </p>
              <p className="text-[10px] text-blue-700 font-bold mt-0.5">
                Issued to: {worker.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-semibold">Issuing Authority:</span>
              <strong className="text-slate-800">NCVT, Govt. of India</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Digital Verification:</span>
              <strong className="text-emerald-700">SHA-256 Validated</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Aadhaar Auth:</span>
              <strong className="text-slate-800">Linked via OTP KYC</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Verification Date:</span>
              <strong className="text-slate-800">14 Jan 2024</strong>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-900 text-[11px] flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[18px]">security</span>
            <span className="leading-tight">
              {t('digilockerVerifiedBy')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-t border-slate-200">
          <span className="text-[10px] text-slate-500">Document ID: #DL-NTC-88192-KA</span>
          <button
            onClick={() => setDigiLockerWorkerModal(null)}
            className="px-3 py-1 bg-blue-700 text-white rounded font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
