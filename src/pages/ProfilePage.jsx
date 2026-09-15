import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProfilePage = () => {
  const {
    currentUser,
    userRole,
    loginAsDemoUser,
    handleLogout,
    navigateTo,
    language,
    setLanguage,
    selectedLocality,
    activeCityConfig,
    setLocationModalOpen,
    setAuditReportModalOpen,
    demoUsers,
    workerOnDuty,
    setWorkerOnDuty,
    workerEarnings,
    bookings,
    kycQueue,
  } = useApp();

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Active bookings count
  const activeEscrowBookings = (bookings || []).filter((b) => b.status === 'escrow_locked').length;
  const pendingKycCount = (kycQueue || []).filter((k) => k.status === 'pending').length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 pb-28 md:pb-16 animate-fade-in">
      {/* SIH Judge Demo Helper Ribbon */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                Demo Account Profile
              </span>
              <span className="bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                Active Demo
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              You are logged in as{' '}
              <strong className="text-on-surface">
                {currentUser?.name || 'Demo User'} ({currentUser?.roleTitle || userRole})
              </strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
          className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-all shrink-0 flex items-center gap-1 active:scale-95"
        >
          <span className="material-symbols-outlined text-[15px]">logout</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Profile Identity Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-variant/40 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Avatar with Status Ring */}
          <div className="relative shrink-0">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover ring-4 ring-primary/20 shadow-md"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs"
              title="Online & Verified"
            >
              <span className="material-symbols-outlined text-[12px] text-white material-symbols-fill">
                check
              </span>
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left flex flex-col gap-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                {currentUser?.name}
              </h2>
              <span
                className={`self-center sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tracking-wide border shadow-xs ${
                  userRole === 'worker'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : userRole === 'admin'
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {userRole === 'worker'
                    ? 'handyman'
                    : userRole === 'admin'
                    ? 'admin_panel_settings'
                    : 'person'}
                </span>
                <span>{currentUser?.roleTitle || (userRole === 'worker' ? 'Worker-Owner' : userRole === 'admin' ? 'Chapter Admin' : 'Resident')}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant flex items-center justify-center sm:justify-start gap-1 font-medium">
              <span className="material-symbols-outlined text-[15px] text-primary">phone_iphone</span>
              <span className="font-semibold text-on-surface">+91 {currentUser?.phone}</span>
              <span className="mx-1 text-outline">•</span>
              <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
              <span className="truncate">{selectedLocality || currentUser?.locality}, {activeCityConfig?.name}</span>
            </p>

            {currentUser?.email && (
              <p className="text-xs text-on-surface-variant flex items-center justify-center sm:justify-start gap-1 font-medium">
                <span className="material-symbols-outlined text-[15px] text-primary">mail</span>
                <span>{currentUser.email}</span>
              </p>
            )}

            {/* Tagline */}
            {currentUser?.tagline && (
              <p className="text-xs text-primary font-semibold mt-1 bg-primary-fixed/20 px-2.5 py-1 rounded-lg self-center sm:self-start">
                💡 {currentUser.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Badges and Official Verification Chips */}
        <div className="pt-3 border-t border-surface-variant/30 flex flex-wrap items-center gap-2">
          {currentUser?.memberId && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-bold border border-surface-variant/50">
              <span className="material-symbols-outlined text-[15px] text-primary">badge</span>
              <span>ID: {currentUser.memberId}</span>
            </span>
          )}

          {currentUser?.eShramId && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-900 text-xs font-bold border border-orange-200">
              <span className="material-symbols-outlined text-[15px] text-orange-600">verified</span>
              <span>{currentUser.eShramId}</span>
            </span>
          )}

          {currentUser?.digiLockerStatus && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
              <span className="material-symbols-outlined text-[15px] text-blue-600">lock</span>
              <span>{currentUser.digiLockerStatus}</span>
            </span>
          )}

          {currentUser?.skillAssessmentGrade && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">military_tech</span>
              <span>{currentUser.skillAssessmentGrade}</span>
            </span>
          )}

          {currentUser?.coopRegNumber && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 text-xs font-bold border border-purple-200">
              <span className="material-symbols-outlined text-[15px] text-purple-600">account_balance</span>
              <span>{currentUser.coopRegNumber}</span>
            </span>
          )}
        </div>
      </div>

      {/* Role-Specific Dynamic Metrics Panel */}
      {userRole === 'customer' && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">account_balance_wallet</span>
              <span>Customer Escrow & Savings Summary</span>
            </h3>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              ₹0 Commission Benefit
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">Active Escrow</span>
              <span className="text-lg font-black text-primary">{activeEscrowBookings} Ongoing</span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">Services Completed</span>
              <span className="text-lg font-black text-on-surface">14 Jobs</span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">Platform Fee Saved</span>
              <span className="text-lg font-black text-emerald-700">₹1,420 Saved</span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">Escrow Protection</span>
              <span className="text-lg font-black text-secondary">100% Guaranteed</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => navigateTo('bookings')}
              className="flex-1 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>View All Bookings & Escrow PINs</span>
            </button>
            <button
              onClick={() => navigateTo('workers')}
              className="flex-1 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 border border-surface-variant/40 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Book Local Karigar</span>
            </button>
          </div>
        </div>
      )}

      {userRole === 'worker' && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">payments</span>
              <span>Worker-Owner Earnings & Co-op Dividends</span>
            </h3>
            <button
              onClick={() => setWorkerOnDuty(!workerOnDuty)}
              className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 transition-all ${
                workerOnDuty
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${workerOnDuty ? 'bg-green-600 animate-pulse' : 'bg-outline'}`}></span>
              <span>{workerOnDuty ? 'On Duty (Available)' : 'Off Duty'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-amber-50/70 p-3 rounded-xl flex flex-col gap-0.5 border border-amber-200">
              <span className="text-[11px] text-amber-900 font-semibold">Today's Labour</span>
              <span className="text-lg font-black text-amber-950">₹{workerEarnings.today}</span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">This Week</span>
              <span className="text-lg font-black text-on-surface">₹{workerEarnings.week}</span>
            </div>
            <div className="bg-emerald-50/70 p-3 rounded-xl flex flex-col gap-0.5 border border-emerald-200">
              <span className="text-[11px] text-emerald-900 font-semibold">Co-op Dividend</span>
              <span className="text-lg font-black text-emerald-950">+₹{workerEarnings.dividend}</span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">Commission Cut</span>
              <span className="text-lg font-black text-green-700">₹0 (0%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => navigateTo('worker-dashboard')}
              className="flex-1 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">engineering</span>
              <span>Go to Worker Dashboard & Claim PIN</span>
            </button>
          </div>
        </div>
      )}

      {userRole === 'admin' && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-indigo-600 text-[18px]">admin_panel_settings</span>
              <span>District Cooperative Chapter Oversight</span>
            </h3>
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
              District Nodal Officer
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-indigo-50/70 p-3 rounded-xl flex flex-col gap-0.5 border border-indigo-200">
              <span className="text-[11px] text-indigo-900 font-semibold">Pending KYC</span>
              <span className="text-lg font-black text-indigo-950">{pendingKycCount} Applicants</span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">Registered Co-Owners</span>
              <span className="text-lg font-black text-on-surface">428 Members</span>
            </div>
            <div className="bg-surface-container p-3 rounded-xl flex flex-col gap-0.5 border border-surface-variant/30">
              <span className="text-[11px] text-on-surface-variant font-semibold">Direct Earnings Disbursed</span>
              <span className="text-lg font-black text-primary">₹18.4 Lakhs</span>
            </div>
            <div className="bg-emerald-50/70 p-3 rounded-xl flex flex-col gap-0.5 border border-emerald-200">
              <span className="text-[11px] text-emerald-900 font-semibold">Escrow Protection</span>
              <span className="text-lg font-black text-emerald-950">99.8% Success</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => navigateTo('admin-dashboard')}
              className="flex-1 h-10 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Open Admin KYC & Dispute Console</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Judge Demo Switcher Cards */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant/40 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">switch_account</span>
            <h3 className="text-sm font-black text-on-surface">
              {language === 'hi' ? 'डेमो रोल स्विच करें' : 'Switch Demo Persona'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-on-surface-variant">1-Click Direct Access</span>
        </div>

        <p className="text-xs text-on-surface-variant">
          Click any demo account below to instantly experience SAHYOG from different stakeholder perspectives:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Demo Customer Card */}
          <button
            type="button"
            onClick={() => loginAsDemoUser('customer')}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all active:scale-[0.98] ${
              userRole === 'customer'
                ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300/40 shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high border-surface-variant/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">person</span>
                <span>Customer</span>
              </span>
              {userRole === 'customer' && (
                <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  CURRENT
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-on-surface">Priya Sharma</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              Civil Lines, Sultanpur • ₹0 Commission Escrow Booking
            </span>
          </button>

          {/* Demo Worker Card */}
          <button
            type="button"
            onClick={() => loginAsDemoUser('worker')}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all active:scale-[0.98] ${
              userRole === 'worker'
                ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300/40 shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high border-surface-variant/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-amber-600">handyman</span>
                <span>Worker-Owner</span>
              </span>
              {userRole === 'worker' && (
                <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  CURRENT
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-on-surface">Awadhesh Sharma</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              Co-Owner #101 • PIN Escrow Claim & Dividends
            </span>
          </button>

          {/* Demo Admin Card */}
          <button
            type="button"
            onClick={() => loginAsDemoUser('admin')}
            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all active:scale-[0.98] ${
              userRole === 'admin'
                ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-300/40 shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high border-surface-variant/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-indigo-600">admin_panel_settings</span>
                <span>Co-op Admin</span>
              </span>
              {userRole === 'admin' && (
                <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  CURRENT
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-on-surface">Dr. Rajeshwar Varma</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              District Nodal Officer • KYC & Dispute Tribunal
            </span>
          </button>
        </div>
      </div>

      {/* Account Settings & Quick Preferences */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-variant/40 flex flex-col gap-2">
        <h3 className="text-sm font-black text-on-surface mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">settings</span>
          <span>Preferences & Cooperative Tools</span>
        </h3>

        {/* Change City/Locality */}
        <button
          type="button"
          onClick={() => setLocationModalOpen(true)}
          className="w-full p-3 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-between text-left border border-surface-variant/30 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Current City & Locality</span>
              <span className="text-[11px] text-on-surface-variant">
                {selectedLocality}, {activeCityConfig?.name} (Change Region)
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
        </button>

        {/* Language Selection */}
        <div className="w-full p-3 rounded-xl bg-surface-container flex items-center justify-between text-left border border-surface-variant/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">translate</span>
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">App Language</span>
              <span className="text-[11px] text-on-surface-variant">Selected: {language.toUpperCase()}</span>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-surface-container-high text-on-surface text-xs font-bold px-2 py-1.5 rounded-lg border border-surface-variant/40 focus:outline-none cursor-pointer"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="kn">ಕನ್ನಡ (KN)</option>
            <option value="mr">मराठी (MR)</option>
            <option value="ta">தமிழ் (TA)</option>
          </select>
        </div>

        {/* Cooperative Welfare & Direct Payout Transparency */}
        <button
          type="button"
          onClick={() => setAuditReportModalOpen(true)}
          className="w-full p-3 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-between text-left border border-surface-variant/30 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Cooperative Welfare & Direct Payouts Log</span>
              <span className="text-[11px] text-on-surface-variant">View ₹0 Commission & Escrow Audited Proof</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">open_in_new</span>
        </button>
      </div>

      {/* Prominent Red Logout Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setLogoutConfirmOpen(true)}
          className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>{language === 'hi' ? 'डेमो अकाउंट से लॉगआउट करें' : 'Logout of Demo Account'}</span>
        </button>
        <p className="text-center text-[11px] text-on-surface-variant mt-2">
          Logging out returns to the Login Screen where you can choose another Demo role or enter credentials.
        </p>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-surface-variant/60 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center self-center">
              <span className="material-symbols-outlined text-[28px]">logout</span>
            </div>

            <div className="text-center flex flex-col gap-1">
              <h3 className="text-lg font-black text-on-surface">Confirm Logout?</h3>
              <p className="text-xs text-on-surface-variant">
                Are you sure you want to log out of <strong>{currentUser?.name}</strong>'s demo session? You will be returned to the main Login screen.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-surface-variant/40 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutConfirmOpen(false);
                  handleLogout();
                }}
                className="h-10 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
                <span>Yes, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
