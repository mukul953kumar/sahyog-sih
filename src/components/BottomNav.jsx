import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav = () => {
  const { t, currentView, navigateTo, bookings, userRole } = useApp();

  const activeEscrowBookings = (bookings || []).filter((b) => b.status === 'escrow_locked').length;

  let tabs = [];

  if (userRole === 'worker') {
    tabs = [
      { id: 'worker-dashboard', label: 'Worker Hub', icon: 'engineering' },
      { id: 'bookings', label: 'Jobs & Payouts', icon: 'event_note', badge: activeEscrowBookings },
      { id: 'community', label: 'Guild Ledger', icon: 'diversity_3' },
      { id: 'profile', label: 'My Profile', icon: 'person' },
    ];
  } else if (userRole === 'admin') {
    tabs = [
      { id: 'admin-dashboard', label: 'Admin Console', icon: 'admin_panel_settings' },
      { id: 'bookings', label: 'Disputes & Vault', icon: 'gavel', badge: activeEscrowBookings },
      { id: 'community', label: 'Resolutions', icon: 'diversity_3' },
      { id: 'profile', label: 'My Profile', icon: 'person' },
    ];
  } else {
    tabs = [
      { id: 'home', label: t('navHome') || 'Home', icon: 'home' },
      { id: 'workers', label: t('navServices') || 'Services', icon: 'grid_view' },
      { id: 'bookings', label: t('navBookings') || 'Bookings', icon: 'event_note', badge: activeEscrowBookings },
      { id: 'community', label: t('navCommunity') || 'Ledger', icon: 'diversity_3' },
      { id: 'profile', label: t('navProfile') || 'Profile', icon: 'person' },
    ];
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-variant/50 pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-1 sm:px-3">
        {tabs.map((tab) => {
          const isActive =
            currentView === tab.id ||
            (tab.id === 'workers' && currentView === 'worker-detail') ||
            (tab.id === 'bookings' && currentView === 'booking');

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 px-0.5 py-1 transition-all active:scale-90 select-none ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[23px] transition-transform ${isActive ? 'scale-110 material-symbols-fill text-primary' : 'text-outline'
                    }`}
                >
                  {tab.icon}
                </span>
                {tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate max-w-[62px] sm:max-w-[74px] text-center leading-tight ${isActive ? 'font-extrabold text-primary' : 'font-semibold text-on-surface-variant'
                  }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
