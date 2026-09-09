import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const EmergencyModal = () => {
  const { emergencyModalOpen, setEmergencyModalOpen, createBooking, navigateTo, workers } = useApp();
  const [selectedEmergencyTrade, setSelectedEmergencyTrade] = useState('electrical');
  const [urgencyNote, setUrgencyNote] = useState('Power trip & burning smell near switchboard');
  const [isDispatching, setIsDispatching] = useState(false);

  if (!emergencyModalOpen) return null;

  const handleQuickDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      const worker = workers.find((w) => w.category === selectedEmergencyTrade) || workers[0];
      createBooking({
        worker,
        serviceTitle: `EMERGENCY 15-Min Dispatch: ${selectedEmergencyTrade.toUpperCase()}`,
        timeSlot: 'Immediate (15-Min ETA)',
        labourAmount: 399,
        address: 'Indiranagar Ward 112 (GPS Location Dispatched)',
      });
      setEmergencyModalOpen(false);
      navigateTo('bookings');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-space-md shadow-2xl flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
          <div className="flex items-center gap-2 text-tertiary">
            <span className="material-symbols-outlined text-[24px] material-symbols-fill text-tertiary">
              emergency_home
            </span>
            <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
              Emergency Dispatch
            </span>
          </div>
          <button
            onClick={() => setEmergencyModalOpen(false)}
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* ETA Highlight */}
        <div className="bg-tertiary-fixed text-on-tertiary-fixed p-space-sm rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
            <span className="font-label-md text-label-md font-bold">On-Duty Technicians Active</span>
          </div>
          <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-label-sm text-label-sm font-extrabold">
            15-min ETA
          </span>
        </div>

        {/* Trade Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface font-bold">
            Select Urgent Issue
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'electrical', label: 'Power Trip / Sparks', icon: 'electric_bolt' },
              { id: 'plumbing', label: 'Burst Pipe / Overflow', icon: 'plumbing' },
              { id: 'carpentry', label: 'Jammed Door / Lockout', icon: 'lock_open' },
              { id: 'ac', label: 'AC Gas Leak / Smoke', icon: 'mode_fan' },
            ].map((trade) => (
              <button
                key={trade.id}
                type="button"
                onClick={() => setSelectedEmergencyTrade(trade.id)}
                className={`p-2.5 rounded-lg flex items-center gap-2 text-left border text-body-sm font-semibold transition-all ${
                  selectedEmergencyTrade === trade.id
                    ? 'border-tertiary bg-tertiary-fixed/30 text-tertiary'
                    : 'border-surface-variant bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{trade.icon}</span>
                <span className="leading-tight">{trade.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Issue Description */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-md text-label-md text-on-surface font-bold">
            Short Description / Landmark
          </label>
          <input
            type="text"
            value={urgencyNote}
            onChange={(e) => setUrgencyNote(e.target.value)}
            className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface text-body-md border border-surface-variant focus:outline-none focus:border-tertiary"
            placeholder="e.g. Water leak near main meter"
          />
        </div>

        {/* Dispatch Action */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            disabled={isDispatching}
            onClick={handleQuickDispatch}
            className="w-full h-auto min-h-12 py-2.5 px-3 rounded-xl bg-tertiary text-on-tertiary font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-50 text-xs sm:text-sm text-center leading-tight"
          >
            {isDispatching ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                <span>Connecting to Nearest Co-op Unit...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px] shrink-0">bolt</span>
                <span className="truncate">Dispatch Nearest Tech Now (₹399 Escrow)</span>
              </>
            )}
          </button>
          <p className="text-center font-label-sm text-[11px] text-on-surface-variant">
            No cancellation fee if technician is not on site within 20 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};
