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
    setAuditReportModalOpen,
    setSkillAssessmentModalWorker,
  } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [publishedAlert, setPublishedAlert] = useState(false);
  const [resolutionFeedback, setResolutionFeedback] = useState('');

  const disputedBookings = (bookings || []).filter((b) => b.status === 'disputed');

  const handleResolve = (bookingId, type) => {
    adminResolveDispute(bookingId, type);
    setResolutionFeedback(
      type === 'refund_customer'
        ? `Escrow refunded 100% to Customer (Zero Fees Deducted)!`
        : `Escrow released directly to Worker's bank account!`
    );
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
    <div className="w-full max-w-2xl mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-3.5 pb-28 animate-fade-in">
      {/* 1. Chapter Title & Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-black">
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            <span>Cooperative Societies Act Administrator</span>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => switchRole('customer')}
              className="px-2.5 py-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
            >
              Customer View
            </button>
            <button
              type="button"
              onClick={() => switchRole('worker')}
              className="px-2.5 py-1 text-xs font-bold text-secondary bg-secondary-container/50 hover:bg-secondary-container rounded-lg transition-colors"
            >
              Worker View
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-base sm:text-lg text-on-surface">
            {t('adminDashboardTitle') || 'Cooperative Executive Console'}
          </h2>
          <p className="text-xs text-on-surface-variant font-medium">
            {cooperativeInfo.fullName} • Reg #{cooperativeInfo.regNumber}
          </p>
        </div>
      </div>

      {/* 2. Core Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            Active Co-Owners
          </span>
          <span className="text-lg font-black text-on-surface mt-0.5">
            {cooperativeInfo.metrics.activeCoOwners}
          </span>
          <span className="text-[10px] text-secondary font-bold">Verified Trades</span>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            Escrow in Trust
          </span>
          <span className="text-lg font-black text-primary mt-0.5">₹1,48,500</span>
          <span className="text-[10px] text-primary font-bold">RBI Escrow Vault</span>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            Platform Cut
          </span>
          <span className="text-lg font-black text-secondary mt-0.5">0.0%</span>
          <span className="text-[10px] text-secondary font-bold">Bylaw Enforced</span>
        </div>

        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            Disputes
          </span>
          <span className="text-lg font-black text-on-surface mt-0.5">
            {disputedBookings.length}
          </span>
          <span className="text-[10px] text-secondary font-bold">
            {disputedBookings.length > 0 ? 'Requires Action' : 'Zero Active'}
          </span>
        </div>
      </div>

      {/* 3. LIVE DISPUTE RESOLUTION CENTER */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-error">
            <span className="material-symbols-outlined text-[18px] material-symbols-fill">gavel</span>
            <h3 className="font-bold text-sm text-on-surface">
              Escrow Disputes & Consumer Refunds
            </h3>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            disputedBookings.length > 0
              ? 'bg-error-container text-on-error-container animate-pulse'
              : 'bg-secondary-container text-on-secondary-container'
          }`}>
            {disputedBookings.length} Active
          </span>
        </div>

        {resolutionFeedback && (
          <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{resolutionFeedback}</span>
          </div>
        )}

        {disputedBookings.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col items-center text-center gap-1.5">
            <span className="material-symbols-outlined text-2xl text-secondary">verified_user</span>
            <p className="text-xs font-bold text-on-surface">
              Zero Active Disputes: Escrow vault is in 100% good standing.
            </p>
            <button
              type="button"
              onClick={() => {
                const targetBooking = bookings[0]?.id || 'SHG-8821';
                raiseDispute(targetBooking, 'Technician was 45 mins late and left work incomplete');
              }}
              className="mt-1 px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">play_arrow</span>
              <span>Simulate Escrow Dispute (Jury Demo)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {disputedBookings.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-error-container/20 border border-error/30 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-error block">
                      Booking #{b.id} • Escrow: ₹{b.totalEscrow}
                    </span>
                    <h4 className="font-bold text-xs text-on-surface mt-0.5">
                      {b.serviceTitle}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      Customer: <strong>Priya Sharma</strong> • Tech: <strong>{b.workerName}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-black bg-error text-white px-2 py-0.5 rounded-md">
                    Frozen
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-error/20 text-xs">
                  <span className="text-on-surface-variant font-semibold block text-[11px]">Reason:</span>
                  <p className="text-on-surface font-medium mt-0.5">{b.disputeReason}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleResolve(b.id, 'refund_customer')}
                    className="flex-1 h-9 rounded-xl bg-error text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">currency_exchange</span>
                    <span>100% Refund Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(b.id, 'pay_worker')}
                    className="px-3 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
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
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            <h3 className="font-bold text-sm text-on-surface">
              {t('kycQueueTitle') || 'Worker-Owner Onboarding Queue'}
            </h3>
          </div>
          <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md">
            {kycQueue.filter((k) => k.status === 'pending').length} Pending
          </span>
        </div>

        <div className="space-y-2.5">
          {kycQueue.map((applicant) => (
            <div
              key={applicant.id}
              className="p-3 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-on-surface">
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
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-amber-700">smart_display</span>
                      <span>2-Min Demo Video Verified</span>
                    </span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 font-extrabold px-1.5 py-0.2 rounded">
                      Score: {applicant.skillAssessment.practicalScore}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSkillAssessmentModalWorker(applicant)}
                    className="w-full py-1.5 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">play_circle</span>
                    <span>Inspect Practical Video & Workshop Proof</span>
                  </button>
                </div>
              ) : null}

              {applicant.status === 'pending' && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => approveWorkerKyc(applicant.id)}
                    className="flex-1 h-9 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                    <span>Approve Co-Owner Share</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectWorkerKyc(applicant.id)}
                    className="px-3 h-9 rounded-xl bg-surface-container text-on-surface font-bold text-xs active:scale-95 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Escrow Audit & Resolutions */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs border border-surface-variant/40 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <h3 className="font-bold text-sm text-on-surface">Audit Ledger & Resolutions</h3>
          </div>
          <button
            type="button"
            onClick={() => setAuditReportModalOpen(true)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            <span>Public Ledger</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl border border-surface-variant/30 text-xs">
          <span className="text-on-surface-variant">Active Community Resolutions:</span>
          <strong className="text-on-surface font-bold">
            {resolutionsList?.length || 0} Open Ballots
          </strong>
        </div>

        {publishedAlert && (
          <div className="p-2 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px]">check</span>
            <span>Ballot published to Community ledger!</span>
          </div>
        )}

        {showResolutionForm ? (
          <form onSubmit={handlePublish} className="p-3 bg-surface-container-low rounded-xl border border-surface-variant/40 flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface">Ballot Motion Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 5% Surplus Allocation for Worker Tool Subsidy"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-9 px-3 rounded-lg bg-white text-on-surface text-xs border border-surface-variant focus:outline-none focus:border-primary"
            />
            <textarea
              rows={2}
              placeholder="Brief explanation for members..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="p-2 rounded-lg bg-white text-on-surface text-xs border border-surface-variant focus:outline-none focus:border-primary"
            ></textarea>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 h-8 rounded-lg bg-primary text-white text-xs font-bold shadow-xs"
              >
                Publish Motion
              </button>
              <button
                type="button"
                onClick={() => setShowResolutionForm(false)}
                className="px-3 h-8 rounded-lg bg-surface-container text-on-surface text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowResolutionForm(true)}
            className="w-full py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Create New Democratic Motion</span>
          </button>
        )}
      </section>
    </div>
  );
};
