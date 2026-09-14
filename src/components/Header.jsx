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
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isDetailPage = currentView === 'worker-detail' || currentView === 'booking';
  const isAuthScreen = currentView === 'login' || currentView === 'register';

  const activeEscrowBookings = (bookings || []).filter((b) => b.status === 'escrow_locked').length;

  const getSubTitle = () => {
    switch (currentView) {
      case 'home':
        return t('navHome') || 'Home';
      case 'workers':
        return t('navServices') || 'Services';
      case 'worker-detail':
        return 'Service Detail';
      case 'booking':
        return t('bookingCheckout') || 'Checkout';
      case 'bookings':
        return t('navBookings') || 'Bookings';
      case 'community':
        return t('navCommunity') || 'Community';
      case 'worker-dashboard':
        return t('navWorkerDash') || 'Worker Hub';
      case 'admin-dashboard':
        return t('navAdminDash') || 'Admin Console';
      case 'profile':
        return t('navProfile') || 'Profile';
      case 'login':
        return 'Demo Login';
      case 'register':
        return 'Register';
      default:
        return 'Cooperative';
    }
  };

  // Navigation Links for Desktop Top Bar
  const getDesktopNavLinks = () => {
    if (userRole === 'worker') {
      return [
        { id: 'worker-dashboard', label: 'Worker Hub', icon: 'engineering' },
        { id: 'bookings', label: 'Jobs & Payouts', icon: 'event_note', badge: activeEscrowBookings },
        { id: 'community', label: 'Guild Ledger', icon: 'diversity_3' },
        { id: 'profile', label: 'My Profile', icon: 'person' },
      ];
    } else if (userRole === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Admin Console', icon: 'admin_panel_settings' },
        { id: 'bookings', label: 'Disputes & Escrow', icon: 'gavel', badge: activeEscrowBookings },
        { id: 'community', label: 'Resolutions', icon: 'diversity_3' },
        { id: 'profile', label: 'My Profile', icon: 'person' },
      ];
    } else {
      return [
        { id: 'home', label: 'Home', icon: 'home' },
        { id: 'workers', label: 'Find Services', icon: 'grid_view' },
        { id: 'bookings', label: 'My Bookings', icon: 'event_note', badge: activeEscrowBookings },
        { id: 'community', label: 'Public Ledger', icon: 'diversity_3' },
        { id: 'profile', label: 'My Profile', icon: 'person' },
      ];
    }
  };

  const navLinks = getDesktopNavLinks();

  return (
    <>
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-xs border-b border-surface-variant/40">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-2 shrink-0">
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
                <span className="text-lg font-black text-primary tracking-tight leading-none">
                  {cooperativeInfo.name}
                </span>
                <span className="text-[10px] text-on-surface-variant font-bold leading-tight uppercase tracking-wider">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Location Badge & Selector */}
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1 bg-surface-container-low hover:bg-surface-container px-2.5 py-1.5 rounded-xl border border-surface-variant/40 text-xs font-bold text-on-surface transition-all group shrink-0"
              title="Change City or Locality"
            >
              <span className="material-symbols-outlined text-[15px] text-primary material-symbols-fill group-hover:scale-110 transition-transform shrink-0">
                location_on
              </span>
              <span className="max-w-[75px] sm:max-w-[110px] truncate">
                {activeCityConfig?.name || cooperativeInfo.city}
              </span>
              <span className="material-symbols-outlined text-[13px] text-outline shrink-0">
                expand_more
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1.5 rounded-xl border border-surface-variant/40 text-xs font-bold text-on-surface shrink-0">
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
                  className={`h-9 px-2.5 flex items-center gap-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-2xs ${
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
                  <span className="hidden sm:inline max-w-[90px] truncate">
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
    </>
  );
};
