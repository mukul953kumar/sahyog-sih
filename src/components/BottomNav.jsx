import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav = () => {
  const { t, currentView, navigateTo, bookings, userRole } = useApp();

  const activeEscrowBookings = bookings.filter((b) => b.status === 'escrow_locked').length;

  let tabs = [];

  if (userRole === 'worker') {
    tabs = [
      { id: 'worker-dashboard', label: t('navWorkerDash'), icon: 'engineering' },
      { id: 'home', label: t('navHome'), icon: 'home' },
      { id: 'bookings', label: t('navBookings'), icon: 'event_note', badge: activeEscrowBookings },
      { id: 'community', label: t('navCommunity'), icon: 'diversity_3' },
      { id: 'login', label: t('navProfile'), icon: 'person' },
    ];
  } else if (userRole === 'admin') {
    tabs = [
      { id: 'admin-dashboard', label: t('navAdminDash'), icon: 'admin_panel_settings' },
      { id: 'home', label: t('navHome'), icon: 'home' },
      { id: 'bookings', label: t('navBookings'), icon: 'event_note', badge: activeEscrowBookings },
      { id: 'community', label: t('navCommunity'), icon: 'diversity_3' },
      { id: 'login', label: t('navProfile'), icon: 'person' },
    ];
  } else {
    tabs = [
      { id: 'home', label: t('navHome'), icon: 'home' },
      { id: 'workers', label: t('navServices'), icon: 'grid_view' },
      { id: 'bookings', label: t('navBookings'), icon: 'event_note', badge: activeEscrowBookings },
      { id: 'community', label: t('navCommunity'), icon: 'diversity_3' },
      { id: 'login', label: t('navProfile'), icon: 'person' },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-variant pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-layout-margin-mobile">
        {tabs.map((tab) => {
          const isActive =
            currentView === tab.id ||
            (tab.id === 'workers' && currentView === 'worker-detail') ||
            (tab.id === 'bookings' && currentView === 'booking');

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 min-w-[55px] py-1 transition-all ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px] transition-transform ${
                    isActive ? 'scale-110 material-symbols-fill' : ''
                  }`}
                >
                  {tab.icon}
                </span>
                {tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`font-label-sm text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-primary' : 'font-medium'
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
