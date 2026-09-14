import React from 'react';
import { useApp } from '../context/AppContext';

export const FloatingVoiceButton = () => {
  const { setVoiceSearchModalOpen, t, currentView, userRole } = useApp();

  // Show voice search floating button ONLY for customer persona on marketplace/home
  if (userRole !== 'customer') {
    return null;
  }

  // Hide on detail and booking checkout pages to prevent covering the sticky checkout dock
  if (currentView === 'worker-detail' || currentView === 'booking' || currentView === 'login' || currentView === 'register') {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-2">
      <button
        type="button"
        onClick={() => setVoiceSearchModalOpen(true)}
        className="group relative flex items-center justify-center gap-2 w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full bg-primary hover:bg-primary-container text-white shadow-xl shadow-primary/30 border-2 border-white active:scale-90 transition-all"
        title={t('voiceSearchBtn') || 'Voice Search'}
        aria-label="AI Voice Search"
      >
        {/* Pulsing Aura Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
        </span>

        <span className="material-symbols-outlined text-[24px] sm:text-[22px] text-amber-300 material-symbols-fill">
          mic
        </span>
        <span className="hidden sm:inline-block text-xs font-black tracking-wide pr-0.5">
          {t('voiceSearchBtn') || 'Voice Search'}
        </span>
      </button>
    </div>
  );
};
