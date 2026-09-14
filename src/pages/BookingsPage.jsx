import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const BookingsPage = () => {
  const { bookings, releaseEscrow, navigateTo, setDisputeModalBooking, t, userRole, currentWorker } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'locked' | 'disputed' | 'completed'

  const isWorker = userRole === 'worker';

  // Filter bookings for the active user role
  const roleBookings = isWorker
    ? (bookings || []).filter((b) => b.workerId === currentWorker?.id || b.workerName === currentWorker?.name)
    : (bookings || []);

  const filteredBookings = roleBookings.filter((b) => {
    if (activeTab === 'locked') return b.status === 'escrow_locked';
    if (activeTab === 'disputed') return b.status === 'disputed';
    if (activeTab === 'completed') return b.status === 'released' || b.status === 'refunded';
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 pb-28 md:pb-16 animate-fade-in">
      {/* Header with Role Separation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-black text-xl sm:text-2xl text-on-surface">
            {isWorker ? 'Job Orders & Escrow Payouts' : (t('navBookings') || 'My Bookings & Escrow Vault')}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
            {isWorker
              ? '100% of agreed labour is credited directly to your bank account upon customer PIN verification.'
              : 'Payments remain 100% safe in RBI-compliant escrow until you authorize with your 4-digit PIN.'}
          </p>
        </div>
        {!isWorker && (
          <button
            type="button"
            onClick={() => navigateTo('workers')}
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shrink-0 active:scale-95 transition-all shadow-xs"
          >
            + Book Service
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          { id: 'all', label: `All (${roleBookings.length})` },
          {
            id: 'locked',
            label: isWorker
              ? `Escrow Locked (${roleBookings.filter((b) => b.status === 'escrow_locked').length})`
              : `Held in Escrow (${roleBookings.filter((b) => b.status === 'escrow_locked').length})`,
          },
          {
            id: 'disputed',
            label: `Disputed (${roleBookings.filter((b) => b.status === 'disputed').length})`,
          },
          {
            id: 'completed',
            label: `Completed (${roleBookings.filter((b) => b.status === 'released' || b.status === 'refunded').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 active:scale-95 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-surface-variant/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List (2-column responsive grid on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-surface-container-low rounded-2xl p-6 border border-surface-variant/30">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">
              receipt_long
            </span>
            <p className="font-bold text-on-surface text-base">
              {isWorker ? 'No job orders found in this category.' : 'No bookings in this category.'}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              {isWorker ? 'Turn on duty on your dashboard to receive customer dispatches.' : 'Hire a verified cooperative technician to get started.'}
            </p>
            <button
              type="button"
              onClick={() => navigateTo(isWorker ? 'worker-dashboard' : 'workers')}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              {isWorker ? 'Go to Worker Hub' : 'Explore Technicians'}
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
                className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-2xs border border-surface-variant/40 flex flex-col justify-between gap-3.5"
              >
                <div className="flex flex-col gap-3">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono text-on-surface-variant font-bold">
                      Order #{b.id} • {b.bookingDate}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black ${
                        isDisputed
                          ? 'bg-error-container text-on-error-container'
                          : isRefunded
                          ? 'bg-blue-100 text-blue-800'
                          : isLocked
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isDisputed ? 'gavel' : isRefunded ? 'currency_exchange' : isLocked ? 'lock' : 'check_circle'}
                      </span>
                      {isDisputed
                        ? 'In Mediation'
                        : isRefunded
                        ? '100% Refunded'
                        : isLocked
                        ? 'Held in Escrow'
                        : 'Payout Released'}
                    </span>
                  </div>

                  {/* Worker & Service Overview */}
                  <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-surface-variant/20">
                    <img
                      alt={b.workerName}
                      src={b.workerAvatar}
                      className="w-12 h-12 rounded-xl object-cover border border-surface-variant/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-on-surface truncate">
                        {b.serviceTitle}
                      </h3>
                      <p className="text-xs text-on-surface-variant font-medium">
                        {isWorker ? `Customer: Priya Sharma` : b.workerName} • <strong className="text-on-surface">{b.timeSlot}</strong>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-primary block">₹{b.totalEscrow}</span>
                      <span className="text-[10px] text-secondary font-bold">0% fee cut</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant px-1">
                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0">
                      location_on
                    </span>
                    <span className="truncate font-medium">{b.address}</span>
                  </div>
                </div>

                {/* Worker View: Payout status instruction / Customer View: Secret PIN */}
                {isLocked && !isWorker && (
                  <div className="bg-primary/5 p-3.5 rounded-xl border border-primary/20 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-primary block">
                          4-Digit Escrow Release PIN
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          Share with technician only after service is completed.
                        </span>
                      </div>
                      <span className="text-xl font-black text-primary tracking-widest bg-white px-3 py-1 rounded-xl border border-primary/20 shadow-2xs">
                        {b.releaseOtp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => releaseEscrow(b.id)}
                        className="flex-1 h-10 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Release Payment (Simulate)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisputeModalBooking(b)}
                        className="px-3.5 h-10 bg-error/10 hover:bg-error/20 text-error rounded-xl font-bold text-xs border border-error/20 flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">gavel</span>
                        <span>Dispute</span>
                      </button>
                    </div>
                  </div>
                )}

                {isLocked && isWorker && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-amber-700">lock_clock</span>
                      <span>₹{b.labourAmount} locked in Escrow. Collect 4-digit PIN from customer after work.</span>
                    </span>
                  </div>
                )}

                {isDisputed && (
                  <div className="bg-error-container/30 p-3 rounded-xl border border-error/30 text-xs text-on-error-container flex flex-col gap-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                      Dispute Active: {b.disputeReason}
                    </span>
                    <span className="text-xs opacity-90">
                      Funds are frozen in RBI Escrow. Chapter Admin is reviewing this case.
                    </span>
                  </div>
                )}

                {isRefunded && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between text-blue-900 text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px]">currency_exchange</span>
                      <span>₹{b.totalEscrow} refunded to original payment channel</span>
                    </span>
                    <span className="font-bold bg-white px-2 py-0.5 rounded text-[10px]">Refunded</span>
                  </div>
                )}

                {b.status === 'released' && (
                  <div className="bg-secondary-container/30 p-3 rounded-xl border border-secondary/20 flex items-center justify-between text-secondary text-xs">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px]">task_alt</span>
                      <span>₹{b.labourAmount} directly paid to technician bank account</span>
                    </span>
                    <span className="font-bold bg-white px-2.5 py-0.5 rounded-md text-xs text-primary">Paid</span>
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
