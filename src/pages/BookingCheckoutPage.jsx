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
  const platformCommission = 0;
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
    <div className="w-full max-w-md mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-space-lg pb-24">
      {/* 1. Booking Context Banner */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 overflow-hidden flex flex-col p-space-md">
        <div className="flex items-center justify-between gap-space-xs mb-space-xs">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[14px] material-symbols-fill text-secondary">
              verified
            </span>
            {t('verifiedCoopBooking')}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
            ID: #SHG-8821
          </span>
        </div>

        <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold mt-1">
          {currentWorker.category === 'electrical'
            ? 'Electrical Switchboard & Wiring Repair'
            : `${currentWorker.trade} On-Site Service`}
        </h2>

        <div className="mt-space-sm pt-space-xs bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-space-xs border border-surface-variant/20">
          <div className="flex items-center gap-space-sm">
            <img
              alt={currentWorker.name}
              className="w-12 h-12 rounded-lg object-cover border border-surface-variant/40"
              src={currentWorker.detailAvatar || currentWorker.avatar}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-title-md text-title-md text-on-surface font-extrabold truncate">
                  {currentWorker.name}
                </p>
                <span className="material-symbols-outlined text-amber-500 text-[16px] material-symbols-fill">
                  star
                </span>
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  {currentWorker.rating}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {currentWorker.trade} • Co-Owner #{currentWorker.memberId}
              </p>
            </div>
          </div>

          <div className="mt-1 flex flex-col gap-1.5 text-on-surface-variant font-body-sm text-body-sm pt-1 border-t border-surface-variant/30">
            <div className="flex items-start gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                location_on
              </span>
              <span className="text-on-surface font-medium">{address}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                schedule
              </span>
              <span className="text-on-surface font-label-md text-label-md font-bold">
                {timeSlot}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Direct Negotiation Box */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 overflow-hidden p-space-md flex flex-col">
        <div className="flex items-center justify-between pb-space-xs mb-space-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px] material-symbols-fill">
              handshake
            </span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">
              {t('directNegotiation')}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            {t('priceAgreed')}
          </span>
        </div>

        {/* Interactive negotiation history */}
        <div className="flex flex-col gap-space-xs bg-surface-container-low rounded-lg p-space-sm max-h-60 overflow-y-auto border border-surface-variant/20">
          {negotiationThread.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'customer'
                  ? 'items-end self-end max-w-[85%]'
                  : msg.sender === 'system'
                  ? 'items-center self-center max-w-[90%] my-1'
                  : 'items-start max-w-[88%]'
              }`}
            >
              {msg.sender !== 'system' && (
                <span className="font-label-sm text-[11px] text-on-surface-variant ml-1 mr-1 mb-0.5 font-semibold">
                  {msg.name} • {msg.time}
                </span>
              )}

              {msg.sender === 'customer' ? (
                <div className="bg-primary-container text-on-primary p-2.5 rounded-xl shadow-xs font-body-sm text-body-sm text-white">
                  {msg.text}
                </div>
              ) : msg.sender === 'system' ? (
                <div className="bg-primary text-on-primary px-3 py-1 rounded-xl shadow-xs font-label-md text-label-md flex items-center gap-1 text-white font-bold">
                  <span className="material-symbols-outlined text-[16px]">done_all</span>
                  {msg.text}
                </div>
              ) : (
                <div className="bg-surface-container-lowest p-2.5 rounded-xl shadow-xs text-on-surface font-body-sm text-body-sm border border-surface-variant/30">
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Tap Counter-Offer Chips for SIH Demo */}
        <div className="pt-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase">
              Quick Counter-Offer Simulation:
            </span>
            {!isNegotiating && (
              <button
                type="button"
                onClick={() => setIsNegotiating(true)}
                className="text-primary font-label-sm text-xs font-bold hover:underline"
              >
                Custom Price
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {[380, 400, 420, 450].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickChip(amt)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-all ${
                  agreedLabourPrice === amt
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-container-low text-on-surface border-surface-variant hover:bg-surface-container'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        {isNegotiating && (
          <form onSubmit={handleSendOffer} className="pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-on-surface-variant font-bold">₹</span>
              <input
                type="number"
                min="150"
                max="2000"
                placeholder="400"
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                className="w-full h-10 pl-7 pr-2 rounded-lg bg-surface-container-low text-on-surface font-title-md border border-surface-variant focus:outline-none focus:border-primary text-sm font-bold"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-3 rounded-lg bg-primary text-white font-label-md font-bold text-xs"
            >
              Send Offer
            </button>
            <button
              type="button"
              onClick={() => setIsNegotiating(false)}
              className="h-10 px-2 text-outline hover:text-on-surface text-xs"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Price Agreement Callout Card */}
        <div className="mt-space-sm bg-primary-container text-on-primary rounded-lg p-space-sm flex items-center justify-between text-white">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-primary-container font-semibold">
              {t('mutuallyAgreedLabour')}
            </span>
            <span className="font-headline-sm text-headline-sm tracking-tight font-black text-white">
              ₹{agreedLabourPrice}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-primary px-2.5 py-1.5 rounded-lg text-on-primary font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Fixed Price
          </div>
        </div>
      </section>

      {/* 3. Transparent Bill Breakdown */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 p-space-md flex flex-col">
        <div className="flex items-center gap-1.5 mb-space-sm">
          <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
          <h3 className="font-title-md text-title-md text-on-surface font-bold">
            {t('transparentBill')}
          </h3>
        </div>

        <div className="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface">
          <div className="flex justify-between items-center py-1">
            <div className="flex flex-col">
              <span className="font-semibold">{t('agreedWorkerAmount')}</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                100% directly released to {currentWorker.name.split(' ')[0]}
              </span>
            </div>
            <span className="font-title-md text-title-md text-on-surface font-bold">
              ₹{agreedLabourPrice}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <div className="flex flex-col">
              <span className="font-semibold">{t('workerCommission')}</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Cooperative guarantee: zero commission cuts
              </span>
            </div>
            <span className="font-title-md text-title-md text-secondary font-black">₹0</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <div className="flex flex-col">
              <span className="font-semibold">{t('safetyInsurance')}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Worker accidental + public liability coverage
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface font-bold">₹{insuranceFee}</span>
          </div>

          <div className="my-space-xs bg-surface-container-highest h-[1px] w-full"></div>

          <div className="flex justify-between items-center pt-1">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                {t('totalToEscrow')}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                {t('refundableNotice')}
              </span>
            </div>
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-black">
              ₹{totalEscrowAmount}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Sahyog Escrow Trust Timeline */}
      <section className="bg-surface-container-low rounded-xl p-space-md flex flex-col border border-surface-variant/30">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <h3 className="font-title-md text-title-md text-on-surface font-bold">
              Escrow Protection Timeline
            </h3>
          </div>
          <span className="text-secondary font-bold text-label-sm">RBI Escrow Compliant</span>
        </div>

        <div className="space-y-3 font-body-sm text-body-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-bold text-on-surface">Deposit held safely in Escrow</p>
              <p className="text-on-surface-variant text-[12px]">
                Your funds remain safe in trust account until work is finished.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-bold text-on-surface">{currentWorker.name} arrives with ID</p>
              <p className="text-on-surface-variant text-[12px]">
                e-Shram card and DigiLocker verified technician on site.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-bold text-on-surface">Inspect Completed Work</p>
              <p className="text-on-surface-variant text-[12px]">
                Ensure repair is completely functional to your satisfaction.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div>
              <p className="font-bold text-on-surface">Release 4-Digit PIN to Worker</p>
              <p className="text-on-surface-variant text-[12px]">
                Technician enters PIN to receive immediate 100% direct bank payout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Payment Method Selector */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-variant/40 p-space-md flex flex-col gap-2">
        <h3 className="font-title-md text-title-md text-on-surface font-bold">
          Choose Escrow Payment Channel
        </h3>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { id: 'upi', label: 'UPI / GPay', icon: 'qr_code_2' },
            { id: 'card', label: 'Cards / NetBank', icon: 'credit_card' },
            { id: 'wallet', label: 'Co-op Wallet', icon: 'account_balance_wallet' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id)}
              className={`p-2.5 rounded-lg flex flex-col items-center justify-center gap-1 border text-center transition-all ${
                paymentMethod === m.id
                  ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                  : 'border-surface-variant bg-surface-container-low text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
              <span className="font-label-sm text-[12px]">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleConfirmCheckout}
          className="w-full h-14 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-extrabold flex items-center justify-center gap-2 shadow-md active:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">lock</span>
          <span>{t('depositAndConfirmBtn')} (₹{totalEscrowAmount})</span>
        </button>
        <p className="text-center font-label-sm text-[11px] text-on-surface-variant mt-2">
          Zero risk: 100% money back guarantee if service is not rendered.
        </p>
      </div>
    </div>
  );
};
