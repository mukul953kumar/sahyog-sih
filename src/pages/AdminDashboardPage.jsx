import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage = () => {
  const {
    t,
    cooperativeInfo,
    kycQueue,
    approveWorkerKyc,
    rejectWorkerKyc,
    resolutionsList,
    publishResolution,
    switchRole,
    bookings,
    adminResolveDispute,
    raiseDispute,
    adminApproveOtpRefusal,
    submitOtpRefusalClaim,
    setWardAuditModalBooking,
    setAuditReportModalOpen,
    setSkillAssessmentModalWorker,
  } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [publishedAlert, setPublishedAlert] = useState(false);
  const [resolutionFeedback, setResolutionFeedback] = useState('');

  const disputedBookings = (bookings || []).filter((b) => b.status === 'disputed');
  const otpRefusedBookings = (bookings || []).filter((b) => b.status === 'otp_refused');

  const handleResolve = (bookingId, type) => {
    adminResolveDispute(bookingId, type);
    setResolutionFeedback(
      type === 'refund_customer'
        ? `Escrow refunded 100% to Customer (Zero Fees Deducted)!`
        : `Escrow released directly to Worker's bank account!`
    );
    setTimeout(() => setResolutionFeedback(''), 4000);
  };

  const handleApproveOtpClaim = (bookingId) => {
    adminApproveOtpRefusal(bookingId);
    setResolutionFeedback(`✓ Proof Verified! 100% Escrow released directly to Worker's Canara Bank account (₹0 commission).`);
    setTimeout(() => setResolutionFeedback(''), 4000);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    publishResolution({
      id: `res-${Date.now()}`,
      title: newTitle.trim(),
      chapter: 'Sultanpur Chapter',
      description: newDesc.trim() || 'Cooperative chapter welfare allocation vote.',
      votesFor: 1,
      votesAgainst: 0,
      status: 'Active',
      deadline: '30 Sep 2026',
    });

    setNewTitle('');
    setNewDesc('');
    setShowResolutionForm(false);
    setPublishedAlert(true);
    setTimeout(() => setPublishedAlert(false), 4000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 pb-28 md:pb-16 animate-fade-in">
      {/* 1. Chapter Title & Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-2xs border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-black">
            <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
            <span>Cooperative Societies Act Administrator Console</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => switchRole('customer')}
              className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
            >
              Customer View
            </button>
            <button
              type="button"
              onClick={() => switchRole('worker')}
              className="px-3 py-1.5 text-xs font-bold text-secondary bg-secondary-container/50 hover:bg-secondary-container rounded-xl transition-colors"
            >
              Worker View
            </button>
          </div>
        </div>

        <div>
          <h1 className="font-black text-xl sm:text-2xl text-on-surface">
            {t('adminDashboardTitle') || 'Cooperative Executive & Regulatory Console'}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-0.5">
            {cooperativeInfo.fullName} • Reg #{cooperativeInfo.regNumber}
          </p>
        </div>
      </div>

      {/* 2. Core Stats Grid (4 across on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Active Co-Owners
          </span>
          <span className="text-2xl font-black text-on-surface mt-1">
            {cooperativeInfo.metrics.activeCoOwners}
          </span>
          <span className="text-xs text-secondary font-bold mt-0.5">Verified Trades</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Escrow in Trust
          </span>
          <span className="text-2xl font-black text-primary mt-1">₹1,48,500</span>
          <span className="text-xs text-primary font-bold mt-0.5">RBI Escrow Vault</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Platform Cut
          </span>
          <span className="text-2xl font-black text-secondary mt-1">0.0%</span>
          <span className="text-xs text-secondary font-bold mt-0.5">Bylaw Enforced</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Disputes & Claims
          </span>
          <span className="text-2xl font-black text-on-surface mt-1">
            {disputedBookings.length + otpRefusedBookings.length}
          </span>
          <span className="text-xs text-amber-700 font-bold mt-0.5">
            {otpRefusedBookings.length > 0 ? `${otpRefusedBookings.length} OTP Claims Active` : disputedBookings.length > 0 ? 'Requires Action' : 'Zero Active'}
          </span>
        </div>
      </div>

      {/* 2.5 WORKER PROTECTION: OTP REFUSAL & PROOF-BASED CLAIMS DESK */}
      <section className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-amber-400/80 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[18px]">shield_with_heart</span>
            </span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Worker Escrow Protection: OTP Refusal Claims
              </h3>
              <p className="text-xs text-slate-500">
                Review GPS duration, photo evidence, and 1-click release escrow when customers withhold PIN
              </p>
            </div>
          </div>
          <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl ${
            otpRefusedBookings.length > 0
              ? 'bg-amber-400 text-slate-950 animate-bounce'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {otpRefusedBookings.length} Active Claim{otpRefusedBookings.length === 1 ? '' : 's'}
          </span>
        </div>

        {otpRefusedBookings.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-emerald-600">verified</span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  All Active Orders Verified with PIN
                </h4>
                <p className="text-xs text-slate-500">
                  No pending OTP refusal claims from technicians right now.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const targetBooking = bookings[0]?.id || 'SHG-8821';
                submitOtpRefusalClaim(targetBooking, {
                  reason: 'Customer demanding extra unpaid work',
                  notes: 'Completed full switchboard wiring. Customer refused to share 4-digit PIN.',
                  photos: [
                    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
                  ],
                  gpsStayMinutes: 48,
                  audioProof: true,
                });
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span>Simulate Customer Refusing OTP (Jury Demo)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {otpRefusedBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-sm flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                        Claim #{b.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {b.serviceTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Technician: <strong>{b.workerName}</strong> • Customer: <strong>{b.customerName || 'Priya Sharma'}</strong> ({b.address})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-primary font-mono block">
                      ₹{b.labourAmount || b.totalEscrow}
                    </span>
                    <span className="text-[10px] text-amber-900 bg-amber-200/80 font-bold px-2 py-0.5 rounded-md">
                      2h Auto-Release Active
                    </span>
                  </div>
                </div>

                {/* Evidence Strip: Reason, GPS stayed, Photos */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="font-bold text-amber-950">
                      Reason: <span className="font-normal text-amber-900">{b.otpRefusalDetails?.reason || 'Customer refused PIN'}</span>
                    </span>
                    <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">location_on</span>
                      <span>GPS Stay: {b.otpRefusalDetails?.gpsStayMinutes || 48} mins (&lt;15m distance ✓)</span>
                    </span>
                  </div>

                  {b.otpRefusalDetails?.notes && (
                    <p className="text-[11px] text-slate-700 italic bg-white p-2 rounded-lg border border-amber-200/70">
                      "{b.otpRefusalDetails.notes}"
                    </p>
                  )}

                  {/* Photo Thumbnails */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 shrink-0">Attached Evidence:</span>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {(b.otpRefusalDetails?.photos || [
                        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
                      ]).map((imgUrl, i) => (
                        <a
                          key={i}
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 shrink-0 hover:opacity-80 transition-opacity"
                          title="Click to view full photo proof"
                        >
                          <img src={imgUrl} alt={`Proof ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-1 rounded-md">
                        10s Audio Memo ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApproveOtpClaim(b.id)}
                    className="w-full sm:flex-1 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Approve & Release 100% Escrow to Worker (₹0 Cut)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResolutionFeedback(`Nearby Guild Peer representative dispatched to site for mediation.`);
                      setTimeout(() => setResolutionFeedback(''), 4000);
                    }}
                    className="w-full sm:w-auto px-4 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[15px] text-amber-700">group</span>
                    <span>Dispatch Peer Mediator</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Responsive 2-Column Grid on Desktop: Left (Disputes) + Right (KYC Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 3. LIVE DISPUTE RESOLUTION CENTER */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-2xs border border-surface-variant/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-[20px] material-symbols-fill">gavel</span>
              <h3 className="font-bold text-base text-on-surface">
                Escrow Disputes & Consumer Refunds
              </h3>
            </div>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
              disputedBookings.length > 0
                ? 'bg-error-container text-on-error-container animate-pulse'
                : 'bg-secondary-container text-on-secondary-container'
            }`}>
              {disputedBookings.length} Active
            </span>
          </div>

          {resolutionFeedback && (
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[17px]">verified</span>
              <span>{resolutionFeedback}</span>
            </div>
          )}

          {disputedBookings.length === 0 ? (
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-3xl text-secondary">verified_user</span>
              <p className="text-sm font-bold text-on-surface">
                Zero Active Disputes: Escrow vault is operating smoothly.
              </p>
              <button
                type="button"
                onClick={() => {
                  const targetBooking = bookings[0]?.id || 'SHG-8821';
                  raiseDispute(targetBooking, 'Technician was 45 mins late and left work incomplete');
                }}
                className="mt-1 px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                <span>Simulate Escrow Dispute (Jury Demo)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {disputedBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-error-container/20 border border-error/30 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-error block">
                        Booking #{b.id} • Escrow: ₹{b.totalEscrow}
                      </span>
                      <h4 className="font-bold text-sm text-on-surface mt-0.5">
                        {b.serviceTitle}
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        Customer: <strong>Priya Sharma</strong> • Tech: <strong>{b.workerName}</strong>
                      </p>
                    </div>
                    <span className="text-[10px] font-black bg-error text-white px-2 py-0.5 rounded-md">
                      Frozen
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-error/20 text-xs">
                    <span className="text-on-surface-variant font-semibold block text-[11px]">Complaint:</span>
                    <p className="text-on-surface font-medium mt-0.5">{b.disputeReason}</p>
                    {b.wardAuditActive && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-red-900 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-red-600">videocam</span>
                          <span>Ward 112 Video Audit Assigned ({b.wardCoordinator?.name || 'Rajendra Shukla'})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setWardAuditModalBooking(b)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-[10px] font-bold"
                        >
                          Join/Inspect Call
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleResolve(b.id, 'refund_customer')}
                      className="flex-1 h-10 rounded-xl bg-error hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                      <span>100% Refund Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolve(b.id, 'pay_worker')}
                      className="px-4 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <span>Release to Tech</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Worker KYC Queue */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-2xs border border-surface-variant/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              <h3 className="font-bold text-base text-on-surface">
                {t('kycQueueTitle') || 'Worker-Owner Onboarding Queue'}
              </h3>
            </div>
            <span className="text-xs font-black bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
              {kycQueue.filter((k) => k.status === 'pending').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {kycQueue.map((applicant) => (
              <div
                key={applicant.id}
                className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-on-surface">
                      {applicant.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      {applicant.trade} • {applicant.experience} Experience
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      applicant.status === 'approved'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : applicant.status === 'rejected'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {applicant.status === 'approved'
                      ? 'Approved Member'
                      : applicant.status === 'rejected'
                      ? 'Rejected'
                      : 'Pending Review'}
                  </span>
                </div>

                {/* Practical video preview trigger */}
                {applicant.skillAssessment ? (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-amber-700">smart_display</span>
                        <span>2-Min Demo Video Verified</span>
                      </span>
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 font-extrabold px-2 py-0.5 rounded-md">
                        Score: {applicant.skillAssessment.practicalScore}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSkillAssessmentModalWorker(applicant)}
                      className="w-full py-2 rounded-xl bg-amber-200/70 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_circle</span>
                      <span>Inspect Practical Video & Workshop Proof</span>
                    </button>
                  </div>
                ) : null}

                {applicant.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => approveWorkerKyc(applicant.id)}
                      className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                      <span>Approve Co-Owner Share</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectWorkerKyc(applicant.id)}
                      className="px-4 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs active:scale-95 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 5. Cooperative Welfare & Democratic Resolutions */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-2xs border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
            <h3 className="font-bold text-base text-on-surface">Community Welfare & Democratic Resolutions</h3>
          </div>
          <button
            type="button"
            onClick={() => setAuditReportModalOpen(true)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>View Payout Audits</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-surface-variant/30 text-xs">
          <span className="text-on-surface-variant">Active Community Resolutions Open for Voting:</span>
          <strong className="text-on-surface font-bold text-sm">
            {resolutionsList?.length || 0} Open Ballots
          </strong>
        </div>

        {publishedAlert && (
          <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>Ballot published to Community Hub!</span>
          </div>
        )}

        {showResolutionForm ? (
          <form onSubmit={handlePublish} className="p-4 bg-surface-container-low rounded-2xl border border-surface-variant/40 flex flex-col gap-2.5">
            <label className="text-xs font-bold text-on-surface">Ballot Motion Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 5% Surplus Allocation for Worker Tool Subsidy"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-10 px-3 rounded-xl bg-white text-on-surface text-xs border border-surface-variant focus:outline-none focus:border-primary"
            />
            <textarea
              rows={2}
              placeholder="Brief explanation for members..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="p-2.5 rounded-xl bg-white text-on-surface text-xs border border-surface-variant focus:outline-none focus:border-primary"
            ></textarea>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 h-9 rounded-xl bg-primary text-white text-xs font-bold shadow-xs"
              >
                Publish Motion
              </button>
              <button
                type="button"
                onClick={() => setShowResolutionForm(false)}
                className="px-4 h-9 rounded-xl bg-surface-container text-on-surface text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowResolutionForm(true)}
            className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create New Democratic Motion</span>
          </button>
        )}
      </section>
    </div>
  );
};
