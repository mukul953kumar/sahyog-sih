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
    <div className="w-full max-w-2xl mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-space-md pb-28">
      {/* Top Banner: Worker Header & Duty Toggle */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                alt={currentWorker.name}
                src={currentWorker.detailAvatar || currentWorker.avatar}
                className="w-14 h-14 rounded-lg object-cover border border-surface-variant"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-headline-sm text-headline-sm font-black text-on-surface">
                  {currentWorker.name}
                </h2>
                <span className="bg-primary-fixed text-on-primary-fixed text-xs font-bold px-2 py-0.5 rounded">
                  Co-Owner #{currentWorker.memberId}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant font-medium">
                {currentWorker.trade} • {currentWorker.chapter}
              </p>
            </div>
          </div>

          <button
            onClick={() => switchRole('customer')}
            className="px-2.5 py-1 text-xs font-bold text-primary bg-primary-fixed/30 rounded-lg hover:bg-primary-fixed/50"
          >
            Switch to Customer
          </button>
        </div>

        {/* Duty Status Switcher */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-variant/30 mt-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                workerOnDuty ? 'bg-secondary animate-pulse' : 'bg-outline'
              }`}
            ></span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {workerOnDuty ? t('dutyStatusOn') : t('dutyStatusOff')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWorkerOnDuty(!workerOnDuty)}
            className={`px-3 py-1.5 rounded-lg font-label-sm font-bold text-xs transition-all ${
              workerOnDuty
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary text-white'
            }`}
          >
            {workerOnDuty ? 'Go Off-Duty' : 'Go On-Duty'}
          </button>
        </div>
      </div>

      {/* Claim Escrow PIN Box */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border-2 border-primary/30 flex flex-col gap-space-xs">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[22px] material-symbols-fill">
            lock_open
          </span>
          <h3 className="font-title-md text-title-md font-extrabold text-on-surface">
            {t('claimEscrowTitle')}
          </h3>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          {t('claimEscrowDesc')}
        </p>

        <form onSubmit={handlePinSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              maxLength={4}
              placeholder="7429"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-28 sm:w-36 h-12 text-center text-xl sm:text-2xl font-black tracking-widest rounded-xl bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary tabular-nums shrink-0"
            />
            <button
              type="submit"
              className="flex-1 min-w-0 h-12 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all text-xs sm:text-sm px-2"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px] shrink-0">check_circle</span>
              <span className="truncate">{t('claimPayoutBtn')}</span>
            </button>
          </div>
        </form>

        {claimResult && (
          <div
            className={`p-3 rounded-lg text-body-sm font-semibold flex items-start gap-2 mt-1 animate-fade-in ${
              claimResult.success
                ? 'bg-secondary-container text-on-secondary-container border border-secondary/30'
                : 'bg-error-container text-on-error-container border border-error/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {claimResult.success ? 'check' : 'error'}
            </span>
            <span>{claimResult.message}</span>
          </div>
        )}

        {activeWorkerBookings.length > 0 && (
          <div className="bg-surface-container-low p-2 rounded-lg text-xs text-on-surface-variant mt-1">
            <strong>Active Customer PIN for SIH Demo:</strong>{' '}
            <code className="bg-white px-1.5 py-0.5 rounded font-bold text-primary">
              {activeWorkerBookings[0].releaseOtp}
            </code>{' '}
            (Job #{activeWorkerBookings[0].id} - {activeWorkerBookings[0].serviceTitle})
          </div>
        )}
      </section>

      {/* Direct Earnings & Cooperative Dividend Grid */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            {t('todaysEarnings')}
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-primary">
            ₹{workerEarnings.today}
          </span>
          <span className="text-[11px] text-secondary font-bold">
            {workerEarnings.jobsToday} jobs completed today
          </span>
        </div>

        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            {t('weeksEarnings')}
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-on-surface">
            ₹{workerEarnings.week}
          </span>
          <span className="text-[11px] text-on-surface-variant">100% direct bank transfer</span>
        </div>

        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            {t('welfareShare')}
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-secondary">
            ₹{workerEarnings.dividend}
          </span>
          <span className="text-[11px] text-secondary font-bold">Q3 Co-op Member Dividend</span>
        </div>

        <div className="bg-secondary-container/40 p-space-sm rounded-xl border border-secondary/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-secondary-container font-bold">
            {t('platformCommissionCut')}
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-secondary">₹0</span>
          <span className="text-[11px] text-secondary font-extrabold">100% direct to your family</span>
        </div>
      </section>

      {/* Active & Incoming Job Requests with Audio Voice Prompts */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-title-md font-bold text-on-surface">
            {t('activeJobsTitle')}
          </h3>
          <span className="text-xs bg-primary-fixed text-on-primary-fixed font-bold px-2 py-0.5 rounded">
            {incomingJobs.length} Requests
          </span>
        </div>

        <div className="space-y-3">
          {incomingJobs.map((job) => (
            <div
              key={job.id}
              className="p-space-sm rounded-lg bg-surface-container-low border border-surface-variant/30 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-title-md text-[15px] font-bold text-on-surface">{job.trade}</h4>
                    {/* Audio Readout button for illiterate workers */}
                    <button
                      onClick={() => playJobAudio(job)}
                      className={`p-1 rounded-full ${
                        audioPlaying ? 'bg-primary text-white animate-bounce' : 'bg-primary-fixed text-primary'
                      }`}
                      title={t('audioReadout')}
                    >
                      <span className="material-symbols-outlined text-[16px]">volume_up</span>
                    </button>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    {job.customerName} • {job.address}
                  </p>
                </div>
                <span className="font-title-md font-black text-primary">₹{job.quote}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-surface-variant/20">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">near_me</span>
                  Distance: <strong>{job.distance}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                  Customer ETA: <strong>{job.eta}</strong>
                </span>
              </div>

              {job.status === 'accepted' ? (
                <div className="p-2 bg-secondary-container text-on-secondary-container rounded font-bold text-xs text-center">
                  Job Accepted! Head over to site.
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => acceptIncomingJob(job.id)}
                    className="flex-1 h-10 rounded-lg bg-primary text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>{t('acceptJob')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => declineIncomingJob(job.id)}
                    className="px-3.5 h-10 rounded-lg bg-surface-container-high text-on-surface font-bold text-xs active:scale-95 transition-all"
                  >
                    {t('declineJob')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DigiLocker & Identity Verification Card */}
      <section className="bg-surface-container-low rounded-xl p-space-md border border-surface-variant/40 flex flex-col gap-space-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Cooperative Member Credentials
            </h3>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {currentWorker.skillAssessment && (
              <>
                <button
                  type="button"
                  onClick={() => setSkillAssessmentModalWorker(currentWorker)}
                  className="text-[11px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 hover:bg-amber-100 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px] text-amber-700">smart_display</span>
                  <span>Demo Video & Shop Proof</span>
                </button>
                <span className="text-slate-300">•</span>
              </>
            )}
            <button
              onClick={() => setEShramWorkerModal(currentWorker)}
              className="text-[11px] font-bold text-primary underline"
            >
              View e-Shram
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setDigiLockerWorkerModal(currentWorker)}
              className="text-[11px] font-bold text-blue-700 underline"
            >
              View DigiLocker
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2 bg-white rounded border border-surface-variant/30 flex flex-col">
            <span className="text-on-surface-variant font-semibold">Practical Skill Assessment</span>
            <strong className="text-amber-800 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-600">verified</span>
              {currentWorker.skillAssessment ? currentWorker.skillAssessment.grade : 'Grade A+ (Certified)'}
            </strong>
          </div>
          <div className="p-2 bg-white rounded border border-surface-variant/30 flex flex-col">
            <span className="text-on-surface-variant font-semibold">2-Min Video & Workshop</span>
            <strong className="text-secondary font-bold">Field Verified & Approved</strong>
          </div>
          <div className="p-2 bg-white rounded border border-surface-variant/30 flex flex-col">
            <span className="text-on-surface-variant font-semibold">e-Shram Universal ID</span>
            <strong className="text-on-surface">{currentWorker.eShramId}</strong>
          </div>
          <div className="p-2 bg-white rounded border border-surface-variant/30 flex flex-col">
            <span className="text-on-surface-variant font-semibold">Cooperative Shareholding</span>
            <strong className="text-primary font-bold">1 Equal Voting Share</strong>
          </div>
        </div>

        {/* Guild Tool Subsidy Button */}
        <div className="pt-2">
          {subsidyRequested ? (
            <div className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-xs font-bold text-center">
              Requisition for Safety Kit & Digital Multimeter submitted to Chapter Admin.
            </div>
          ) : (
            <button
              onClick={() => setSubsidyRequested(true)}
              className="w-full py-2 bg-white border border-primary/30 text-primary hover:bg-primary/5 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">construction</span>
              <span>Claim Guild Safety Equipment Subsidy (From Mutual Fund)</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
