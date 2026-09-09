import React from 'react';
import { useApp } from '../context/AppContext';

export const EShramCardModal = () => {
  const { eShramWorkerModal, setEShramWorkerModal, t } = useApp();

  if (!eShramWorkerModal) return null;

  const worker = eShramWorkerModal;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col">
        {/* Government Header Strip */}
        <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#128807] p-1">
          <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300">
                  Government of India
                </span>
                <span className="text-xs font-black tracking-tight leading-none">
                  e-Shram Universal ID Card
                </span>
              </div>
            </div>
            <button
              onClick={() => setEShramWorkerModal(null)}
              className="text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 bg-[#f8faf7] flex flex-col gap-3 text-slate-800 text-xs">
          {/* Top worker block */}
          <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <img
              alt={worker.name}
              src={worker.detailAvatar || worker.avatar}
              className="w-16 h-18 rounded-lg object-cover border-2 border-primary shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Name of Worker
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {worker.name}
              </h3>
              <p className="text-[11px] text-primary font-bold mt-0.5">{worker.trade}</p>
              <p className="text-[10px] text-slate-600">Bengaluru Urban Chapter</p>
            </div>
          </div>

          {/* UAN Number Callout */}
          <div className="bg-emerald-900 text-white p-2.5 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              {t('uanNumber')}
            </span>
            <span className="text-lg font-black tracking-widest text-white tabular-nums">
              8841 • 2049 • 7192
            </span>
          </div>

          {/* Verification Details */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-semibold block">Primary Occupation:</span>
              <strong className="text-slate-800">NCO Code 7411.01</strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Aadhaar Status:</span>
              <strong className="text-secondary flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Bio-Verified
              </strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">PMSBY Insurance:</span>
              <strong className="text-slate-800">₹2,00,000 Active</strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block">Cooperative Share:</span>
              <strong className="text-primary font-extrabold">Co-Owner #{worker.memberId}</strong>
            </div>
          </div>

          {/* Verifiable Barcode Simulation */}
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-dashed border-slate-300">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase">
                Digital Public Infrastructure
              </span>
              <span className="text-[10px] text-secondary font-bold">
                NDUW Verified Portal Token
              </span>
            </div>
            <div className="w-10 h-10 bg-slate-900 text-white rounded flex items-center justify-center text-[10px] font-mono font-bold">
              QR
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-t border-slate-200 text-slate-500 text-[11px]">
          <span>{t('pmsymPension')}</span>
          <button
            onClick={() => setEShramWorkerModal(null)}
            className="px-3 py-1 bg-primary text-white rounded font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
