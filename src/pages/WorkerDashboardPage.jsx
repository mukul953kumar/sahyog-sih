import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';
import { CoopHardwareStoreModal } from '../components/CoopHardwareStoreModal';

export const WorkerDashboardPage = () => {
  const {
    t,
    currentWorker,
    workerOnDuty,
    setWorkerOnDuty,
    workerEarnings,
    incomingJobs,
    acceptIncomingJob,
    declineIncomingJob,
    claimEscrowWithPin,
    bookings,
    switchRole,
    openLiveTracking,
    setEShramWorkerModal,
    setDigiLockerWorkerModal,
    setSkillAssessmentModalWorker,
    setReassignModalBooking,
    setOtpRefusalModalBooking,
    language,
  } = useApp();

  const isHindi = language === 'hi';

  const [pinInput, setPinInput] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [subsidyRequested, setSubsidyRequested] = useState(false);
  const [hardwareStoreOpen, setHardwareStoreOpen] = useState(false);

  const activeWorkerBookings = (bookings || []).filter(
    (b) => b.workerId === currentWorker.id && b.status === 'escrow_locked'
  );

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.length < 4) return;

    const result = claimEscrowWithPin(pinInput.trim());
    setClaimResult(result);
    if (result.success) {
      soundEffects.playCashPayoutChime();
      setPinInput('');
    }
  };

  const playJobAudio = (job) => {
    setAudioPlaying(true);
    if ('speechSynthesis' in window) {
      const speechText = isHindi
        ? `नया काम: ${job.customerName}, पता: ${job.address}. काम: ${job.trade}. तय मूल्य: ${job.quote} रुपये.`
        : `New job dispatch: ${job.customerName}, address: ${job.address}. Service: ${job.trade}. Agreed payout: ${job.quote} rupees.`;
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioPlaying(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5 pb-28 md:pb-16 animate-fade-in">
      {/* 1. UNIFIED COMMAND HEADER (Profile + Duty Status + Quick Switch) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Profile Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              alt={currentWorker.name}
              src={currentWorker.detailAvatar || currentWorker.avatar}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-2xs"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                workerOnDuty ? 'bg-secondary ring-2 ring-secondary/30' : 'bg-slate-400'
              }`}
            ></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-black text-lg sm:text-xl text-slate-900 truncate">
                {currentWorker.name}
              </h1>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-md">
                Co-Owner #{currentWorker.memberId}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {currentWorker.trade} • {currentWorker.chapter}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                ★ {currentWorker.rating} Rating
              </span>
              <span>•</span>
              <span className="font-bold text-secondary">{currentWorker.onTimeRate} On-Time Rate</span>
            </div>
          </div>
        </div>

        {/* Duty Toggle & Switch Persona */}
        <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 self-stretch md:self-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                workerOnDuty ? 'bg-secondary animate-pulse' : 'bg-slate-400'
              }`}
            ></span>
            <span className="text-xs font-bold text-slate-800">
              {workerOnDuty ? 'On-Duty' : 'Off-Duty'}
            </span>
            <button
              type="button"
              onClick={() => setWorkerOnDuty(!workerOnDuty)}
              className={`ml-1 px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                workerOnDuty
                  ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
                  : 'bg-primary text-white hover:bg-primary-container'
              }`}
            >
              {workerOnDuty ? 'Go Off' : 'Go On'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => switchRole('customer')}
            className="px-3.5 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-2xl transition-colors shrink-0"
          >
            Customer View
          </button>
        </div>
      </div>

      {/* 2. THREE KEY METRIC CARDS (Earnings & 0% Platform Commission) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Today's Earnings
          </span>
          <div className="mt-1">
            <span className="text-2xl sm:text-3xl font-black text-primary">
              ₹{workerEarnings.today}
            </span>
            <p className="text-xs text-secondary font-bold mt-0.5">
              {workerEarnings.jobsToday} {workerEarnings.jobsToday === 1 ? 'Job' : 'Jobs'} Completed
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            This Week
          </span>
          <div className="mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{workerEarnings.week}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              100% Direct Bank Settlement
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
            Platform Cut
          </span>
          <div className="mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">
              ₹0 Cut (0%)
            </span>
            <p className="text-xs text-emerald-800 font-bold mt-0.5">
              100% Direct Remuneration to Family
            </p>
          </div>
        </div>
      </div>

      {/* 3. LIVE GPS BROADCASTING BANNER (If Active En Route Job Exists) */}
      {activeWorkerBookings.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-950 text-white flex items-center justify-between gap-3 border border-emerald-500/40 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-3 w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="min-w-0">
              <span className="text-xs font-black text-amber-300 block uppercase tracking-wider">
                Live GPS En Route Active
              </span>
              <span className="text-xs text-slate-300 truncate block">
                Dispatched to customer • Order #{activeWorkerBookings[0].id} ({activeWorkerBookings[0].serviceTitle})
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openLiveTracking(activeWorkerBookings[0])}
            className="px-3 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shrink-0 shadow-xs active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>View Live Map</span>
          </button>
        </div>
      )}

      {/* 4. BALANCED TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 Cols on Desktop) - Active Dispatches Feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  {t('activeJobsTitle') || 'Active & Incoming Dispatches'}
                </h2>
                <p className="text-xs text-slate-500">Real-time local job requests in your coverage area</p>
              </div>
              <span className="text-xs bg-primary/10 text-primary font-black px-2.5 py-1 rounded-lg">
                {incomingJobs.length} Available
              </span>
            </div>

            <div className="space-y-3">
              {incomingJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col gap-3 hover:border-primary/40 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                          {job.trade}
                        </h3>
                        {/* Audio readout button for blue-collar workers */}
                        <button
                          type="button"
                          onClick={() => playJobAudio(job)}
                          className={`p-1.5 rounded-xl text-primary hover:bg-primary/20 transition-all shrink-0 ${
                            audioPlaying ? 'bg-primary text-white animate-bounce' : 'bg-primary/10'
                          }`}
                          title={isHindi ? "काम का विवरण सुनें (बोलकर सुनें)" : "Play Audio Instructions"}
                        >
                          <span className="material-symbols-outlined text-[16px]">volume_up</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        Customer: <strong>{job.customerName}</strong> • {job.address}
                      </p>
                    </div>
                    <span className="font-black text-xl text-primary shrink-0">₹{job.quote}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/50">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">near_me</span>
                      <span>Distance: <strong>{job.distance}</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                      <span>Customer ETA: <strong>{job.eta}</strong></span>
                    </span>
                  </div>

                  {job.status === 'accepted' ? (
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-emerald-950 block">{job.customerName || 'Priya Sharma'}</span>
                          <span className="text-[11px] text-emerald-800 font-mono">{job.customerPhone || '+91 98765 43210'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${job.customerPhone || '9876543210'}`}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[13px]">call</span>
                            <span>{isHindi ? 'कॉल' : 'Call'}</span>
                          </a>
                          <a
                            href={`https://wa.me/919876543210?text=Namaste%20Priya%20ji,%20I%20have%20reached%20your%20building.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-green-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[13px]">chat</span>
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-900 block">📍 Landmark & Door:</span>
                        <span>Flat #402, 4th Floor • Near Shiv Mandir • Press Bell 402</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => acceptIncomingJob(job.id)}
                        className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>Accept Job</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const activeB = bookings.find((b) => b.status === 'escrow_locked') || bookings[0];
                          if (activeB) setReassignModalBooking(activeB);
                        }}
                        className="px-3.5 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs active:scale-95 transition-all flex items-center gap-1 border border-slate-200"
                        title="Handover this dispatch to another verified guild peer"
                      >
                        <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                        <span>Handover</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => declineIncomingJob(job.id)}
                        className="px-3.5 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (5 Cols on Desktop) - Actions, PIN Claim & Guild Hub */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Card 1: Direct Escrow Payout with Secret PIN */}
          <section className="bg-gradient-to-br from-primary/5 via-white to-white rounded-3xl p-5 shadow-sm border-2 border-primary/25 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px] material-symbols-fill">
                  lock_open
                </span>
                <h2 className="font-bold text-sm sm:text-base text-slate-900">
                  {t('claimEscrowTitle') || 'Claim Escrow Payout'}
                </h2>
              </div>
              <span className="text-[10px] font-black bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md">
                0% Fee Payout
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Enter the 4-digit PIN provided by customer after completing work to release instant 100% bank transfer.
            </p>

            <form onSubmit={handlePinSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 7429"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-28 h-11 text-center text-xl font-black tracking-widest rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary tabular-nums shrink-0 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
              />
              <button
                type="submit"
                className="flex-1 h-11 bg-primary hover:bg-primary-container text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all text-xs"
              >
                <span className="material-symbols-outlined text-[17px]">verified</span>
                <span>Claim Payout</span>
              </button>
            </form>

            {claimResult && (
              <div
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 mt-1 ${
                  claimResult.success
                    ? 'bg-secondary-container text-on-secondary-container border border-secondary/30'
                    : 'bg-error-container text-on-error-container border border-error/30'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {claimResult.success ? 'check' : 'error'}
                </span>
                <span>{claimResult.message}</span>
              </div>
            )}

            {/* Helper Trigger if Customer Refuses PIN */}
            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  const targetBooking =
                    bookings.find((b) => b.status === 'escrow_locked' || b.status === 'otp_refused') || bookings[0];
                  if (targetBooking) {
                    setOtpRefusalModalBooking(targetBooking);
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-700">shield_with_heart</span>
                <span>
                  {isHindi
                    ? 'ग्राहक ने OTP नहीं दिया? फ़ोटो व जीपीएस साक्ष्य सबमिट करें'
                    : 'Customer Refusing PIN? Submit Geo & Photo Proof'}
                </span>
              </button>
            </div>
          </section>

          {/* Card 2: Cooperative Wholesale Depot (Harmonious Card - No visual clash!) */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">Wholesale Hardware Depot</h3>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-md uppercase">
                30% Off
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Order ISI certified wires, MCBs, pipes and Bosch power tools directly from manufacturer at bulk wholesale rates.
            </p>

            <button
              type="button"
              onClick={() => setHardwareStoreOpen(true)}
              className="w-full py-2.5 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">shopping_bag</span>
              <span>Browse Wholesale Depot Catalog</span>
            </button>
          </section>

          {/* Card 3: Verified Credentials & Welfare Pool */}
          <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
                <span>Verified Credentials</span>
              </h3>
              <span className="text-[10px] text-secondary font-black">All Verified ✓</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentWorker.skillAssessment && (
                <button
                  type="button"
                  onClick={() => setSkillAssessmentModalWorker(currentWorker)}
                  className="p-2.5 bg-amber-50/80 hover:bg-amber-100 rounded-xl border border-amber-200 flex flex-col text-left transition-colors active:scale-95"
                >
                  <span className="text-[10px] text-amber-800 font-bold uppercase">Practical Demo</span>
                  <span className="font-black text-amber-950 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-700">smart_display</span>
                    <span>{currentWorker.skillAssessment.grade}</span>
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setEShramWorkerModal(currentWorker)}
                className="p-2.5 bg-emerald-50/80 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex flex-col text-left transition-colors active:scale-95"
              >
                <span className="text-[10px] text-emerald-800 font-bold uppercase">e-Shram ID</span>
                <span className="font-black text-emerald-950 mt-0.5 truncate">
                  {currentWorker.eShramId || 'SLN-4412'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDigiLockerWorkerModal(currentWorker)}
                className="p-2.5 bg-blue-50/80 hover:bg-blue-100 rounded-xl border border-blue-200 flex flex-col text-left transition-colors active:scale-95"
              >
                <span className="text-[10px] text-blue-800 font-bold uppercase">DigiLocker</span>
                <span className="font-black text-blue-950 mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-blue-700">verified</span>
                  <span>Certified</span>
                </span>
              </button>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Co-op Share</span>
                <span className="font-black text-primary mt-0.5">1 Equal Share</span>
              </div>
            </div>

            {/* Guild Tool Subsidy */}
            <div className="pt-1">
              {subsidyRequested ? (
                <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold text-center">
                  Requisition for Safety Kit submitted to Chapter Admin.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSubsidyRequested(true)}
                  className="w-full py-2 bg-surface-container-low hover:bg-surface-container border border-surface-variant/40 text-on-surface rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">construction</span>
                  <span>Claim Guild Equipment Subsidy</span>
                </button>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Cooperative Wholesale Hardware & Tools Depot Modal */}
      <CoopHardwareStoreModal
        isOpen={hardwareStoreOpen}
        onClose={() => setHardwareStoreOpen(false)}
      />
    </div>
  );
};
