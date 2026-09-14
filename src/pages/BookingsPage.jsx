import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const BookingsPage = () => {
  const { bookings, releaseEscrow, navigateTo, setDisputeModalBooking, t } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'locked' | 'disputed' | 'completed'

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'locked') return b.status === 'escrow_locked';
    if (activeTab === 'disputed') return b.status === 'disputed';
    if (activeTab === 'completed') return b.status === 'released' || b.status === 'refunded';
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-3.5 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-on-surface">
            {t('navBookings') || 'My Bookings & Escrow'}
          </h2>
          <p className="text-xs text-on-surface-variant">
            Payments are held safely in escrow until you release the PIN.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('workers')}
          className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs shrink-0 active:scale-95 transition-all shadow-xs"
        >
          + Book Service
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'all', label: `All (${bookings.length})` },
          {
            id: 'locked',
            label: `Held in Escrow (${bookings.filter((b) => b.status === 'escrow_locked').length})`,
          },
          {
            id: 'disputed',
            label: `Disputed (${bookings.filter((b) => b.status === 'disputed').length})`,
          },
          {
            id: 'completed',
            label: `Completed (${bookings.filter((b) => b.status === 'released' || b.status === 'refunded').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 active:scale-95 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-surface-variant/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="flex flex-col gap-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-10 bg-surface-container-low rounded-2xl p-6 border border-surface-variant/30">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">
              receipt_long
            </span>
            <p className="font-bold text-on-surface text-sm">No bookings in this category.</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Hire a verified cooperative technician to get started.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('workers')}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Explore Technicians
            </button>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isLocked = b.status === 'escrow_locked';
            const isDisputed = b.status === 'disputed';
            const isRefunded = b.status === 'refunded';

            return (
              <article
                key={b.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-3"
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] font-mono text-on-surface-variant font-bold">
                    Booking #{b.id} • {b.bookingDate}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-black ${
                      isDisputed
                        ? 'bg-error-container text-on-error-container'
                        : isRefunded
                        ? 'bg-blue-100 text-blue-800'
                        : isLocked
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {isDisputed ? 'gavel' : isRefunded ? 'currency_exchange' : isLocked ? 'lock' : 'check_circle'}
                    </span>
                    {isDisputed
                      ? 'In Mediation'
                      : isRefunded
                      ? '100% Refunded'
                      : isLocked
                      ? 'Held in Escrow'
                      : 'Payment Released'}
                  </span>
                </div>

                {/* Worker & Service Overview */}
                <div className="flex items-center gap-3 p-2.5 bg-surface-container-low rounded-xl border border-surface-variant/20">
                  <img
                    alt={b.workerName}
                    src={b.workerAvatar}
                    className="w-12 h-12 rounded-xl object-cover border border-surface-variant/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-on-surface truncate">
                      {b.serviceTitle}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {b.workerName} • <strong className="text-on-surface">{b.timeSlot}</strong>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-primary block">₹{b.totalEscrow}</span>
                    <span className="text-[10px] text-secondary font-bold">0% fee cut</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant px-1">
                  <span className="material-symbols-outlined text-primary text-[15px] shrink-0">
                    location_on
                  </span>
                  <span className="truncate font-medium">{b.address}</span>
                </div>

                {/* Secret Release PIN or Dispute actions if locked */}
                {isLocked && (
                  <div className="bg-primary/5 p-3 rounded-xl border border-primary/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-primary block">
                          4-Digit Escrow Release PIN
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          Share with technician only after service is completed.
                        </span>
                      </div>
                      <span className="text-lg font-black text-primary tracking-widest bg-white px-2.5 py-1 rounded-lg border border-primary/20 shadow-2xs">
                        {b.releaseOtp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => releaseEscrow(b.id)}
                        className="flex-1 h-9 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        <span>Release Payment (Simulate)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisputeModalBooking(b)}
                        className="px-3 h-9 bg-error/10 hover:bg-error/20 text-error rounded-xl font-bold text-xs border border-error/20 flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">gavel</span>
                        <span>Dispute</span>
                      </button>
                    </div>
                  </div>
                )}

                {isDisputed && (
                  <div className="bg-error-container/30 p-2.5 rounded-xl border border-error/30 text-xs text-on-error-container flex flex-col gap-0.5">
                    <span className="font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">lock_clock</span>
                      Dispute Active: {b.disputeReason}
                    </span>
                    <span className="text-[11px] opacity-90">
                      Funds are frozen in RBI Escrow. Chapter Admin is reviewing this case.
                    </span>
                  </div>
                )}

                {isRefunded && (
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center justify-between text-blue-900 text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                      <span>₹{b.totalEscrow} refunded to your account</span>
                    </span>
                    <span className="font-bold bg-white px-2 py-0.5 rounded text-[10px]">Refunded</span>
                  </div>
                )}

                {b.status === 'released' && (
                  <div className="bg-secondary-container/30 p-2.5 rounded-xl border border-secondary/20 flex items-center justify-between text-secondary text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      <span>₹{b.labourAmount} released directly to technician</span>
                    </span>
                    <span className="font-bold bg-white px-2 py-0.5 rounded text-[10px] text-primary">Paid</span>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
