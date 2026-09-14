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
    isAuthenticated,
    handleLogout,
    cooperativeInfo,
    activeCityConfig,
    setLocationModalOpen,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isDetailPage = currentView === 'worker-detail' || currentView === 'booking';
  const isAuthScreen = currentView === 'login' || currentView === 'register';

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
      case 'profile':
        return t('navProfile');
      case 'login':
        return 'Demo Login';
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
        <div className="max-w-2xl mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-1.5">
          {/* Left: Back button or Logo + Title */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isDetailPage ? (
              <button
                onClick={() => navigateTo(currentView === 'booking' ? 'worker-detail' : 'workers')}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors shrink-0"
                aria-label="Back"
              >
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">arrow_back</span>
              </button>
            ) : null}

            {/* SAHYOG Brand Logo Mark - ALWAYS FULLY VISIBLE */}
            <div
              onClick={() => {
                if (isAuthenticated) {
                  if (userRole === 'worker') navigateTo('worker-dashboard');
                  else if (userRole === 'admin') navigateTo('admin-dashboard');
                  else navigateTo('home');
                } else {
                  navigateTo('login');
                }
              }}
              className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[19px] text-white material-symbols-fill">
                  handshake
                </span>
              </div>
              <div className="flex flex-col shrink-0">
                <span className="text-[17px] sm:text-[19px] text-primary tracking-tight leading-none font-black whitespace-nowrap">
                  {cooperativeInfo.name}
                </span>
                <span className="text-[10px] text-on-surface-variant leading-tight font-semibold whitespace-nowrap hidden sm:block">
                  {getSubTitle()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Group: Location + Language + Role Switcher / Profile */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Quick Location Badge & Selector */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-0.5 sm:gap-1 bg-surface-container hover:bg-surface-container-high px-1.5 sm:px-2 py-1 rounded-lg border border-surface-variant/40 text-[11px] sm:text-xs font-bold text-on-surface transition-all group shrink-0"
              title="Change City or Locality"
            >
              <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-primary material-symbols-fill group-hover:scale-110 transition-transform shrink-0">
                location_on
              </span>
              <span className="max-w-[62px] sm:max-w-[100px] truncate">
                {activeCityConfig?.name || cooperativeInfo.city}
              </span>
              <span className="material-symbols-outlined text-[11px] sm:text-[12px] text-outline shrink-0">
                expand_more
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-0.5 bg-surface-container px-1.5 sm:px-2 py-1 rounded-lg border border-surface-variant/40 text-[11px] sm:text-xs font-bold text-on-surface shrink-0">
              <span className="material-symbols-outlined text-[13px] sm:text-[15px] text-primary shrink-0">translate</span>
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-on-surface focus:outline-none cursor-pointer pr-0.5 font-semibold text-[11px] sm:text-xs"
              >
                <option value="en">EN</option>
                <option value="hi">हि</option>
                <option value="kn">ಕ</option>
                <option value="mr">म</option>
                <option value="ta">த</option>
              </select>
            </div>

            {/* If Logged In: Role / Profile Badge with Dropdown */}
            {isAuthenticated ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className={`min-h-[30px] sm:min-h-[34px] px-2 sm:px-2.5 py-1 flex items-center gap-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                    userRole === 'worker'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : userRole === 'admin'
                      ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                  title="Switch between Customer, Worker-Owner, Admin or View Profile"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full object-cover shrink-0"
                  />
                  <span className="hidden sm:inline max-w-[75px] truncate">
                    {currentUser?.name?.split(' ')[0] || getRoleLabel().split(' ')[0]}
                  </span>
                  <span className="material-symbols-outlined text-[11px] sm:text-[12px] shrink-0">expand_more</span>
                </button>

                {/* Role & Profile Dropdown Menu */}
                {roleMenuOpen && (
                  <div className="absolute right-0 top-10 mt-1 w-52 bg-white rounded-xl shadow-xl border border-surface-variant/60 py-1.5 z-50 animate-fade-in text-on-surface text-xs font-medium">
                    <div className="px-3 py-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-surface-variant/30">
                      Switch Demo Role
                    </div>
                    <button
                      onClick={() => {
                        switchRole('customer');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                        userRole === 'customer' ? 'font-bold text-emerald-800 bg-emerald-50' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">person</span>
                      <span>Customer (Priya)</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRole('worker');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                        userRole === 'worker' ? 'font-bold text-amber-800 bg-amber-50' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-amber-600">handyman</span>
                      <span>Worker (Awadhesh)</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRole('admin');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                        userRole === 'admin' ? 'font-bold text-indigo-800 bg-indigo-50' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-600">admin_panel_settings</span>
                      <span>Admin (Dr. Varma)</span>
                    </button>

                    <div className="border-t border-surface-variant/30 my-1"></div>

                    {/* Go to Profile */}
                    <button
                      onClick={() => {
                        navigateTo('profile');
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low text-primary font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">account_circle</span>
                      <span>View Demo Profile</span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-red-50 text-red-600 font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigateTo('login')}
                className="min-h-[30px] sm:min-h-[34px] px-2.5 sm:px-3 py-1 flex items-center gap-1 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-all shadow-xs shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">login</span>
                <span>Demo Login</span>
              </button>
            )}
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
