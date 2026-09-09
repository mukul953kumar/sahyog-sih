import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const BookingsPage = () => {
  const { bookings, releaseEscrow, navigateTo, setDisputeModalBooking, t } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'locked' | 'disputed' | 'completed'
  const [viewInvoice, setViewInvoice] = useState(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'locked') return b.status === 'escrow_locked';
    if (activeTab === 'disputed') return b.status === 'disputed';
    if (activeTab === 'completed') return b.status === 'released' || b.status === 'refunded';
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-space-md pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
            {t('navBookings')}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            All payments held safely in RBI-compliant escrow until your approval.
          </p>
        </div>
        <button
          onClick={() => navigateTo('workers')}
          className="px-3 py-2 rounded-xl bg-primary text-white font-bold text-xs shrink-0 active:scale-95 transition-all shadow-xs"
        >
          + Book Service
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-surface-variant/40 pb-2 overflow-x-auto no-scrollbar">
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
            className={`px-3 py-1.5 rounded-full text-label-md font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="flex flex-col gap-space-md">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-xl p-6">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">
              receipt_long
            </span>
            <p className="font-headline-sm text-on-surface font-bold">No bookings found</p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Book a verified technician near you to get started.
            </p>
            <button
              onClick={() => navigateTo('workers')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-label-md font-bold"
            >
              Explore Services
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
                className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-sm"
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                    Booking ID: #{b.id} • {b.bookingDate}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-extrabold ${
                      isDisputed
                        ? 'bg-error-container text-on-error-container border border-error/30'
                        : isRefunded
                        ? 'bg-blue-100 text-blue-800'
                        : isLocked
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container-high text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isDisputed ? 'gavel' : isRefunded ? 'currency_exchange' : isLocked ? 'lock' : 'check_circle'}
                    </span>
                    {isDisputed
                      ? 'In Chapter Dispute Mediation'
                      : isRefunded
                      ? '100% Escrow Refunded'
                      : isLocked
                      ? 'Held in Escrow'
                      : 'Payment Released'}
                  </span>
                </div>

                {/* Worker and Service Info */}
                <div className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg border border-surface-variant/30">
                  <img
                    alt={b.workerName}
                    src={b.workerAvatar}
                    className="w-14 h-14 rounded-lg object-cover border border-surface-variant/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline-sm text-[16px] font-extrabold text-on-surface truncate">
                      {b.serviceTitle}
                    </h3>
                    <p className="font-label-md text-on-surface-variant font-semibold">
                      {b.workerName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-label-sm text-on-surface-variant">
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[15px] text-primary">
                          schedule
                        </span>
                        {b.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address & Escrow Breakdown */}
                <div className="text-body-sm flex flex-col gap-1 text-on-surface-variant px-1">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      location_on
                    </span>
                    <span className="truncate">{b.address}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-body-md border-t border-surface-variant/30 mt-1">
                    <span>Agreed Labour (100% to Worker):</span>
                    <strong className="text-on-surface font-extrabold">₹{b.labourAmount}</strong>
                  </div>
                  <div className="flex justify-between items-center text-body-md">
                    <span className="text-secondary font-bold">Co-op Commission Cut:</span>
                    <strong className="text-secondary font-black">₹0</strong>
                  </div>
                  <div className="flex justify-between items-center text-body-md">
                    <span>Insurance & Mutual Fund:</span>
                    <span>₹{b.insuranceAmount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-surface-variant/30 font-bold text-on-surface">
                    <span className="font-headline-sm text-[15px]">Total Escrow Amount:</span>
                    <span className="font-headline-sm text-primary font-black">₹{b.totalEscrow}</span>
                  </div>
                </div>

                {/* Secret Release PIN or Dispute or Completed Confirmation */}
                {isLocked && (
                  <div className="bg-primary-fixed/20 p-space-sm rounded-xl border border-primary/30 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-primary font-extrabold uppercase">
                          Secret 4-Digit Release PIN
                        </span>
                        <span className="text-[12px] text-on-surface-variant">
                          Give to {b.workerName.split(' ')[0]} only when work is done.
                        </span>
                      </div>
                      <span className="font-headline-xl text-primary font-black tracking-widest bg-white px-3 py-1 rounded-lg shadow-xs">
                        {b.releaseOtp}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => releaseEscrow(b.id)}
                        className="w-full sm:flex-1 h-11 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all text-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        <span>Release Payment (Simulate)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisputeModalBooking(b)}
                        className="w-full sm:w-auto px-4 h-10 sm:h-11 bg-error/10 hover:bg-error/20 text-error rounded-xl font-bold text-xs border border-error/30 flex items-center justify-center gap-1 active:scale-98 transition-all"
                        title="Freeze funds if technician does not show up or service is defective"
                      >
                        <span className="material-symbols-outlined text-[16px]">gavel</span>
                        <span>Raise Dispute</span>
                      </button>
                    </div>
                  </div>
                )}

                {isDisputed && (
                  <div className="bg-error-container/40 p-3 rounded-xl border border-error/40 flex flex-col gap-1 text-on-error-container">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                      <span>Dispute Active: {b.disputeReason}</span>
                    </div>
                    <p className="text-[11px]">
                      Escrow is frozen under RBI consumer rules. Chapter Admin is reviewing the case to issue a 100% refund.
                    </p>
                  </div>
                )}

                {isRefunded && (
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg flex items-center justify-between text-blue-900 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
                      <span className="font-bold">₹{b.totalEscrow} refunded to your original payment method.</span>
                    </div>
                    <span className="font-bold bg-white px-2 py-0.5 rounded text-[10px]">Refunded</span>
                  </div>
                )}

                {b.status === 'released' && (
                  <div className="bg-surface-container-high/50 p-2.5 rounded-lg border border-secondary/20 flex items-center justify-between text-secondary">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">task_alt</span>
                      <span className="font-label-md font-bold text-xs">
                        ₹{b.labourAmount} directly paid to {b.workerName.split(' ')[0]}'s account
                      </span>
                    </div>
                    <button
                      onClick={() => setViewInvoice(b)}
                      className="text-xs font-bold text-primary underline"
                    >
                      View Receipt
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Invoice Modal Simulation */}
      {viewInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl flex flex-col gap-3 text-xs text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h4 className="font-black text-sm text-primary">SAHYOG Cooperative Invoice</h4>
                <p className="text-[10px] text-slate-500">Booking #{viewInvoice.id}</p>
              </div>
              <button onClick={() => setViewInvoice(null)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="py-1.5 flex justify-between">
                <span>Technician:</span>
                <strong>{viewInvoice.workerName}</strong>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Labour Fee:</span>
                <strong>₹{viewInvoice.labourAmount}</strong>
              </div>
              <div className="py-1.5 flex justify-between text-secondary font-bold">
                <span>Platform Commission:</span>
                <span>₹0.00 (0%)</span>
              </div>
              <div className="py-1.5 flex justify-between">
                <span>Mutual Welfare Protection:</span>
                <span>₹{viewInvoice.insuranceAmount}</span>
              </div>
              <div className="py-2 flex justify-between text-sm font-black border-t border-slate-200">
                <span>Total Paid:</span>
                <span className="text-primary">₹{viewInvoice.totalEscrow}</span>
              </div>
            </div>
            <button
              onClick={() => setViewInvoice(null)}
              className="w-full py-2 bg-primary text-white rounded-lg font-bold text-xs"
            >
              Print / Save Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
