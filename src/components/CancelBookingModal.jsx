import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const CancelBookingModal = () => {
  const { cancelModalBooking, setCancelModalBooking, cancelBooking, language } = useApp();
  const [selectedReason, setSelectedReason] = useState('Technician stalled halfway / delayed beyond ETA');
  const [customReason, setCustomReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const isHindi = language === 'hi';

  if (!cancelModalBooking) return null;

  const booking = cancelModalBooking;
  const isEnRoute = booking.timeline?.some((t) => t.title.toLowerCase().includes('en route') && t.status === 'completed');

  // Anti-Gaming Fuel Policy:
  // If cancellation is due to technician delay / stalling halfway / not arriving -> 100% Full Refund (₹0 Fee).
  // Fuel fee (₹50) only applies if customer voluntarily cancels when technician has already reached doorstep (<100m).
  const isWorkerFault =
    selectedReason === 'Technician stalled halfway / delayed beyond ETA' ||
    selectedReason === 'Technician stopped / unreachable on call';

  const cancelFee = isEnRoute && !isWorkerFault ? 50 : 0;
  const totalAmount = booking.totalEscrow || 460;
  const refundAmount = Math.max(0, totalAmount - cancelFee);

  const reasons = [
    {
      id: 'Technician stalled halfway / delayed beyond ETA',
      label: isHindi ? 'तकनीशियन रास्ते में रुक गया / समय पर नहीं आया (100% रिफंड)' : 'Technician stalled halfway / delayed beyond ETA (100% Refund)',
      isFault: true,
    },
    {
      id: 'Technician stopped / unreachable on call',
      label: isHindi ? 'तकनीशियन फोन नहीं उठा रहा / लोकेशन आगे नहीं बढ़ रही' : 'Technician unreachable / GPS not progressing',
      isFault: true,
    },
    {
      id: 'Change of schedule / issue solved',
      label: isHindi ? 'योजना बदल गई / समस्या स्वयं हल हो गई' : 'Customer change of mind / issue resolved',
      isFault: false,
    },
    {
      id: 'Booked wrong trade / accidental booking',
      label: isHindi ? 'गलती से गलत सेवा बुक हो गई' : 'Accidental booking / wrong service trade',
      isFault: false,
    },
    {
      id: 'Other reason',
      label: isHindi ? 'अन्य कारण' : 'Other reason',
      isFault: false,
    },
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
              <h3 className="font-bold text-base leading-tight">
                {isHindi ? 'बुकिंग रद्द करें व 100% तुरंत रिफंड' : 'Cancel Service & Instant Refund'}
              </h3>
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
            <h4 className="font-black text-lg text-emerald-800">
              {isHindi ? '100% एस्क्रो रिफंड सफल!' : '100% Escrow Refund Processed!'}
            </h4>
            <p className="text-xs text-on-surface-variant">
              {isHindi
                ? `₹${refundAmount} तुरंत आपके मूल यूपीआई / बैंक खाते में क्रेडिट हो गया है।`
                : `₹${refundAmount} has been credited back to your original payment channel (UPI / Escrow Account).`}
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4 text-xs">
            {/* Anti-Gaming Policy Notice */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                cancelFee > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                {cancelFee > 0 ? 'local_shipping' : 'verified_user'}
              </span>
              <div>
                <span className="font-bold block text-xs">
                  {cancelFee > 0
                    ? isHindi
                      ? 'डोरस्टेप आगमन: ₹50 पेट्रोल रीइंबर्समेंट'
                      : 'Doorstep Arrival: ₹50 Fuel Reimbursement'
                    : isHindi
                    ? '100% शून्य कटौती रिफंड (जीपीएस सत्यापित ✓)'
                    : '100% Full Refund (Zero Cancellation Fee ✓)'}
                </span>
                <p className="text-[11px] opacity-90 mt-0.5">
                  {cancelFee > 0
                    ? isHindi
                      ? 'तकनीशियन आपके दरवाजे (<100m) तक पहुंच चुका है। ₹50 पेट्रोल खर्च वर्कर को जाएगा, बाकी तुरंत वापस होगा।'
                      : 'Technician reached doorstep (<100m). ₹50 goes to worker fuel, remaining ₹' + refundAmount + ' refunded.'
                    : isHindi
                    ? 'जीपीएस जांच: तकनीशियन रास्ते में रुका हुआ है / ग्राहक तक नहीं पहुंचा। पूरा ₹' + refundAmount + ' तुरंत बिना किसी शुल्क के रिफंड होगा।'
                    : 'GPS Verified: Technician did not reach customer doorstep (<100m). Full ₹' + refundAmount + ' refunded with 0% penalty.'}
                </p>
              </div>
            </div>

            {/* Refund Breakdown Card */}
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-variant/40 space-y-1.5">
              <div className="flex justify-between text-on-surface-variant">
                <span>{isHindi ? 'कुल जमा एस्क्रो राशि:' : 'Total Escrow Held:'}</span>
                <span className="font-bold font-mono">₹{totalAmount}.00</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>{isHindi ? 'रद्दीकरण / ईंधन शुल्क:' : 'Cancellation / Fuel Charge:'}</span>
                <span className={`font-bold font-mono ${cancelFee > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {cancelFee > 0 ? `₹${cancelFee}.00` : '₹0.00 (100% Free)'}
                </span>
              </div>
              <div className="flex justify-between text-on-surface pt-1.5 border-t border-surface-variant/30 text-sm font-black">
                <span>{isHindi ? 'तुरंत बैंक UPI रिफंड:' : 'Instant Refund to UPI:'}</span>
                <span className="text-primary font-mono text-base">₹{refundAmount}.00</span>
              </div>
            </div>

            {/* Select Reason */}
            <div className="space-y-1.5">
              <label className="font-bold text-on-surface block">
                {isHindi ? 'रद्द करने का कारण चुनें:' : 'Please select reason for cancellation:'}
              </label>
              <div className="space-y-1.5">
                {reasons.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedReason === r.id
                        ? 'bg-primary/10 border-primary text-primary font-bold'
                        : 'bg-surface-container-lowest border-surface-variant/40 text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancel_reason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={() => setSelectedReason(r.id)}
                      className="accent-primary"
                    />
                    <span className="text-xs">{r.label}</span>
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
                {isHindi ? 'रद्द न करें' : 'Keep Booking'}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-error text-white hover:bg-error/90 rounded-xl font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                <span>{isHindi ? `100% रिफंड लें ₹${refundAmount}` : `Confirm & Refund ₹${refundAmount}`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
