import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const {
    userRole,
    setUserRole,
    handleLogin,
    loginAsDemoUser,
    navigateTo,
    demoUsers,
    language,
  } = useApp();

  const isHindi = language === 'hi';

  const [phone, setPhone] = useState('98765 43210');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
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
      const demoUser = demoUsers[role] || demoUsers.customer;
      handleLogin(phone, role, demoUser.name);
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
    <div className="w-full max-w-lg mx-auto px-layout-margin-mobile py-2 sm:py-4 flex flex-col gap-4 pb-24 animate-fade-in">
      {/* Hero Header */}
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 self-center sm:self-start px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-black">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          <span>
            {isHindi
              ? '100% कामगार-स्वामित्व वाली सहकारी समिति • शून्य कमीशन'
              : '100% Worker-Owned Cooperative Platform • Zero Commission'}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-0.5">
          {isHindi ? 'सहयोग में आपका स्वागत है' : 'Welcome to SAHYOG'}
        </h1>
        <p className="text-xs text-on-surface-variant font-medium">
          {isHindi
            ? 'भारत का पहला लोकतांत्रिक सेवा मंच। 1-क्लिक डायरेक्ट डेमो लॉगिन चुनें:'
            : 'Select a demo persona below for 1-click evaluation access:'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CONCISE 1-CLICK DEMO ACCOUNTS FOR JUDGES / EVALUATORS */}
      {/* ========================================================================= */}
      <div className="bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 border-2 border-primary/30 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-surface-variant/30">
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[15px]">bolt</span>
            </span>
            <h2 className="text-xs sm:text-sm font-black text-on-surface">
              {isHindi ? 'त्वरित 1-क्लिक डेमो लॉगिन' : '1-Click Quick Demo Login'}
            </h2>
          </div>
          <span className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            {isHindi ? 'तुरंत एक्सेस' : 'Instant Access'}
          </span>
        </div>

        {/* 3 Compact Demo Cards */}
        <div className="flex flex-col gap-2">
          {/* 1. Customer Demo Card */}
          <button
            type="button"
            onClick={() => loginAsDemoUser('customer')}
            className="group w-full p-2.5 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-500 shadow-xs hover:shadow-sm transition-all active:scale-[0.99] text-left flex items-center gap-2.5"
          >
            <img
              src={demoUsers.customer.avatar}
              alt={demoUsers.customer.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-400 shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-emerald-950">
                  {demoUsers.customer.name}
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">
                  {isHindi ? demoUsers.customer.roleHindi : 'Customer / Resident'}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                {isHindi
                  ? 'शून्य कमीशन पर बुकिंग व 4-अंक पिन सुरक्षा'
                  : 'Book verified workers with ₹0 fee & 4-digit PIN escrow'}
              </p>
            </div>
            <span className="text-xs font-black text-white bg-emerald-600 group-hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1 shadow-xs">
              <span>{isHindi ? 'लॉगिन' : 'Login'}</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </span>
          </button>

          {/* 2. Worker-Owner Demo Card */}
          <button
            type="button"
            onClick={() => loginAsDemoUser('worker')}
            className="group w-full p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200 hover:border-amber-500 shadow-xs hover:shadow-sm transition-all active:scale-[0.99] text-left flex items-center gap-2.5"
          >
            <img
              src={demoUsers.worker.avatar}
              alt={demoUsers.worker.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400 shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-amber-950">
                  {demoUsers.worker.name}
                </span>
                <span className="text-[10px] text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                  {isHindi ? demoUsers.worker.roleHindi : 'Worker-Owner'}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                {isHindi
                  ? 'लाइव काम सूचनाएं, पिन से भुगतान रिलीज व 100% कमाई'
                  : 'Job dispatches, claim PIN payment & keep 100% earnings'}
              </p>
            </div>
            <span className="text-xs font-black text-white bg-amber-600 group-hover:bg-amber-700 px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1 shadow-xs">
              <span>{isHindi ? 'लॉगिन' : 'Login'}</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </span>
          </button>

          {/* 3. Cooperative Admin Demo Card */}
          <button
            type="button"
            onClick={() => loginAsDemoUser('admin')}
            className="group w-full p-2.5 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-500 shadow-xs hover:shadow-sm transition-all active:scale-[0.99] text-left flex items-center gap-2.5"
          >
            <img
              src={demoUsers.admin.avatar}
              alt={demoUsers.admin.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-400 shrink-0"
            />
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-indigo-950">
                  {demoUsers.admin.name}
                </span>
                <span className="text-[10px] text-indigo-900 bg-indigo-100 px-1.5 py-0.2 rounded font-bold">
                  {isHindi ? demoUsers.admin.roleHindi : 'Chapter Admin'}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                {isHindi
                  ? 'स्किल वीडियो रिव्यू, केवाईसी अप्रूवल व विवाद निपटारा'
                  : 'Review skill video benchmarks & arbitrate disputes'}
              </p>
            </div>
            <span className="text-xs font-black text-white bg-indigo-600 group-hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1 shadow-xs">
              <span>{isHindi ? 'लॉगिन' : 'Login'}</span>
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative flex py-0.5 items-center">
        <div className="flex-grow bg-surface-variant h-px"></div>
        <span className="flex-shrink mx-3 text-outline font-bold text-[11px] uppercase tracking-wider">
          {isHindi ? 'अथवा फोन व ओटीपी से लॉगिन करें' : 'or login with phone & OTP'}
        </span>
        <div className="flex-grow bg-surface-variant h-px"></div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: MANUAL PHONE & OTP AUTHENTICATION FORM */}
      {/* ========================================================================= */}
      <form
        onSubmit={handlePhoneSubmit}
        className="bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 shadow-sm border border-surface-variant/40 flex flex-col gap-3"
      >
        {/* Role Selector Tabs */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-black text-on-surface">
            {isHindi ? 'लॉगिन रोल चुनें' : 'Select Login Role'}
          </label>
          <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setRole('customer');
                setUserRole?.('customer');
                setPhone('98765 43210');
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                role === 'customer'
                  ? 'bg-surface-container-lowest text-emerald-800 shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">person</span>
              <span>{isHindi ? 'ग्राहक' : 'Customer'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('worker');
                setUserRole?.('worker');
                setPhone('98123 45678');
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                role === 'worker'
                  ? 'bg-surface-container-lowest text-amber-800 shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">handyman</span>
              <span>{isHindi ? 'कारीगर' : 'Worker'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setUserRole?.('admin');
                setPhone('94150 99881');
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                role === 'admin'
                  ? 'bg-surface-container-lowest text-indigo-800 shadow-xs'
                  : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
              <span>{isHindi ? 'एडमिन' : 'Admin'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Number Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-on-surface flex items-center justify-between">
            <span>{isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}</span>
            <span className="text-[10px] text-primary font-bold">10-Digit Indian SIM</span>
          </label>
          <div className="flex items-stretch gap-2">
            <div className="flex items-center gap-1 px-2.5 bg-surface-container-low rounded-xl text-on-surface flex-shrink-0 border border-surface-variant/40">
              <svg className="w-4 h-3 rounded-xs shadow-xs" viewBox="0 0 640 480">
                <path d="M0 0h640v160H0z" fill="#f93"></path>
                <path d="M0 160h640v160H0z" fill="#fff"></path>
                <path d="M0 320h640v160H0z" fill="#128807"></path>
                <circle cx="320" cy="240" fill="#008" r="40"></circle>
                <circle cx="320" cy="240" fill="#fff" r="32"></circle>
                <circle cx="320" cy="240" fill="#008" r="8"></circle>
              </svg>
              <span className="text-xs font-black text-on-surface">+91</span>
            </div>

            <input
              className="flex-1 h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all border border-surface-variant/40"
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

        {/* OTP Simulation Section */}
        {showOtp && (
          <div className="flex flex-col gap-1.5 pt-1.5 border-t border-surface-variant/30 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-on-surface">
                {isHindi ? '6-अंकों का ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
              </label>
              <span className="text-xs text-primary font-extrabold tabular-nums">
                {timer > 0 ? `00:${timer < 10 ? `0${timer}` : timer}` : 'Resend'}
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  className="h-10 rounded-xl bg-surface-container-low text-center text-sm font-black text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:outline-none tabular-nums border border-surface-variant/40"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  type="text"
                />
              ))}
            </div>
            <p className="text-[10px] text-green-700 bg-green-50 p-1.5 rounded-lg font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>
                {isHindi
                  ? 'डेमो ओटीपी (123456) दर्ज है। आगे बढ़ें।'
                  : 'Demo OTP pre-filled (123456). Click below to enter.'}
              </span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          className="w-full h-10 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container active:scale-[0.99] transition-all shadow-sm"
          type="submit"
        >
          <span>
            {showOtp
              ? isHindi
                ? 'ओटीपी सत्यापित कर आगे बढ़ें'
                : 'Verify OTP & Enter Platform'
              : isHindi
              ? 'ओटीपी भेजें व आगे बढ़ें'
              : 'Send OTP & Continue'}
          </span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>

        {/* Link to Register */}
        <div className="text-center pt-0.5">
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="text-xs text-primary font-bold hover:underline"
          >
            {isHindi
              ? 'सहयोग में नए हैं? नया खाता बनाएं'
              : 'New to SAHYOG? Register a new account'}
          </button>
        </div>
      </form>
    </div>
  );
};
