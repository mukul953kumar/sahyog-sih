import React from 'react';
import { useApp } from '../context/AppContext';

export const FloatingVoiceButton = () => {
  const { setVoiceSearchModalOpen, t } = useApp();

  return (
    <div className="fixed bottom-20 right-4 z-40 flex items-center gap-2">
      <button
        type="button"
        onClick={() => setVoiceSearchModalOpen(true)}
        className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-white shadow-lg shadow-primary/30 border-2 border-white active:scale-95 transition-all"
        title={t('voiceSearchBtn')}
        aria-label="AI Voice Search"
      >
        {/* Pulsing Aura Indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
        </span>

        <span className="material-symbols-outlined text-[22px] text-amber-300 material-symbols-fill">
          mic
        </span>
        <span className="text-xs font-black tracking-wide pr-0.5">
          {t('voiceSearchBtn')}
        </span>
      </button>
    </div>
  );
};
