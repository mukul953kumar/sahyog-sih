import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const { userRole, setUserRole, handleLogin, navigateTo } = useApp();

  const [phone, setPhone] = useState('98765 43210');
  const [selectedLang, setSelectedLang] = useState('en');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [role, setRole] = useState(userRole || 'customer');

  useEffect(() => {
    let interval;
    if (showOtp && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!showOtp) {
      setShowOtp(true);
      setTimer(45);
    } else {
      handleLogin(phone, role, role === 'worker' ? 'Ramesh Kumar' : 'Priya Sharma');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-layout-margin-mobile py-space-md flex flex-col pb-24">
      {/* Top Utility Bar: Language Selector & Quick Help */}
      <div className="flex items-center justify-between py-space-sm">
        <div className="flex items-center gap-space-xxs bg-surface-container px-space-sm py-1.5 rounded-lg border border-surface-variant/40">
          <span className="material-symbols-outlined text-primary text-[18px]">translate</span>
          <select
            className="bg-transparent text-on-surface font-label-md text-label-md focus:outline-none pr-1 cursor-pointer"
            id="langSelect"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="mr">मराठी</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
        <a
          className="flex items-center gap-1 text-primary font-label-md text-label-md bg-secondary-container/40 px-2.5 py-1.5 rounded-lg hover:bg-secondary-container/70 active:scale-95 transition-all border border-secondary/20"
          href="tel:1800724964"
        >
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          <span>Helpline</span>
        </a>
      </div>

      {/* Warm Cooperative Hero Banner */}
      <div className="mt-space-xs mb-space-lg flex flex-col gap-space-xxs">
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          <span>Worker-Owned Cooperative Enterprise</span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-black tracking-tight mt-1">
          Welcome to SAHYOG
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Enter your mobile number to access certified local services or manage your worker-owner dividend dashboard.
        </p>
      </div>

      {/* Dual Role Segmented Tab Switcher */}
      <div className="bg-surface-container p-1 rounded-xl flex flex-col gap-2 mb-space-lg shadow-xs border border-surface-variant/30">
        <div className="grid grid-cols-2 gap-1" role="tablist">
          <button
            className={`py-3 px-2 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'customer'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface font-semibold'
            }`}
            onClick={() => {
              setRole('customer');
              setUserRole('customer');
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>Customer / Resident</span>
          </button>
          <button
            className={`py-3 px-2 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'worker'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface font-semibold'
            }`}
            onClick={() => {
              setRole('worker');
              setUserRole('worker');
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">handyman</span>
            <span>Worker-Owner</span>
          </button>
        </div>

        <div className="px-2 py-1 flex items-center gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-[16px] flex-shrink-0">
            info
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {role === 'customer'
              ? 'Book verified electricians, plumbers, carpenters & domestic support at transparent cooperative rates.'
              : 'Keep 100% of your labour earnings, access cooperative healthcare and participate in democratic chapter votes.'}
          </p>
        </div>
      </div>

      {/* Primary Authentication Form */}
      <form
        onSubmit={handlePhoneSubmit}
        className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40 flex flex-col gap-space-md"
      >
        {/* Phone Input Block */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between font-bold">
            <span>Mobile Number</span>
            <span className="font-label-sm text-label-sm text-primary font-bold">
              10-Digit Indian SIM
            </span>
          </label>
          <div className="flex items-stretch gap-2">
            {/* Country Code Block */}
            <div className="flex items-center gap-1.5 px-3 bg-surface-container-low rounded-lg text-on-surface flex-shrink-0 border border-surface-variant/30">
              <svg className="w-5 h-3.5 rounded-xs shadow-xs" viewBox="0 0 640 480">
                <path d="M0 0h640v160H0z" fill="#f93"></path>
                <path d="M0 160h640v160H0z" fill="#fff"></path>
                <path d="M0 320h640v160H0z" fill="#128807"></path>
                <circle cx="320" cy="240" fill="#008" r="40"></circle>
                <circle cx="320" cy="240" fill="#fff" r="32"></circle>
                <circle cx="320" cy="240" fill="#008" r="8"></circle>
              </svg>
              <span className="font-body-lg text-body-lg font-bold text-on-surface">+91</span>
            </div>

            {/* Phone Number Input */}
            <div className="relative flex-1">
              <input
                className="w-full h-12 px-3.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-lg text-body-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all tabular-nums border border-surface-variant/30"
                id="mobileInput"
                maxLength={12}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                type="tel"
                required
              />
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[15px] text-secondary">sms</span>
            <span>A fast 6-digit one-time code will be dispatched via secure SMS.</span>
          </p>
        </div>

        {/* OTP Section */}
        {showOtp && (
          <div className="flex flex-col gap-space-sm pt-space-xs border-t border-surface-variant/30 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="font-label-lg text-label-lg text-on-surface font-bold">
                Enter 6-Digit OTP
              </label>
              <span className="font-label-sm text-label-sm text-tertiary-container font-extrabold tabular-nums">
                {timer > 0 ? `Resend in 00:${timer < 10 ? `0${timer}` : timer}` : 'Resend available'}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  className="otp-box h-12 rounded-lg bg-surface-container-low text-center font-headline-sm text-headline-sm text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none tabular-nums border border-surface-variant/40"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  type="text"
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-body-sm font-body-sm pt-1">
              <button
                className={`transition-colors font-medium ${
                  timer === 0 ? 'text-primary hover:underline' : 'text-outline cursor-not-allowed'
                }`}
                disabled={timer > 0}
                onClick={() => setTimer(45)}
                type="button"
              >
                Resend via SMS
              </button>
              <button
                className="text-secondary hover:underline flex items-center gap-1 font-label-md text-label-md"
                type="button"
                onClick={() => alert('OTP: 123456 sent to your WhatsApp')}
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <button
          className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 active:bg-primary-container transition-all shadow-sm"
          type="submit"
        >
          <span>{showOtp ? 'Verify & Enter SAHYOG' : 'Get OTP & Continue'}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        {/* Alternative Fast Channels */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow bg-surface-variant h-px"></div>
          <span className="flex-shrink mx-3 text-outline font-label-sm text-label-sm uppercase tracking-wider">
            or sign in with
          </span>
          <div className="flex-grow bg-surface-variant h-px"></div>
        </div>

        <div className="grid grid-cols-2 gap-space-xs">
          {/* WhatsApp Quick Access */}
          <button
            onClick={() => handleLogin('98765 43210', role, 'WhatsApp Verified')}
            className="h-11 rounded-lg bg-surface-container-low hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 px-3 text-on-surface font-label-md text-label-md border border-surface-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] text-green-600">chat</span>
            <span className="truncate font-semibold">WhatsApp</span>
          </button>
          {/* Google Sign-in */}
          <button
            onClick={() => handleLogin('98765 43210', role, 'Google Verified')}
            className="h-11 rounded-lg bg-surface-container-low hover:bg-surface-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 px-3 text-on-surface font-label-md text-label-md border border-surface-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px] text-blue-600">account_circle</span>
            <span className="truncate font-semibold">Google</span>
          </button>
        </div>

        {/* Link to Register */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="font-label-md text-primary font-bold hover:underline"
          >
            New to SAHYOG? Create an account
          </button>
        </div>
      </form>
    </div>
  );
};
