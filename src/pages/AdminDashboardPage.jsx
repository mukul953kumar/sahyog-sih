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

  const disputedBookings = bookings.filter((b) => b.status === 'disputed');

  const handleResolve = (bookingId, type) => {
    adminResolveDispute(bookingId, type);
    setResolutionFeedback(
      type === 'refund_customer'
        ? `Escrow refunded 100% to Customer! Zero platform charges deducted.`
        : `Escrow released to Worker! Transferred directly to bank account.`
    );
    setTimeout(() => setResolutionFeedback(''), 4000);
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    publishResolution({
      id: `res-${Date.now()}`,
      title: newTitle.trim(),
      chapter: 'Bengaluru Chapter',
      description: newDesc.trim() || 'Cooperative chapter welfare and tools allocation vote.',
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
    <div className="w-full max-w-2xl mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-space-md pb-28">
      {/* Chapter Title & Header */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
            <span>Cooperative Societies Act Regulator</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => switchRole('customer')}
              className="px-2.5 py-1 text-xs font-bold text-primary bg-primary-fixed/30 rounded-lg hover:bg-primary-fixed/50"
            >
              Customer View
            </button>
            <button
              onClick={() => switchRole('worker')}
              className="px-2.5 py-1 text-xs font-bold text-secondary bg-secondary-container/50 rounded-lg hover:bg-secondary-container"
            >
              Worker View
            </button>
          </div>
        </div>

        <h2 className="font-headline-sm text-headline-sm font-black text-on-surface mt-1">
          {t('adminDashboardTitle')}
        </h2>
        <p className="text-body-sm text-on-surface-variant font-medium">
          {cooperativeInfo.fullName} • Reg #{cooperativeInfo.regNumber}
        </p>
      </div>

      {/* Escrow Vault & Core Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/30 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">
            Active Co-Owners
          </span>
          <span className="text-xl font-black text-on-surface mt-0.5">
            {cooperativeInfo.metrics.activeCoOwners}
          </span>
          <span className="text-[10px] text-secondary font-bold">Verified Trades</span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/30 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">
            Escrow In Custody
          </span>
          <span className="text-xl font-black text-primary mt-0.5">₹1,48,500</span>
          <span className="text-[10px] text-primary font-bold">Held in RBI Escrow</span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/30 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">
            Commission Rate
          </span>
          <span className="text-xl font-black text-secondary mt-0.5">0.0%</span>
          <span className="text-[10px] text-secondary font-bold">Bylaw Enforced</span>
        </div>

        <div className="bg-surface-container-low p-3 rounded-xl border border-surface-variant/30 flex flex-col">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase">
            Open Disputes
          </span>
          <span className="text-xl font-black text-on-surface mt-0.5">
            {disputedBookings.length}
          </span>
          <span className="text-[10px] text-secondary font-bold">
            {disputedBookings.length > 0 ? 'Requires Action' : '99.8% Satisfied'}
          </span>
        </div>
      </div>

      {/* LIVE DISPUTE RESOLUTION CENTER */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-error">
            <span className="material-symbols-outlined text-[22px] material-symbols-fill">gavel</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Live Escrow Disputes & Refunds
            </h3>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            disputedBookings.length > 0
              ? 'bg-error-container text-on-error-container animate-pulse'
              : 'bg-secondary-container text-on-secondary-container'
          }`}>
            {disputedBookings.length} Active Disputes
          </span>
        </div>

        {resolutionFeedback && (
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{resolutionFeedback}</span>
          </div>
        )}

        {disputedBookings.length === 0 ? (
          <div className="p-4 rounded-lg bg-surface-container-low border border-surface-variant/30 flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-3xl text-secondary">verified_user</span>
            <p className="text-xs font-bold text-on-surface">
              Zero Active Disputes: Escrow vault is operating with 100% mutual trust.
            </p>
            <p className="text-[11px] text-on-surface-variant max-w-sm">
              If a customer reports a delayed or defective technician, the payment is frozen and immediately appears here for administrator adjudication.
            </p>
            <button
              onClick={() => {
                const targetBooking = bookings[0]?.id || 'SHG-8821';
                raiseDispute(targetBooking, 'Technician arrived 45 mins late and left work incomplete');
              }}
              className="mt-1 px-3 py-1.5 rounded-lg bg-primary-fixed text-primary font-bold text-xs hover:bg-primary-fixed/80 flex items-center gap-1 border border-primary/20"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>Simulate Escrow Dispute (Jury Demo)</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {disputedBookings.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-error-container/20 border border-error/30 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-error block">
                      Booking #{b.id} • Escrow Amount: ₹{b.totalEscrow}
                    </span>
                    <h4 className="font-title-md text-sm font-bold text-on-surface mt-0.5">
                      {b.serviceTitle}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Customer: <strong>Priya Sharma</strong> • Technician: <strong>{b.workerName}</strong>
                    </p>
                  </div>
                  <span className="text-[11px] font-bold bg-error text-white px-2 py-0.5 rounded">
                    Frozen in Escrow
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-error/20 text-xs">
                  <span className="text-on-surface-variant font-semibold block">Customer Complaint:</span>
                  <p className="text-on-surface font-medium mt-0.5">{b.disputeReason}</p>
                </div>

                {/* Adjudication Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleResolve(b.id, 'refund_customer')}
                    className="w-full sm:flex-1 h-9 rounded-lg bg-error text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:opacity-90"
                  >
                    <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                    <span>100% Refund to Customer (Zero Fees)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolve(b.id, 'pay_worker')}
                    className="w-full sm:w-auto px-3 h-9 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Release to Worker</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Worker KYC Queue */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              {t('kycQueueTitle')}
            </h3>
          </div>
          <span className="text-xs bg-tertiary-fixed text-on-tertiary-fixed font-bold px-2 py-0.5 rounded">
            {kycQueue.filter((k) => k.status === 'pending').length} Pending
          </span>
        </div>

        <div className="space-y-3">
          {kycQueue.map((applicant) => (
            <div
              key={applicant.id}
              className="p-space-sm rounded-lg bg-surface-container-low border border-surface-variant/30 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-title-md text-[15px] font-bold text-on-surface">
                    {applicant.name}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant">
                    {applicant.trade} • {applicant.experience} Experience
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    applicant.status === 'approved'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : applicant.status === 'rejected'
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-primary-fixed text-on-primary-fixed'
                  }`}
                >
                  {applicant.status === 'approved'
                    ? 'Approved Member'
                    : applicant.status === 'rejected'
                    ? 'Rejected'
                    : 'Pending Verification'}
                </span>
              </div>

              {/* Verification proofs & Skill Assessment */}
              <div className="flex flex-col gap-2 bg-surface-container-lowest p-2.5 rounded-lg border border-surface-variant/20 text-xs">
                {applicant.skillAssessment ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between bg-amber-50 p-2 rounded-md border border-amber-200">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <span className="material-symbols-outlined text-[16px] text-amber-700">smart_display</span>
                        <span>Practical Skill Assessment (Grassroots Verification)</span>
                      </div>
                      <span className="text-[10px] bg-amber-200/80 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">
                        Score: {applicant.skillAssessment.practicalScore}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant font-semibold">🎬 2-Min Live Work Video:</span>
                        <strong className="text-on-surface truncate font-bold">
                          {applicant.skillAssessment.demoVideo.title} ({applicant.skillAssessment.demoVideo.duration})
                        </strong>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant font-semibold">📸 Workshop & Toolkit Proof:</span>
                        <strong className="text-on-surface truncate font-bold">
                          {applicant.skillAssessment.workshopProof.shopName}
                        </strong>
                      </div>
                      <div className="sm:col-span-2 flex flex-col">
                        <span className="text-on-surface-variant font-semibold">🤝 Peer Member Guarantor:</span>
                        <strong className="text-secondary font-bold">
                          {applicant.skillAssessment.peerGuarantors[0]?.name} ({applicant.skillAssessment.peerGuarantors[0]?.role})
                        </strong>
                      </div>
                    </div>

                    {/* Button to preview video and workshop photos */}
                    <button
                      type="button"
                      onClick={() => setSkillAssessmentModalWorker(applicant)}
                      className="w-full py-1.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-[11px] flex items-center justify-center gap-1.5 border border-amber-300 active:scale-95 transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[15px] text-amber-800 material-symbols-fill">smart_display</span>
                      <span>Watch 2-Min Demo Video & Inspect Workshop Photos</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-on-surface-variant block">e-Shram Number:</span>
                      <strong className="text-on-surface">{applicant.eShramId}</strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">DigiLocker Verification:</span>
                      <strong className="text-secondary">{applicant.digiLockerStatus}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-on-surface-variant block">Police Clearance:</span>
                      <strong className="text-on-surface">{applicant.policeCheck}</strong>
                    </div>
                  </div>
                )}
              </div>

              {applicant.status === 'pending' && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => approveWorkerKyc(applicant.id)}
                    className="flex-1 h-9 rounded bg-primary text-white font-label-sm font-bold text-xs shadow-xs"
                  >
                    {t('approveBtn')} & Issue Co-Owner Share
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectWorkerKyc(applicant.id)}
                    className="px-3 h-9 rounded bg-surface-container-high text-on-surface font-label-sm font-bold text-xs"
                  >
                    {t('rejectBtn')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Escrow Vault Audit & Live Transparency */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              {t('disputeAuditTitle')}
            </h3>
          </div>
          <span className="text-xs text-secondary font-bold">100% Direct Payouts Active</span>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          In accordance with the Cooperative Bylaws, 0% platform extraction is enforced. Funds flow from customer escrow directly to technician bank accounts immediately upon 4-digit PIN authorization.
        </p>

        <div className="p-3 bg-secondary-container/30 rounded-lg border border-secondary/20 flex items-center justify-between text-xs">
          <span className="font-bold text-on-secondary-container">
            Safety & Mutual Insurance Fund Balance:
          </span>
          <strong className="text-secondary text-sm">₹48,200</strong>
        </div>

        {/* Public Audit Ledger Modal Trigger */}
        <button
          onClick={() => setAuditReportModalOpen(true)}
          className="w-full h-11 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary font-bold text-xs flex items-center justify-center gap-2 border border-primary/20 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Open Public Audit Ledger & Block Records (Live Verification)</span>
        </button>
      </section>

      {/* Chapter Resolution Creator */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[20px]">ballot</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Democratic Chapter Resolutions
            </h3>
          </div>
          <button
            onClick={() => setShowResolutionForm(!showResolutionForm)}
            className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold"
          >
            {showResolutionForm ? 'Cancel' : '+ New Ballot'}
          </button>
        </div>

        {publishedAlert && (
          <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-lg text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>Resolution published successfully to member ballot!</span>
          </div>
        )}

        {showResolutionForm && (
          <form onSubmit={handlePublish} className="p-space-sm bg-surface-container-low rounded-lg border border-surface-variant/40 flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface">Resolution Motion Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Allocation of 5% Surplus to Winter Uniform Subsidy"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-10 px-3 rounded bg-white text-on-surface text-sm border border-surface-variant focus:outline-none focus:border-primary"
            />
            <label className="text-xs font-bold text-on-surface mt-1">Detailed Explanation</label>
            <textarea
              rows={2}
              placeholder="Provide context and rationale for the members..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="p-2 rounded bg-white text-on-surface text-sm border border-surface-variant focus:outline-none focus:border-primary"
            ></textarea>
            <button
              type="submit"
              className="h-10 rounded bg-primary text-white text-xs font-bold mt-1 shadow-xs"
            >
              {t('publishResolutionBtn')}
            </button>
          </form>
        )}

        <div className="text-xs text-on-surface-variant">
          Currently <strong>{resolutionsList.length} active resolutions</strong> open for voting in the Community tab.
        </div>
      </section>
    </div>
  );
};
