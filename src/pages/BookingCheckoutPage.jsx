import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const BookingCheckoutPage = () => {
  const {
    t,
    currentWorker,
    agreedLabourPrice,
    negotiationThread,
    submitCounterOffer,
    createBooking,
    selectedLocality,
    activeCityConfig,
  } = useApp();

  const [counterInput, setCounterInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [address, setAddress] = useState(
    `${selectedLocality || 'Civil Lines, Golaghat'}, ${activeCityConfig?.name || 'Sultanpur'}`
  );
  const [timeSlot, setTimeSlot] = useState('Today, 4:00 PM – 5:00 PM');
  const [isNegotiating, setIsNegotiating] = useState(false);

  const insuranceFee = 10;
  const totalEscrowAmount = agreedLabourPrice + insuranceFee;

  const handleSendOffer = (e) => {
    e.preventDefault();
    const parsed = parseInt(counterInput, 10);
    if (parsed && parsed >= 100 && parsed <= 5000) {
      submitCounterOffer(parsed);
      setCounterInput('');
      setIsNegotiating(false);
    }
  };

  const handleQuickChip = (amount) => {
    submitCounterOffer(amount);
    setIsNegotiating(false);
  };

  const handleConfirmCheckout = () => {
    createBooking({
      worker: currentWorker,
      serviceTitle: `${currentWorker.category === 'electrical' ? 'Electrical Switchboard & Wiring Repair' : `${currentWorker.name.split(' ')[0]}'s Service`}`,
      address,
      timeSlot,
      labourAmount: agreedLabourPrice,
      paymentMethod,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3.5 pb-32 animate-fade-in">
      {/* 1. Booking Summary */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-2xs border border-surface-variant/40 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-black">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            <span>Co-Op Booking</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-on-surface-variant">
            ID: #SHG-8821
          </span>
        </div>

        <div className="flex items-center gap-3 p-2.5 bg-surface-container-low rounded-xl border border-surface-variant/20">
          <img
            alt={currentWorker.name}
            className="w-12 h-12 rounded-xl object-cover border border-surface-variant/40 shrink-0"
            src={currentWorker.detailAvatar || currentWorker.avatar}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-on-surface truncate">
              {currentWorker.name}
            </h3>
            <p className="text-xs text-on-surface-variant truncate">
              {currentWorker.trade} • ★ {currentWorker.rating}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0">location_on</span>
            <span className="truncate font-medium text-on-surface">{address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0">schedule</span>
            <span className="font-bold text-on-surface">{timeSlot}</span>
          </div>
        </div>
      </section>

      {/* 2. Direct Price Negotiation */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-2xs border border-surface-variant/40 p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-primary">
            <span className="material-symbols-outlined text-[18px] material-symbols-fill">handshake</span>
            <h3 className="font-bold text-sm text-on-surface">Direct Price Agreement</h3>
          </div>
          <span className="text-[10px] font-black bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md">
            ₹0 Aggregator Cut
          </span>
        </div>

        {/* Price callout */}
        <div className="bg-primary/10 rounded-xl p-3 flex items-center justify-between border border-primary/20">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-primary">Agreed Labour Rate</span>
            <span className="text-xl font-black text-primary">₹{agreedLabourPrice}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
            <span className="material-symbols-outlined text-[14px]">done_all</span>
            <span>Price Agreed</span>
          </span>
        </div>

        {/* Quick simulation counter chips */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <span className="text-[11px] font-bold text-on-surface-variant">Counter-Offer:</span>
          <div className="flex gap-1.5">
            {[380, 400, 420, 450].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickChip(amt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                  agreedLabourPrice === amt
                    ? 'bg-primary text-white shadow-2xs'
                    : 'bg-surface-container-low text-on-surface border border-surface-variant/40 hover:bg-surface-container'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Transparent Bill Breakdown */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-2xs border border-surface-variant/40 p-4 flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-on-surface font-bold text-sm mb-0.5">
          <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
          <span>Transparent Bill</span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-on-surface">
          <span>Agreed Labour (100% to Worker)</span>
          <span className="font-bold">₹{agreedLabourPrice}</span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-secondary font-bold">
          <span>Cooperative Commission Cut</span>
          <span>₹0</span>
        </div>

        <div className="flex justify-between items-center py-0.5 text-on-surface-variant">
          <span>Safety & Insurance Protection</span>
          <span>₹{insuranceFee}</span>
        </div>

        <div className="border-t border-surface-variant/40 my-1"></div>

        <div className="flex justify-between items-center text-sm font-bold text-on-surface">
          <span>Total Escrow Amount</span>
          <span className="text-base font-black text-primary">₹{totalEscrowAmount}</span>
        </div>
      </section>

      {/* 4. Payment Method Selection */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-2xs border border-surface-variant/40 p-4 flex flex-col gap-2">
        <h3 className="font-bold text-xs text-on-surface">Payment Channel</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'upi', label: 'UPI / GPay', icon: 'qr_code_2' },
            { id: 'card', label: 'Cards / NetBank', icon: 'credit_card' },
            { id: 'wallet', label: 'Co-op Wallet', icon: 'account_balance_wallet' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 ${
                paymentMethod === m.id
                  ? 'border-2 border-primary bg-primary/10 text-primary font-bold shadow-2xs'
                  : 'border border-surface-variant/40 bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
              <span className="text-[11px]">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Checkout CTA Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleConfirmCheckout}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-white text-sm font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span>Deposit in Safe Escrow (₹{totalEscrowAmount})</span>
        </button>
        <p className="text-center text-[11px] text-on-surface-variant mt-2 font-medium">
          Protected by RBI Escrow. Funds are released only after you share the 4-digit PIN.
        </p>
      </div>
    </div>
  );
};
