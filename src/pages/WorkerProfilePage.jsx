import React from 'react';
import { useApp } from '../context/AppContext';

export const WorkerProfilePage = () => {
  const {
    currentWorker,
    navigateTo,
    setEShramWorkerModal,
    setDigiLockerWorkerModal,
    setSkillAssessmentModalWorker,
    t,
  } = useApp();

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-4 pb-32 animate-fade-in">
      {/* Worker Profile Hero Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40 space-y-space-md">
        <div className="flex items-start gap-space-md">
          <div className="relative shrink-0">
            <img
              alt={currentWorker.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-surface-container border border-surface-variant/40"
              src={currentWorker.detailAvatar || currentWorker.avatar}
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5 shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] material-symbols-fill text-white">
                verified
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-space-xs flex-wrap">
              <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-extrabold">
                {currentWorker.name}
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
              {currentWorker.trade} • {currentWorker.chapter}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-flex items-center text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ★ {currentWorker.rating} ({currentWorker.reviewCount} reviews)
              </span>
              <span className="text-xs text-on-surface-variant">•</span>
              <span className="text-xs font-bold text-secondary">{currentWorker.onTimeRate} On-Time</span>
            </div>
          </div>
        </div>

        {/* Clickable Trust Verification Badges (DPI & Practical Skill Assessment) */}
        <div className="flex flex-wrap gap-1.5 pt-space-xs">
          {/* Practical Skill Assessment (2-min demo video + workshop photo proof) */}
          {currentWorker.skillAssessment && (
            <button
              type="button"
              onClick={() => setSkillAssessmentModalWorker(currentWorker)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300 text-xs font-black transition-all active:scale-95 shadow-xs max-w-full truncate"
              title="Click to view 2-minute live work demo video and workshop proof"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-700 material-symbols-fill shrink-0">
                smart_display
              </span>
              <span className="truncate">2-Min Demo & Shop Proof (View)</span>
            </button>
          )}

          <button
            onClick={() => setEShramWorkerModal(currentWorker)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition-all active:scale-95"
            title="Click to preview official Ministry of Labour e-Shram Universal ID Card"
          >
            <span className="material-symbols-outlined text-[14px]">badge</span>
            <span>{currentWorker.eShramId}</span>
          </button>

          <button
            onClick={() => setDigiLockerWorkerModal(currentWorker)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300 text-xs font-bold transition-all active:scale-95"
            title="Click to preview official DigiLocker certified trade certificate"
          >
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>DigiLocker Verified</span>
          </button>
        </div>

        {/* Key Performance Grid */}
        <div className="grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-lg p-space-sm text-center border border-surface-variant/20">
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              {currentWorker.experienceYears}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{t('experience')}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              {currentWorker.jobsCompleted}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{t('jobsDone')}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
              {currentWorker.responseTime}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">{t('response')}</span>
          </div>
        </div>
      </div>

      {/* Cooperative Ownership Banner */}
      <div className="bg-surface-container-low rounded-xl p-space-md relative overflow-hidden shadow-xs border border-surface-variant/40">
        <div className="flex items-start gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-white">diversity_3</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-extrabold">
                {t('memberOwner')} #{currentWorker.memberId}
              </span>
            </div>
            <p className="font-title-md text-title-md text-on-surface font-bold mt-0.5">
              {currentWorker.chapter}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
              {currentWorker.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Live Status & Coverage Area */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40 space-y-space-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-title-md text-on-surface font-bold">Service Availability</h3>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Available Today
          </span>
        </div>
        <div className="flex items-center gap-space-xs text-on-surface-variant font-body-md text-body-md">
          <span className="material-symbols-outlined text-[20px] text-primary shrink-0">schedule</span>
          <span>
            Next open arrival slot: <strong className="text-on-surface font-bold">{currentWorker.nextSlot}</strong>
          </span>
        </div>
        <div className="flex items-start gap-space-xs text-on-surface-variant font-body-sm text-body-sm pt-space-xxs">
          <span className="material-symbols-outlined text-[20px] text-outline shrink-0 mt-0.5">location_on</span>
          <div>
            <span className="font-label-md text-label-md text-on-surface font-bold block">
              Active Proximity
            </span>
            <span>{currentWorker.coverageArea}</span>
          </div>
        </div>
      </div>

      {/* Skills & Specializations Checklist */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40 space-y-space-sm">
        <h3 className="font-title-md text-title-md text-on-surface font-bold">{t('skillsAndCert')}</h3>
        <div className="flex flex-wrap gap-space-xs">
          {currentWorker.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm flex items-center gap-1.5 border border-surface-variant/30"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Transparent Price Guide */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40 space-y-space-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-title-md text-on-surface font-bold">{t('priceGuideTitle')}</h3>
          <span className="material-symbols-outlined text-[20px] text-primary">price_check</span>
        </div>
        <div className="divide-y divide-surface-variant/40">
          {currentWorker.priceGuide.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
              <div>
                <p className="font-title-md text-[14px] font-bold text-on-surface">{item.item}</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">{item.note}</p>
              </div>
              <span className="font-title-md text-primary font-black shrink-0">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40 space-y-space-sm">
        <h3 className="font-title-md text-title-md text-on-surface font-bold">
          {t('reviewsTitle')} ({currentWorker.reviews.length})
        </h3>
        <div className="divide-y divide-surface-variant/30">
          {currentWorker.reviews.map((rev, i) => (
            <div key={i} className="py-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-on-surface font-bold">{rev.user}</span>
                <span className="font-label-sm text-on-surface-variant">{rev.date}</span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(rev.rating)].map((_, r) => (
                  <span key={r} className="material-symbols-outlined text-[14px] material-symbols-fill">
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Booking Action Dock */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-variant/40 px-3 py-2.5 sm:px-4 sm:py-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <div className="min-w-0 shrink-0">
            <span className="text-[10px] sm:text-xs text-on-surface-variant block font-semibold truncate leading-tight">
              Standard Labour
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl text-primary font-black">
                ₹{currentWorker.standardJobQuote}
              </span>
              <span className="text-[10px] sm:text-[11px] text-secondary font-bold whitespace-nowrap">
                0% Cut
              </span>
            </div>
          </div>
          <button
            onClick={() => navigateTo('booking')}
            type="button"
            className="flex-1 min-w-0 h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2 shadow-md active:scale-95 transition-all"
          >
            <span className="truncate">{t('negotiateAndBookBtn')}</span>
            <span className="material-symbols-outlined text-[18px] sm:text-[20px] shrink-0">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
