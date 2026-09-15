import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const CancelBookingModal = () => {
  const { cancelModalBooking, setCancelModalBooking, cancelBooking } = useApp();
  const [selectedReason, setSelectedReason] = useState('Change of schedule / issue solved');
  const [customReason, setCustomReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  if (!cancelModalBooking) return null;

  const booking = cancelModalBooking;
  const isEnRoute = booking.timeline?.some((t) => t.title.toLowerCase().includes('en route') && t.status === 'completed');
  
  // Fair Stage-based Cancellation Fee
  const cancelFee = isEnRoute ? 50 : 0;
  const totalAmount = booking.totalEscrow || 460;
  const refundAmount = Math.max(0, totalAmount - cancelFee);

  const reasons = [
    'Change of schedule / issue solved',
    'Technician taking longer than estimated ETA',
    'Booked wrong trade / accidental booking',
    'Emergency / had to step out',
    'Other reason',
  ];

  const handleConfirmCancel = () => {
    const finalReason = selectedReason === 'Other reason' && customReason ? customReason : selectedReason;
    cancelBooking(booking.id, finalReason, cancelFee);
    soundEffects.playSuccessChime();
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setCancelModalBooking(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl w-full max-w-md shadow-2xl border border-surface-variant/40 overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-amber-400">cancel</span>
            <div>
              <h3 className="font-bold text-base leading-tight">Cancel Service & Instant Refund</h3>
              <p className="text-[11px] text-slate-300 font-mono">Order #{booking.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCancelModalBooking(null)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {confirmed ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h4 className="font-black text-lg text-emerald-800">100% Escrow Refund Processed!</h4>
            <p className="text-xs text-on-surface-variant">
              ₹{refundAmount} has been credited back to your original payment channel (UPI / Escrow Account).
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4 text-xs">
            {/* Stage-Based Policy Banner */}
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              isEnRoute
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                {isEnRoute ? 'local_shipping' : 'verified_user'}
              </span>
              <div>
                <span className="font-bold block text-xs">
                  {isEnRoute
                    ? 'Technician En Route: ₹50 Fuel Reimbursement'
                    : '100% Free Cancellation & Zero Penalty'}
                </span>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {isEnRoute
                    ? 'Technician is already traveling. ₹50 goes directly to worker petrol expenses, remaining ₹' + refundAmount + ' is refunded instantly.'
                    : 'Technician has not dispatched yet. Full ₹' + refundAmount + ' will be refunded immediately.'}
                </p>
              </div>
            </div>

            {/* Refund Breakdown Card */}
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-variant/40 space-y-1.5">
              <div className="flex justify-between text-on-surface-variant">
                <span>Total Escrow Held:</span>
                <span className="font-bold font-mono">₹{totalAmount}.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Cancellation / Fuel Charge:</span>
                <span className="font-bold font-mono text-amber-700">
                  {cancelFee > 0 ? `₹${cancelFee}.00` : '₹0.00 (100% Free)'}
                </span>
              </div>
              <div className="flex justify-between text-on-surface pt-1.5 border-t border-surface-variant/30 text-sm font-black">
                <span>Instant Refund to UPI:</span>
                <span className="text-primary font-mono text-base">₹{refundAmount}.00</span>
              </div>
            </div>

            {/* Select Reason */}
            <div className="space-y-1.5">
              <label className="font-bold text-on-surface block">
                Please select reason for cancellation:
              </label>
              <div className="space-y-1.5">
                {reasons.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedReason === r
                        ? 'bg-primary/10 border-primary text-primary font-bold'
                        : 'bg-surface-container-lowest border-surface-variant/40 text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      value={r}
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                      className="accent-primary"
                    />
                    <span className="text-xs">{r}</span>
                  </label>
                ))}
              </div>

              {selectedReason === 'Other reason' && (
                <input
                  type="text"
                  placeholder="Describe reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full mt-2 p-2 rounded-xl bg-surface-container-low border border-surface-variant text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-surface-variant/30">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl font-bold text-xs text-on-surface transition-colors"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-error text-white hover:bg-error/90 rounded-xl font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                <span>Confirm & Refund ₹{refundAmount}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
