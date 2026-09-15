import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const ReassignWorkerModal = () => {
  const {
    reassignModalBooking,
    setReassignModalBooking,
    reassignBooking,
    workers,
    activeCityConfig,
  } = useApp();

  const [selectedPeerId, setSelectedPeerId] = useState('');
  const [handoverReason, setHandoverReason] = useState('Primary worker occupied with complex line repair');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!reassignModalBooking) return null;

  const booking = reassignModalBooking;

  // Filter other available workers in this city or category
  const candidatePeers = (workers || []).filter(
    (w) => w.id !== booking.workerId
  );

  const reasons = [
    'Primary worker occupied with complex line repair',
    'Customer requested earlier arrival / slot switch',
    'Vehicle breakdown / tool requirement handover',
    'Locality closer to peer workshop',
  ];

  const handleConfirmReassign = () => {
    const chosenWorker = candidatePeers.find((w) => w.id === selectedPeerId) || candidatePeers[0];
    if (!chosenWorker) return;

    reassignBooking(booking.id, chosenWorker, handoverReason);
    soundEffects.playRadarBlip();
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setReassignModalBooking(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl w-full max-w-lg shadow-2xl border border-surface-variant/40 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
            <div>
              <h3 className="font-bold text-base leading-tight">Handover & Re-assign to Guild Peer</h3>
              <p className="text-[11px] text-white/80 font-mono">
                Order #{booking.id} • Current: {booking.workerName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReassignModalBooking(null)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {successNotice ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <span className="material-symbols-outlined text-[32px]">handshake</span>
            </div>
            <h4 className="font-black text-lg text-emerald-800">Job Successfully Reassigned!</h4>
            <p className="text-xs text-on-surface-variant">
              The booking and live GPS dispatch have been transferred to your verified Guild Peer. Customer and Peer have been notified.
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
            {/* Cooperative Advantage Banner */}
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-indigo-600 shrink-0 mt-0.5">
                diversity_3
              </span>
              <p className="text-[11px] leading-relaxed">
                <strong>Cooperative Guild Network:</strong> Jobs are never cancelled due to emergency. They are smoothly handed over to vetted, equal co-owner peers in <strong>{activeCityConfig?.name || 'Sultanpur'}</strong> with zero loss to customer.
              </p>
            </div>

            {/* Handover Reason */}
            <div className="space-y-1.5">
              <label className="font-bold text-on-surface block">Reason for Peer Handover:</label>
              <select
                value={handoverReason}
                onChange={(e) => setHandoverReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-variant text-xs text-on-surface font-medium focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Available Peer */}
            <div className="space-y-2">
              <label className="font-bold text-on-surface block">
                Select Available Guild Tradesperson:
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {candidatePeers.map((peer) => {
                  const isSelected = selectedPeerId === peer.id || (!selectedPeerId && candidatePeers[0]?.id === peer.id);
                  return (
                    <div
                      key={peer.id}
                      onClick={() => setSelectedPeerId(peer.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-1 ring-primary'
                          : 'bg-surface-container-low border-surface-variant/40 hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={peer.detailAvatar || peer.avatar}
                          alt={peer.name}
                          className="w-10 h-10 rounded-xl object-cover border border-surface-variant/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-on-surface truncate">
                              {peer.name}
                            </span>
                            <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.2 rounded font-black">
                              #{peer.memberId}
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant truncate">
                            {peer.trade} • {peer.distance || '1.1 km'}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            <span>{peer.eShramId || 'e-Shram Verified'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 block">
                          ★ {peer.rating}
                        </span>
                        <span className="text-[10px] text-secondary font-bold mt-1 block">
                          {isSelected ? 'Selected' : 'Tap to Choose'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-surface-variant/30">
              <button
                type="button"
                onClick={() => setReassignModalBooking(null)}
                className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl font-bold text-xs text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReassign}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                <span>Confirm Handover to Peer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
