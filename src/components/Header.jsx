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
    bookings,
    openLiveTracking,
    setEmergencyModalOpen,
    setAuditReportModalOpen,
    setSkillAssessmentModalWorker,
    currentWorker,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isDetailPage = currentView === 'worker-detail' || currentView === 'booking';
  const isAuthScreen = currentView === 'login' || currentView === 'register';

  const activeEscrowBookings = (bookings || []).filter((b) => b.status === 'escrow_locked').length;

  // Desktop navigation links
  const getDesktopNavLinks = () => {
    if (userRole === 'worker') {
      return [
        { id: 'worker-dashboard', label: 'Worker Hub', icon: 'engineering' },
        { id: 'bookings', label: 'Jobs & Payouts', icon: 'event_note', badge: activeEscrowBookings },
        { id: 'community', label: 'Co-op Welfare', icon: 'shield_with_heart' },
      ];
    } else if (userRole === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Admin Console', icon: 'admin_panel_settings' },
        { id: 'bookings', label: 'Disputes & Escrow', icon: 'gavel', badge: activeEscrowBookings },
        { id: 'community', label: 'Community & Welfare', icon: 'diversity_3' },
      ];
    } else {
      return [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'workers', label: 'Services', icon: 'grid_view' },
        { id: 'bookings', label: 'Bookings', icon: 'event_note', badge: activeEscrowBookings },
        { id: 'community', label: 'Community & Welfare', icon: 'diversity_3' },
      ];
    }
  };

  const navLinks = getDesktopNavLinks();

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-xs border-b border-surface-variant/40">
        <div className="max-w-6xl mx-auto h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Hamburger (Mobile) + Brand Logo & Title */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Hamburger Button */}
            {!isAuthScreen && (
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-on-surface hover:bg-surface-container active:scale-95 transition-all shrink-0"
                aria-label="Open Navigation Menu"
              >
                <span className="material-symbols-outlined text-[24px]">menu</span>
              </button>
            )}

            {isDetailPage ? (
              <button
                type="button"
                onClick={() => navigateTo(currentView === 'booking' ? 'worker-detail' : 'workers')}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors shrink-0"
                aria-label="Back"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            ) : null}

            {/* SAHYOG Brand Logo */}
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
              className="flex items-center gap-2 cursor-pointer select-none shrink-0 group"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px] material-symbols-fill">
                  handshake
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black text-primary tracking-tight leading-none">
                  {cooperativeInfo.name}
                </span>
                <span className="text-[9px] sm:text-[10px] text-on-surface-variant font-bold leading-tight uppercase tracking-wider">
                  Cooperative Platform
                </span>
              </div>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar (Visible on md and larger screens) */}
          {isAuthenticated && !isAuthScreen && (
            <nav className="hidden md:flex items-center gap-1 bg-surface-container-low/80 p-1 rounded-2xl border border-surface-variant/30 shadow-2xs">
              {navLinks.map((link) => {
                const isActive =
                  currentView === link.id ||
                  (link.id === 'workers' && currentView === 'worker-detail') ||
                  (link.id === 'bookings' && currentView === 'booking');

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => navigateTo(link.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
                    <span>{link.label}</span>
                    {link.badge > 0 ? (
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white text-primary' : 'bg-secondary text-white'
                        }`}
                      >
                        {link.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Group: Location + Language + Role Switcher / Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Live GPS Active Tracking Pill */}
            {activeEscrowBookings > 0 && !isAuthScreen && (
              <button
                type="button"
                onClick={() => openLiveTracking()}
                className="flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 px-2 sm:px-2.5 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-bold transition-all shadow-xs active:scale-95 group shrink-0"
                title="Open Live GPS Tracking Map"
              >
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-amber-300 font-extrabold text-[11px] hidden sm:inline">LIVE MAP</span>
                <span className="material-symbols-outlined text-[15px] text-amber-300 sm:hidden">location_on</span>
              </button>
            )}

            {/* Quick Location Badge & Selector */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1 bg-surface-container-low hover:bg-surface-container px-2 sm:px-2.5 py-1.5 rounded-xl border border-surface-variant/40 text-xs font-bold text-on-surface transition-all group shrink-0"
              title="Change City or Locality"
            >
              <span className="material-symbols-outlined text-[15px] text-primary material-symbols-fill group-hover:scale-110 transition-transform shrink-0">
                location_on
              </span>
              <span className="max-w-[65px] sm:max-w-[110px] truncate">
                {activeCityConfig?.name || cooperativeInfo.city}
              </span>
              <span className="material-symbols-outlined text-[13px] text-outline shrink-0">
                expand_more
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-surface-container-low px-1.5 sm:px-2 py-1.5 rounded-xl border border-surface-variant/40 text-xs font-bold text-on-surface shrink-0">
              <span className="material-symbols-outlined text-[14px] text-primary shrink-0">translate</span>
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-on-surface focus:outline-none cursor-pointer pr-0.5 font-bold text-xs"
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
                  type="button"
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className={`h-9 px-2 sm:px-2.5 flex items-center gap-1.5 sm:gap-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-2xs ${
                    userRole === 'worker'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : userRole === 'admin'
                      ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                  title="Switch Demo Persona"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-white"
                  />
                  <span className="hidden sm:inline max-w-[85px] truncate">
                    {currentUser?.name?.split(' ')[0] || userRole}
                  </span>
                  <span className="material-symbols-outlined text-[14px] shrink-0">expand_more</span>
                </button>

                {/* Role & Profile Dropdown Menu */}
                {roleMenuOpen && (
                  <div className="absolute right-0 top-11 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-surface-variant/60 py-2 z-50 animate-fade-in text-on-surface text-xs font-medium">
                    <div className="px-3 py-1 text-[10px] font-black text-on-surface-variant uppercase tracking-wider border-b border-surface-variant/30">
                      Switch Demo Role
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('customer');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                        userRole === 'customer' ? 'font-bold text-emerald-800 bg-emerald-50' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">person</span>
                      <span>Customer (Priya Sharma)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('worker');
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-container-low transition-colors ${
                        userRole === 'worker' ? 'font-bold text-amber-800 bg-amber-50' : ''
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-amber-600">handyman</span>
                      <span>Worker (Awadhesh Sharma)</span>
                    </button>
                    <button
                      type="button"
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

                    <div className="border-t border-surface-variant/30 my-1.5"></div>

                    {/* Go to Profile */}
                    <button
                      type="button"
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
                      type="button"
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
                className="h-9 px-3 flex items-center gap-1 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-xs shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">login</span>
                <span>Demo Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE FULL SLIDE-OVER NAVIGATION DRAWER */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-fade-in">
          {/* Drawer Panel */}
          <div className="w-[82%] max-w-sm bg-surface-container-lowest text-on-surface h-full shadow-2xl flex flex-col justify-between p-4 overflow-y-auto animate-slide-right border-r border-surface-variant/40">
            <div className="space-y-4">
              {/* Drawer Top Row */}
              <div className="flex items-center justify-between pb-3 border-b border-surface-variant/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base text-primary leading-tight">{cooperativeInfo.name}</h3>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase">Cooperative Portal</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
                  aria-label="Close Drawer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Persona Profile Card */}
              {isAuthenticated && (
                <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-variant/30 flex items-center gap-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-11 h-11 rounded-xl object-cover border border-surface-variant/50 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-sm text-on-surface truncate">{currentUser?.name}</p>
                      <span className="bg-primary/10 text-primary text-[9px] font-black px-1.5 py-0.2 rounded">
                        {userRole}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant truncate">{currentUser?.trade || currentUser?.locality || 'Co-op Member'}</p>
                  </div>
                </div>
              )}

              {/* Core Navigation Views */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-on-surface-variant px-2 pb-1 tracking-wider">
                  Navigation
                </p>
                {[
                  { id: 'home', label: 'Home Page', icon: 'home' },
                  { id: 'workers', label: 'Services & Trades', icon: 'grid_view' },
                  { id: 'bookings', label: 'My Bookings & Vault', icon: 'event_note', badge: activeEscrowBookings },
                  { id: 'community', label: 'Co-op Welfare & Benefits', icon: 'shield_with_heart' },
                  { id: 'worker-dashboard', label: 'Worker Operational Hub', icon: 'engineering' },
                  { id: 'admin-dashboard', label: 'Chapter Admin Console', icon: 'admin_panel_settings' },
                  { id: 'profile', label: 'Profile & Settings', icon: 'person' },
                ].map((item) => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        navigateTo(item.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Special Features & Cooperative Modals */}
              <div className="space-y-1 pt-2 border-t border-surface-variant/30">
                <p className="text-[10px] font-black uppercase text-on-surface-variant px-2 pb-1 tracking-wider">
                  Smart Co-op Tools
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setEmergencyModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-error bg-error-container/20 hover:bg-error-container/40 border border-error/20 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] material-symbols-fill">emergency</span>
                  <span>Emergency 24x7 SOS Dispatch</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setSkillAssessmentModalWorker(currentWorker);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">smart_display</span>
                  <span>Practical Skill Video Assessment</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setAuditReportModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                  <span>Direct Bank Settlement Proofs</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigateTo('community');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px] text-amber-700">storefront</span>
                  <span>🛒 Wholesale Hardware & Tool Depot</span>
                </button>
              </div>

              {/* Switch Role Quick Persona Selector */}
              <div className="space-y-1.5 pt-2 border-t border-surface-variant/30">
                <p className="text-[10px] font-black uppercase text-on-surface-variant px-2 tracking-wider">
                  Switch Demo Persona (Jury)
                </p>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole('customer');
                      setMobileDrawerOpen(false);
                    }}
                    className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all ${
                      userRole === 'customer'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-surface-container-low text-on-surface border-surface-variant/40'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchRole('worker');
                      setMobileDrawerOpen(false);
                    }}
                    className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all ${
                      userRole === 'worker'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-surface-container-low text-on-surface border-surface-variant/40'
                    }`}
                  >
                    Worker
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchRole('admin');
                      setMobileDrawerOpen(false);
                    }}
                    className={`py-1.5 px-1 rounded-xl font-bold border text-center transition-all ${
                      userRole === 'admin'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-surface-container-low text-on-surface border-surface-variant/40'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-surface-variant/40">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>{language === 'hi' ? 'लॉगआउट करें' : 'Sign Out'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigateTo('login');
                  }}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Demo Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Click Outside to Close Drawer */}
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)}></div>
        </div>
      )}
    </>
  );
};
