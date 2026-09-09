import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DisputeModal = () => {
  const { disputeModalBooking, setDisputeModalBooking, raiseDispute, t } = useApp();
  const [selectedReason, setSelectedReason] = useState('Technician did not arrive on time');
  const [details, setDetails] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  if (!disputeModalBooking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    raiseDispute(disputeModalBooking.id, `${selectedReason}${details ? `: ${details}` : ''}`);
    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeSuccess(false);
      setDisputeModalBooking(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-space-md shadow-2xl flex flex-col gap-space-md border border-error/30">
        <div className="flex items-center justify-between pb-2 border-b border-surface-variant">
          <div className="flex items-center gap-2 text-error">
            <span className="material-symbols-outlined text-2xl material-symbols-fill">
              gavel
            </span>
            <h3 className="font-title-md text-base font-extrabold text-on-surface">
              {t('disputeTitle')}
            </h3>
          </div>
          <button
            onClick={() => setDisputeModalBooking(null)}
            className="text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {disputeSuccess ? (
          <div className="p-4 bg-secondary-container text-on-secondary-container rounded-xl flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-4xl text-secondary">verified</span>
            <h4 className="font-headline-sm text-sm font-bold">Escrow Frozen & Submitted!</h4>
            <p className="text-xs">
              Your deposit of ₹{disputeModalBooking.totalEscrow} is locked safely. Chapter Admin has received your complaint for immediate mediation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-amber-900 leading-snug">
              <strong>Escrow Protection Guarantee:</strong> Your funds will not be released to the worker while dispute is under review. You can claim a 100% refund.
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Reason for Dispute</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full h-10 px-2 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface font-semibold focus:outline-none focus:border-primary"
              >
                <option value="Technician did not arrive on time">Technician did not arrive on time (No-show)</option>
                <option value="Work incomplete or defective">Work incomplete or safety issue detected</option>
                <option value="Technician requested extra cash payment">Technician requested cash outside cooperative quote</option>
                <option value="Mutual cancellation agreed">Mutual cancellation agreed</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Additional Note (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Waited for 30 minutes, technician did not answer calls."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2 rounded-lg bg-surface-container-low border border-surface-variant text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-error text-white font-title-md font-bold flex items-center justify-center gap-2 shadow-xs active:opacity-90"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>{t('submitDisputeBtn')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
