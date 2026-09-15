import React from 'react';
import { useApp } from '../context/AppContext';

export const LiveTripBanner = () => {
  const { bookings, openLiveTracking, userRole } = useApp();

  if (userRole === 'worker' || userRole === 'admin') return null;

  // Find the most recent active escrow-locked booking
  const activeBooking = (bookings || []).find((b) => b.status === 'escrow_locked');

  if (!activeBooking) return null;

  const workerName = activeBooking.workerName || 'Awadhesh Sharma';
  const workerAvatar = activeBooking.workerAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80';
  const serviceTitle = activeBooking.serviceTitle || 'Service in Progress';
  const releaseOtp = activeBooking.releaseOtp || '7429';

  return (
    <aside
      aria-label="Active service live tracking banner"
      className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl p-3 sm:p-4 shadow-xl border border-primary/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>

      {/* Left side: Avatar + Live Pulse + Technician Details */}
      <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto z-10">
        <div className="relative shrink-0">
          <img
            src={workerAvatar}
            alt={workerName}
            className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-slate-900"></span>
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md">
              <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
              <span>Live GPS Active</span>
            </span>
            <span className="text-xs text-amber-300 font-bold">ETA ~11 mins</span>
          </div>

          <h4 className="font-extrabold text-xs sm:text-sm text-white truncate mt-0.5">
            {workerName} <span className="text-slate-400 font-normal">is arriving for</span> {serviceTitle}
          </h4>

          <p className="text-[11px] text-slate-300 truncate">
            Secret Release PIN: <strong className="text-amber-300 font-mono tracking-wider">{releaseOtp}</strong>
          </p>
        </div>
      </div>

      {/* Right side: Action CTA Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 z-10">
        <button
          type="button"
          onClick={() => openLiveTracking(activeBooking)}
          className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all border border-primary/50"
        >
          <span className="material-symbols-outlined text-[18px] material-symbols-fill text-amber-300">
            location_on
          </span>
          <span>Track Live on Map</span>
        </button>
      </div>
    </aside>
  );
};
