import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RegisterPage = () => {
  const { handleLogin, navigateTo } = useApp();

  const [role, setRole] = useState('customer');
  const [fullName, setFullName] = useState('Priya Sharma');
  const [phone, setPhone] = useState('98765 43210');
  const [trade, setTrade] = useState('electrician');
  const [locality, setLocality] = useState('Indiranagar, Ward 112');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(phone, role, fullName);
  };

  return (
    <div className="w-full max-w-md mx-auto pb-28">
      {/* Progress Header & Context */}
      <section className="px-layout-margin-mobile pt-space-md pb-space-sm bg-surface-container-lowest">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-label-md text-label-md text-primary tracking-wide uppercase font-extrabold">
            Registration
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant font-bold">
            Step 1 of 2
          </span>
        </div>
        {/* Progress Indicator Bar */}
        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden flex">
          <div className="bg-primary w-1/2 h-full rounded-full transition-all duration-300"></div>
          <div className="bg-transparent w-1/2 h-full"></div>
        </div>
        <div className="mt-space-md">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-black tracking-tight">
            Create your SAHYOG account
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xxs">
            Join India's worker-owned cooperative marketplace. Transparent, fair, and community-driven.
          </p>
        </div>
      </section>

      {/* Interactive Content Form Area */}
      <form onSubmit={handleSubmit} className="px-layout-margin-mobile py-space-sm space-y-space-lg">
        {/* Role Selection Selector */}
        <fieldset className="space-y-space-xs">
          <legend className="font-label-lg text-label-lg text-on-surface font-bold mb-space-xs flex items-center gap-1.5">
            <span>Choose your account role</span>
            <span className="text-error font-bold">*</span>
          </legend>

          {/* Customer Account Card */}
          <label
            onClick={() => setRole('customer')}
            className={`relative block p-space-md rounded-xl bg-surface-container-lowest shadow-xs cursor-pointer transition-all duration-150 border ${
              role === 'customer'
                ? 'border-primary ring-2 ring-primary/20 bg-primary-fixed/5'
                : 'border-surface-variant/40 hover:border-primary/50'
            }`}
          >
            <input
              checked={role === 'customer'}
              onChange={() => setRole('customer')}
              className="sr-only"
              name="account_role"
              type="radio"
              value="customer"
            />
            <div className="flex items-start gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[24px]">home_repair_service</span>
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-space-xs">
                  <span className="font-title-md text-title-md text-on-surface font-extrabold">
                    I Need Home Services
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Verified neighborhood technicians, standard transparent pricing & 100% escrow protection.
                </p>
              </div>
              {/* Radio Mark */}
              <div
                className={`absolute top-space-md right-space-md w-5 h-5 rounded-full flex items-center justify-center ${
                  role === 'customer'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
            </div>
          </label>

          {/* Worker-Owner Card */}
          <label
            onClick={() => setRole('worker')}
            className={`relative block p-space-md rounded-xl bg-surface-container-lowest shadow-xs cursor-pointer transition-all duration-150 border ${
              role === 'worker'
                ? 'border-primary ring-2 ring-primary/20 bg-primary-fixed/5'
                : 'border-surface-variant/40 hover:border-primary/50'
            }`}
          >
            <input
              checked={role === 'worker'}
              onChange={() => setRole('worker')}
              className="sr-only"
              name="account_role"
              type="radio"
              value="worker"
            />
            {/* Co-op Badge */}
            <div className="mb-space-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Co-op Member • 0% Commission</span>
            </div>
            <div className="flex items-start gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[24px]">engineering</span>
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-space-xs">
                  <span className="font-title-md text-title-md text-on-surface font-extrabold">
                    I am a Skilled Tradesperson
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Become an equal cooperative co-owner, keep 100% of your labor fee, DigiLocker & e-Shram verified.
                </p>
              </div>
              {/* Radio Mark */}
              <div
                className={`absolute top-space-md right-space-md w-5 h-5 rounded-full flex items-center justify-center ${
                  role === 'worker'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
            </div>
          </label>
        </fieldset>

        {/* Worker-Specific Guild Panel */}
        {role === 'worker' && (
          <div className="space-y-space-md p-space-md rounded-xl bg-surface-container-low shadow-xs border border-surface-variant/40 animate-fade-in">
            <div className="flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">badge</span>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Trade Qualification</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Select your primary trade guild.
                </p>
              </div>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Primary Trade Guild <span className="text-error font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full h-12 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg px-space-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-surface-variant/40"
                >
                  <option value="electrician">Certified Electrician (विद्युत कर्मी)</option>
                  <option value="plumber">Plumber & Pipe Specialist (प्लंबर)</option>
                  <option value="carpenter">Master Carpenter (बढ़ई)</option>
                  <option value="appliance">AC & Home Appliance Technician</option>
                  <option value="painter">House Painter & Finisher</option>
                  <option value="masonry">Masonry & Civil Maintenance</option>
                </select>
                <span className="material-symbols-outlined text-on-surface-variant absolute right-space-md top-3 pointer-events-none text-[24px]">
                  expand_more
                </span>
              </div>
            </div>
            {/* DigiLocker Instant Auth Reminder */}
            <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center gap-space-sm shadow-xs border border-surface-variant/30">
              <div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-label-md text-label-md text-on-surface font-bold">
                  Instant Paperless Onboarding
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  e-Shram card & Aadhaar verified in Step 2 via DigiLocker.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Core Contact Form */}
        <div className="space-y-space-md">
          {/* Full Name */}
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface font-semibold mb-1.5">
              Full Name (as per Aadhaar / Official ID) <span className="text-error font-bold">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full h-12 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg px-space-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-surface-variant/40"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar or Priya Sharma"
                type="text"
                required
              />
              <span className="material-symbols-outlined text-outline absolute right-space-md pointer-events-none text-[20px]">
                person
              </span>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-label-lg text-label-lg text-on-surface font-semibold">
                Mobile Phone Number <span className="text-error font-bold">*</span>
              </label>
              <span className="font-label-sm text-label-sm text-primary font-bold">
                Govt OTP Verified
              </span>
            </div>
            <div className="flex gap-space-xs">
              <div className="flex items-center px-3 bg-surface-container-low rounded-lg text-on-surface border border-surface-variant/40 font-bold">
                +91
              </div>
              <input
                className="flex-1 h-12 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg px-space-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-surface-variant/40 tabular-nums"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
              />
            </div>
          </div>

          {/* Locality */}
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface font-semibold mb-1.5">
              Service Ward / Residential Colony
            </label>
            <input
              className="w-full h-12 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg px-space-md focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-surface-variant/40"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              type="text"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-primary text-on-primary font-title-md text-title-md font-bold flex items-center justify-center gap-2 shadow-sm active:bg-primary-container"
          >
            <span>Continue to DigiLocker Step 2</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="font-label-md text-primary font-bold hover:underline"
          >
            Already have an account? Sign In
          </button>
        </div>
      </form>
    </div>
  );
};
