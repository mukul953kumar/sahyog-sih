import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

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
    setEShramWorkerModal,
    setDigiLockerWorkerModal,
    setSkillAssessmentModalWorker,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [subsidyRequested, setSubsidyRequested] = useState(false);

  const activeWorkerBookings = bookings.filter(
    (b) => b.workerId === currentWorker.id && b.status === 'escrow_locked'
  );

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.length < 4) return;

    const result = claimEscrowWithPin(pinInput.trim());
    setClaimResult(result);
    if (result.success) {
      setPinInput('');
    }
  };

  const playJobAudio = (job) => {
    setAudioPlaying(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `नया काम: ${job.customerName}, पता: ${job.address}. काम: ${job.trade}. तय मूल्य: ${job.quote} रुपये.`
      );
      utterance.lang = 'hi-IN';
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioPlaying(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-3.5 pb-28 animate-fade-in">
      {/* 1. Header Card with Duty Status Toggle */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                alt={currentWorker.name}
                src={currentWorker.detailAvatar || currentWorker.avatar}
                className="w-12 h-12 rounded-xl object-cover border border-surface-variant/40"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  workerOnDuty ? 'bg-secondary' : 'bg-outline'
                }`}
              ></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-bold text-base text-on-surface truncate">
                  {currentWorker.name}
                </h2>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-md">
                  Co-Owner #{currentWorker.memberId}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium truncate">
                {currentWorker.trade} • {currentWorker.chapter}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => switchRole('customer')}
            className="px-2.5 py-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors shrink-0"
          >
            Switch to Customer
          </button>
        </div>

        {/* Duty Status Bar */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                workerOnDuty ? 'bg-secondary animate-pulse' : 'bg-outline'
              }`}
            ></span>
            <span className="text-xs font-bold text-on-surface">
              {workerOnDuty ? 'Status: On-Duty (Ready for Jobs)' : 'Status: Off-Duty'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWorkerOnDuty(!workerOnDuty)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              workerOnDuty
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary text-white'
            }`}
          >
            {workerOnDuty ? 'Go Off-Duty' : 'Go On-Duty'}
          </button>
        </div>
      </div>

      {/* 2. Direct Escrow Payout with Secret PIN */}
      <section className="bg-gradient-to-br from-primary/5 to-surface-container-lowest rounded-2xl p-4 shadow-2xs border-2 border-primary/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[20px] material-symbols-fill">
              lock_open
            </span>
            <h3 className="font-bold text-sm text-on-surface">
              {t('claimEscrowTitle') || 'Claim Escrow Payout (Customer PIN)'}
            </h3>
          </div>
          <span className="text-[10px] font-black bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md">
            0% Commission Payout
          </span>
        </div>

        <p className="text-xs text-on-surface-variant">
          Enter the 4-digit PIN shared by the customer after completing their service to release payment directly to your bank account.
        </p>

        <form onSubmit={handlePinSubmit} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            maxLength={4}
            placeholder="7429"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-28 h-11 text-center text-xl font-black tracking-widest rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary tabular-nums shrink-0"
          />
          <button
            type="submit"
            className="flex-1 h-11 bg-primary hover:bg-primary-container text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all text-xs"
          >
            <span className="material-symbols-outlined text-[17px]">check_circle</span>
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

        {activeWorkerBookings.length > 0 && (
          <div className="bg-surface-container-low px-2.5 py-1.5 rounded-lg text-[11px] text-on-surface-variant mt-1 flex items-center justify-between">
            <span>Customer PIN for Demo:</span>
            <code className="bg-white px-2 py-0.5 rounded font-black text-primary border border-primary/20">
              {activeWorkerBookings[0].releaseOtp}
            </code>
          </div>
        )}
      </section>

      {/* 3. Concise Worker Earnings Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            Today
          </span>
          <span className="text-lg font-black text-primary mt-0.5">
            ₹{workerEarnings.today}
          </span>
          <span className="text-[10px] text-secondary font-bold">
            {workerEarnings.jobsToday} {workerEarnings.jobsToday === 1 ? 'Job' : 'Jobs'}
          </span>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            This Week
          </span>
          <span className="text-lg font-black text-on-surface mt-0.5">
            ₹{workerEarnings.week}
          </span>
          <span className="text-[10px] text-on-surface-variant">Direct Bank Transfer</span>
        </div>

        <div className="bg-secondary-container/30 p-3 rounded-2xl border border-secondary/30 flex flex-col shadow-2xs">
          <span className="text-[10px] font-black text-on-secondary-container uppercase">
            Commission
          </span>
          <span className="text-lg font-black text-secondary mt-0.5">₹0 Cut</span>
          <span className="text-[10px] text-secondary font-bold">100% Direct Payout</span>
        </div>
      </div>

      {/* 4. Active & Incoming Job Requests with Voice Prompts */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-on-surface">
            {t('activeJobsTitle') || 'Incoming Job Requests'}
          </h3>
          <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-md">
            {incomingJobs.length} Requests
          </span>
        </div>

        <div className="space-y-2">
          {incomingJobs.map((job) => (
            <div
              key={job.id}
              className="p-3 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-on-surface truncate">{job.trade}</h4>
                    {/* Audio readout button for illiterate workers */}
                    <button
                      type="button"
                      onClick={() => playJobAudio(job)}
                      className={`p-1 rounded-full text-primary hover:bg-primary/20 ${
                        audioPlaying ? 'bg-primary text-white animate-bounce' : 'bg-primary/10'
                      }`}
                      title="Speak job details (बोलकर सुनें)"
                    >
                      <span className="material-symbols-outlined text-[15px]">volume_up</span>
                    </button>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                    {job.customerName} • {job.address}
                  </p>
                </div>
                <span className="font-black text-base text-primary shrink-0">₹{job.quote}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-surface-variant/20">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">near_me</span>
                  <span>{job.distance}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-secondary">schedule</span>
                  <span>ETA: <strong>{job.eta}</strong></span>
                </span>
              </div>

              {job.status === 'accepted' ? (
                <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg font-bold text-xs text-center">
                  Job Accepted! Head over to site.
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => acceptIncomingJob(job.id)}
                    className="flex-1 h-9 rounded-xl bg-primary text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">check</span>
                    <span>Accept Job</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => declineIncomingJob(job.id)}
                    className="px-3 h-9 rounded-xl bg-surface-container text-on-surface font-bold text-xs active:scale-95 transition-all"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Verified Member Credentials */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
            <span>Verified Member Credentials</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {currentWorker.skillAssessment && (
            <button
              type="button"
              onClick={() => setSkillAssessmentModalWorker(currentWorker)}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-300 flex flex-col text-left transition-colors active:scale-95"
            >
              <span className="text-[10px] text-amber-800 font-bold uppercase">Practical Skill Video</span>
              <span className="font-black text-amber-950 mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-amber-700">smart_display</span>
                <span>{currentWorker.skillAssessment.grade} (View)</span>
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setEShramWorkerModal(currentWorker)}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 flex flex-col text-left transition-colors active:scale-95"
          >
            <span className="text-[10px] text-emerald-800 font-bold uppercase">e-Shram Universal ID</span>
            <span className="font-black text-emerald-950 mt-0.5 truncate">
              {currentWorker.eShramId || 'SLN-4412'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDigiLockerWorkerModal(currentWorker)}
            className="p-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-300 flex flex-col text-left transition-colors active:scale-95"
          >
            <span className="text-[10px] text-blue-800 font-bold uppercase">DigiLocker Certificate</span>
            <span className="font-black text-blue-950 mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-blue-700">verified</span>
              <span>Trade Certified</span>
            </span>
          </button>

          <div className="p-2.5 bg-surface-container-low rounded-xl border border-surface-variant/30 flex flex-col">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">Cooperative Share</span>
            <span className="font-black text-primary mt-0.5">1 Equal Voting Share</span>
          </div>
        </div>

        {/* Guild Tool Subsidy Button */}
        <div className="pt-1">
          {subsidyRequested ? (
            <div className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold text-center">
              Requisition for Safety Kit & Digital Multimeter submitted to Chapter Admin.
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSubsidyRequested(true)}
              className="w-full py-2 bg-surface-container-low hover:bg-surface-container border border-surface-variant/40 text-on-surface rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">construction</span>
              <span>Claim Guild Safety Equipment Subsidy (From Mutual Fund)</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
