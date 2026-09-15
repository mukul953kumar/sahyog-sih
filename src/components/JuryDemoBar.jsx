import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const JuryDemoBar = () => {
  const {
    switchRole,
    userRole,
    openLiveTracking,
    bookings,
    claimEscrowWithPin,
    submitOtpRefusalClaim,
    triggerCustomerFakeClaimDispute,
    setWardAuditModalBooking,
    setInvoiceModalBooking,
    setAuditReportModalOpen,
    navigateTo,
    currentWorker,
  } = useApp();

  const [isOpen, setIsOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [demoNotice, setDemoNotice] = useState('');

  const showNotice = (msg) => {
    setDemoNotice(msg);
    setTimeout(() => setDemoNotice(''), 4000);
  };

  // Step 1: Customer Hire & Escrow Lock
  const handleStep1 = () => {
    setActiveStep(1);
    switchRole('customer');
    navigateTo('booking');
    soundEffects.playSuccessChime();
    showNotice('Step 1: Customer Booking initiated. ₹450 held safely in RBI-compliant Escrow.');
  };

  // Step 2: Live Uber-Style GPS Tracking
  const handleStep2 = () => {
    setActiveStep(2);
    const activeBooking = bookings.find((b) => b.status === 'escrow_locked') || bookings[0];
    openLiveTracking(activeBooking);
    soundEffects.playRadarBlip();
    showNotice('Step 2: Real-time Leaflet GPS tracking active with dynamic ETA & bearing angle.');
  };

  // Step 3: Worker 100% Direct Payout with Escrow PIN
  const handleStep3 = () => {
    setActiveStep(3);
    switchRole('worker');
    const lockedBooking = bookings.find((b) => b.status === 'escrow_locked');
    if (lockedBooking && lockedBooking.releaseOtp) {
      // Auto-claim payout simulation
      claimEscrowWithPin(lockedBooking.releaseOtp);
      soundEffects.playCashPayoutChime();
      showNotice(`Step 3: PIN ${lockedBooking.releaseOtp} verified! ₹${lockedBooking.labourAmount} credited to Worker account (0% fee cut).`);
    } else {
      soundEffects.playCashPayoutChime();
      showNotice('Step 3: Worker Hub active! 100% direct bank payout with ₹0 platform commission.');
    }
  };

  // Step 4: Transparent Co-Op Audit & Tax-Free Invoice
  const handleStep4 = () => {
    setActiveStep(4);
    switchRole('admin');
    const targetBooking = bookings[0];
    if (targetBooking) {
      setInvoiceModalBooking(targetBooking);
    } else {
      setAuditReportModalOpen(true);
    }
    soundEffects.playSuccessChime();
    showNotice('Step 4: 100% Direct Bank Settlement & Tax-Free Invoice generated.');
  };

  // Edge Case Demo 1: Customer Refused PIN & Worker Proof Flow
  const handleOtpRefusalDemo = () => {
    switchRole('worker');
    navigateTo('bookings');
    const targetBooking = bookings.find((b) => b.status === 'escrow_locked') || bookings[0];
    if (targetBooking) {
      submitOtpRefusalClaim(targetBooking.id, {
        reason: 'Customer demanding extra unpaid work',
        notes: 'Completed full switchboard wiring. Customer refused to share 4-digit PIN.',
        photos: [
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
        ],
        gpsStayMinutes: 48,
        audioProof: true,
      });
      soundEffects.playRadarBlip();
      showNotice('Edge Case 1: Worker Proof submitted with 2-Hour Auto-Release Protection!');
    }
  };

  // Edge Case Demo 2: Customer Flags Fake Claim -> 2-Min Live Video Audit
  const handleFakeClaimAuditDemo = () => {
    switchRole('customer');
    navigateTo('bookings');
    const targetBooking = bookings.find((b) => b.status === 'otp_refused' || b.status === 'escrow_locked') || bookings[0];
    if (targetBooking) {
      triggerCustomerFakeClaimDispute(targetBooking.id, 'Worker submitted fake proof without doing work');
      soundEffects.playRadarBlip();
      showNotice('Edge Case 2: Escrow Frozen! Ward 112 Warden Assigned for 2-Minute Live Video Audit.');
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs px-3.5 py-2 rounded-full shadow-lg border-2 border-amber-300 flex items-center gap-2 active:scale-95 transition-all animate-bounce"
        title="Open SIH Jury Guided Demo Bar"
      >
        <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
        <span>🏆 Jury Demo Flow</span>
      </button>
    );
  }

  return (
    <aside aria-label="SIH Jury Pitch Roadmap" className="fixed bottom-16 md:bottom-3 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-slate-950/95 text-white backdrop-blur-xl border-2 border-amber-400/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl transition-all animate-fade-in">
      {/* Top Banner Row */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
          <span className="font-black text-amber-400 tracking-wide uppercase text-[11px] sm:text-xs">
            🏆 SIH Jury Guided Demo Pitch
          </span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            • 4 Steps + Anti-Fraud Video Defense
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {demoNotice && (
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md truncate max-w-[180px] sm:max-w-[280px]">
              {demoNotice}
            </span>
          )}
          <button
            type="button"
            onClick={handleOtpRefusalDemo}
            className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95"
            title="Simulate edge-case when customer refuses to give completion PIN"
          >
            <span className="material-symbols-outlined text-[13px]">shield_with_heart</span>
            <span>OTP Refusal</span>
          </button>
          <button
            type="button"
            onClick={handleFakeClaimAuditDemo}
            className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95"
            title="Simulate 2-minute live video audit when customer reports fake claim"
          >
            <span className="material-symbols-outlined text-[13px]">videocam</span>
            <span>Video Audit</span>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs transition-colors"
            title="Minimize Demo Bar"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      </div>

      {/* 4 Step Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-2">
        {/* Step 1 */}
        <button
          type="button"
          onClick={handleStep1}
          className={`px-2.5 py-2 rounded-xl text-left transition-all border flex flex-col justify-between ${activeStep === 1
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
              : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
            }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className={`text-[10px] uppercase font-mono font-bold ${activeStep === 1 ? 'text-slate-900' : 'text-amber-400'}`}>
              Step 1
            </span>
            <span className="material-symbols-outlined text-[16px]">shopping_cart_checkout</span>
          </div>
          <span className="text-xs font-bold mt-1 truncate w-full">1. Customer Booking</span>
          <span className={`text-[10px] leading-tight ${activeStep === 1 ? 'text-slate-800' : 'text-slate-400'}`}>
            ₹0 Fee Escrow Lock
          </span>
        </button>

        {/* Step 2 */}
        <button
          type="button"
          onClick={handleStep2}
          className={`px-2.5 py-2 rounded-xl text-left transition-all border flex flex-col justify-between ${activeStep === 2
              ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-xs'
              : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
            }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className={`text-[10px] uppercase font-mono font-bold ${activeStep === 2 ? 'text-slate-900' : 'text-emerald-400'}`}>
              Step 2
            </span>
            <span className="material-symbols-outlined text-[16px]">near_me</span>
          </div>
          <span className="text-xs font-bold mt-1 truncate w-full">2. Live GPS Map</span>
          <span className={`text-[10px] leading-tight ${activeStep === 2 ? 'text-slate-800' : 'text-slate-400'}`}>
            Dynamic ETA & OTP
          </span>
        </button>

        {/* Step 3 */}
        <button
          type="button"
          onClick={handleStep3}
          className={`px-2.5 py-2 rounded-xl text-left transition-all border flex flex-col justify-between ${activeStep === 3
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
              : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
            }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className={`text-[10px] uppercase font-mono font-bold ${activeStep === 3 ? 'text-slate-900' : 'text-amber-400'}`}>
              Step 3
            </span>
            <span className="material-symbols-outlined text-[16px]">payments</span>
          </div>
          <span className="text-xs font-bold mt-1 truncate w-full">3. 100% Worker Payout</span>
          <span className={`text-[10px] leading-tight ${activeStep === 3 ? 'text-slate-800' : 'text-slate-400'}`}>
            ₹0 Commission Credit
          </span>
        </button>

        {/* Step 4 */}
        <button
          type="button"
          onClick={handleStep4}
          className={`px-2.5 py-2 rounded-xl text-left transition-all border flex flex-col justify-between ${activeStep === 4
              ? 'bg-blue-400 text-slate-950 border-blue-300 font-black shadow-xs'
              : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800'
            }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className={`text-[10px] uppercase font-mono font-bold ${activeStep === 4 ? 'text-slate-900' : 'text-blue-400'}`}>
              Step 4
            </span>
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          </div>
          <span className="text-xs font-bold mt-1 truncate w-full">4. Co-Op Invoice</span>
          <span className={`text-[10px] leading-tight ${activeStep === 4 ? 'text-slate-800' : 'text-slate-400'}`}>
            Tax-Free DPI Audit
          </span>
        </button>
      </div>
    </aside>
  );
};
