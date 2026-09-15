import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const BookingCheckoutPage = () => {
  const {
    t,
    currentWorker,
    agreedLabourPrice,
    negotiationThread,
    submitCounterOffer,
    sendNegotiationMessage,
    createBooking,
    selectedLocality,
    activeCityConfig,
    language,
  } = useApp();

  const isHindi = language === 'hi';

  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [address, setAddress] = useState(
    `${selectedLocality || 'Civil Lines, Golaghat'}, ${activeCityConfig?.name || 'Sultanpur'}`
  );
  const [timeSlot, setTimeSlot] = useState('Today, 4:00 PM – 5:00 PM');

  const chatEndRef = useRef(null);

  const insuranceFee = 10;
  const totalEscrowAmount = agreedLabourPrice + insuranceFee;

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [negotiationThread]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    soundEffects.playRadarBlip();
    sendNegotiationMessage(chatInput.trim());
    setChatInput('');
  };

  const handleQuickChip = (msg, amount = null) => {
    soundEffects.playRadarBlip();
    if (amount) {
      submitCounterOffer(amount, msg);
    } else {
      sendNegotiationMessage(msg);
    }
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
            <span>Co-Op Direct Hire</span>
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

      {/* 2. Direct Price Negotiation & Real-Time Chat Window */}
      <section className="bg-surface-container-lowest rounded-3xl shadow-sm border-2 border-primary/30 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] material-symbols-fill">chat</span>
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-on-surface">
                {isHindi ? 'सीधी बातचीत व दर समझौता' : 'Direct Negotiation & Chat'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isHindi ? 'तकनीशियन से सीधी बात करें और सही दाम तय करें' : 'Negotiate directly with technician (0% Middleman Cut)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-xs font-bold text-primary flex items-center gap-0.5 bg-primary/10 px-2.5 py-1 rounded-xl hover:bg-primary/20 transition-colors"
          >
            <span>{isChatOpen ? (isHindi ? 'छोटा करें' : 'Collapse') : (isHindi ? 'चैट खोलें' : 'Expand')}</span>
            <span className="material-symbols-outlined text-[15px]">
              {isChatOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* Current Agreed Price Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-white to-emerald-50 rounded-2xl p-3 flex items-center justify-between border border-primary/25">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary">
              {isHindi ? 'सहमति पारिश्रमिक दर' : 'Agreed Labour Rate'}
            </span>
            <span className="text-2xl font-black text-primary font-mono">
              ₹{agreedLabourPrice}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 bg-emerald-100/90 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">handshake</span>
            <span>{isHindi ? 'दर तय हुई ✓' : 'Rate Agreed ✓'}</span>
          </span>
        </div>

        {/* Interactive Chat Window Feed */}
        {isChatOpen && (
          <div className="flex flex-col gap-2.5 animate-fade-in">
            <div className="max-h-56 overflow-y-auto p-3 bg-slate-50/90 rounded-2xl border border-slate-200 flex flex-col gap-2.5 text-xs">
              {negotiationThread.map((msg) => {
                const isCustomer = msg.sender === 'customer';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="self-center my-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px] px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs animate-fade-in">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      <span>{msg.text} • Rate Locked at ₹{msg.agreedPrice || agreedLabourPrice}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      isCustomer ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-0.5 text-[10px] text-slate-500 font-bold px-1">
                      <span>{msg.name || (isCustomer ? 'You' : currentWorker.name)}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`p-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isCustomer
                          ? 'bg-primary text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Negotiation Smart Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Quick Options:</span>
              {[
                { label: 'Offer ₹400', text: 'Can you do it for ₹400?', price: 400 },
                { label: 'Offer ₹420', text: 'Will you agree on ₹420?', price: 420 },
                { label: 'Accept ₹450', text: '₹450 is fair, let us lock the deal.', price: 450 },
                { label: 'Ask ISI Wire', text: 'Please bring ISI certified wire and safety tester.' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickChip(chip.text, chip.price)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white hover:bg-primary/10 hover:text-primary border border-slate-300 text-slate-700 transition-all active:scale-95 shrink-0 shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Custom Chat Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  isHindi
                    ? "संदेश या अपनी दर लिखें (उदा. क्या ₹420 में कर देंगे?)"
                    : "Type message or offer rate (e.g. Can you do ₹420?)"
                }
                className="flex-1 h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
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
