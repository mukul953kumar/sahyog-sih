import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const {
    t,
    currentView,
    navigateTo,
    language,
    setLanguage,
    userRole,
    switchRole,
    currentUser,
    cooperativeInfo,
    activeCityConfig,
    setLocationModalOpen,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isDetailPage = currentView === 'worker-detail' || currentView === 'booking';

  const getSubTitle = () => {
    switch (currentView) {
      case 'home':
        return t('navHome');
      case 'workers':
        return t('navServices');
      case 'worker-detail':
        return 'Service Detail';
      case 'booking':
        return t('bookingCheckout');
      case 'bookings':
        return t('navBookings');
      case 'community':
        return t('navCommunity');
      case 'worker-dashboard':
        return t('navWorkerDash');
      case 'admin-dashboard':
        return t('navAdminDash');
      case 'login':
        return t('navProfile');
      case 'register':
        return 'Register';
      default:
        return 'Cooperative';
    }
  };

  const getRoleLabel = () => {
    if (userRole === 'worker') return t('roleWorker');
    if (userRole === 'admin') return t('roleAdmin');
    return t('roleCustomer');
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-variant/40">
        <div className="max-w-2xl mx-auto h-16 px-layout-margin-mobile flex items-center justify-between gap-2">
          {/* Left: Back button or Logo + Title */}
          <div className="flex items-center gap-2">
            {isDetailPage ? (
              <button
                onClick={() => navigateTo(currentView === 'booking' ? 'worker-detail' : 'workers')}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors"
                aria-label="Back"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
            ) : null}

            {/* SAHYOG Brand Logo Mark */}
            <div
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
                <span className="material-symbols-outlined text-[20px] text-white material-symbols-fill">
                  handshake
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-tight font-black">
                  {cooperativeInfo.name}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none font-semibold">
                  {getSubTitle()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Group: Location + Language + Role Switcher */}
          <div className="flex items-center gap-1.5">
            {/* Quick Location Badge & Selector */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1 bg-surface-container hover:bg-surface-container-high px-2 py-1.5 rounded-lg border border-surface-variant/40 text-xs font-bold text-on-surface transition-all group"
              title="Change City or Locality"
            >
              <span className="material-symbols-outlined text-[16px] text-primary material-symbols-fill group-hover:scale-110 transition-transform">
                location_on
              </span>
              <span className="max-w-[70px] sm:max-w-[100px] truncate">
                {activeCityConfig?.name || cooperativeInfo.city}
              </span>
              <span className="material-symbols-outlined text-[12px] text-outline">
                expand_more
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-surface-container px-2 py-1.5 rounded-lg border border-surface-variant/40 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-[16px] text-primary">translate</span>
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-on-surface focus:outline-none cursor-pointer pr-1 font-semibold"
              >
                <option value="en">EN</option>
                <option value="hi">हिन्दी</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="mr">मराठी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>

            {/* Role Switcher Badge Button */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`min-h-[34px] px-2.5 py-1 flex items-center gap-1 rounded-lg text-xs font-bold transition-all ${
                  userRole === 'worker'
                    ? 'bg-primary-fixed text-on-primary-fixed border border-primary/30'
                    : userRole === 'admin'
                    ? 'bg-secondary-container text-on-secondary-container border border-secondary/30'
                    : 'bg-surface-container-high text-on-surface border border-surface-variant/50'
                }`}
                title="Switch between Customer, Worker-Owner, or Admin"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {userRole === 'worker'
                    ? 'handyman'
                    : userRole === 'admin'
                    ? 'admin_panel_settings'
                    : 'person'}
                </span>
                <span className="max-w-[70px] truncate">{getRoleLabel().split(' ')[0]}</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>

              {/* Role Dropdown Menu */}
              {roleMenuOpen && (
                <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-xl shadow-xl border border-surface-variant/60 py-1.5 z-50 animate-fade-in text-on-surface text-xs font-medium">
                  <div className="px-3 py-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-surface-variant/30">
                    Switch App Role
                  </div>
                  <button
                    onClick={() => {
                      switchRole('customer');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                      userRole === 'customer' ? 'font-bold text-primary bg-primary-fixed/20' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">home</span>
                    <span>{t('roleCustomer')}</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('worker');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                      userRole === 'worker' ? 'font-bold text-primary bg-primary-fixed/20' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">handyman</span>
                    <span>{t('roleWorker')}</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                      userRole === 'admin' ? 'font-bold text-secondary bg-secondary-container/40' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    <span>{t('roleAdmin')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop for closing role dropdown */}
      {roleMenuOpen && (
        <div
          onClick={() => setRoleMenuOpen(false)}
          className="fixed inset-0 z-40 bg-transparent"
        ></div>
      )}
    </>
  );
};
