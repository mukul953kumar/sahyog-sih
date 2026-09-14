import React from 'react';
import { useApp } from '../context/AppContext';

export const HomePage = () => {
  const {
    t,
    navigateTo,
    categories,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setEmergencyModalOpen,
    setVoiceSearchModalOpen,
    setLocationModalOpen,
    cooperativeInfo,
    selectedLocality,
    activeCityConfig,
  } = useApp();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateTo('workers');
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    navigateTo('workers', { category: catId });
  };

  const getCategoryName = (cat) => {
    switch (cat.id) {
      case 'electrical':
        return t('catElectrical');
      case 'plumbing':
        return t('catPlumbing');
      case 'carpentry':
        return t('catCarpentry');
      case 'painting':
        return t('catPainting');
      case 'ac':
        return t('catAc');
      case 'cleaning':
        return t('catCleaning');
      case 'appliance':
        return t('catAppliance');
      case 'masonry':
        return t('catMasonry');
      default:
        return cat.name;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-layout-margin-mobile pb-28 gap-4 sm:gap-5 animate-fade-in">
      {/* 1. Search Bar with Integrated Voice Search */}
      <div className="flex flex-col gap-2 mt-1">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full bg-surface-container-low rounded-2xl p-1.5 shadow-xs border border-surface-variant/40 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface-container-lowest"
        >
          <span className="material-symbols-outlined text-primary ml-2 text-[22px]">
            search
          </span>
          <input
            className="w-full bg-transparent px-2 text-xs sm:text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none"
            id="serviceSearchInput"
            placeholder={t('searchPlaceholder') || 'Search electrician, plumber, AC repair...'}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              aria-label="Clear search"
              className="text-outline hover:text-on-surface p-1 mr-1"
              type="button"
              onClick={() => setSearchQuery('')}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVoiceSearchModalOpen(true)}
              className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center mr-0.5 transition-colors"
              title="Voice Search"
              aria-label="Voice Search"
            >
              <span className="material-symbols-outlined text-[20px] text-primary material-symbols-fill">
                mic
              </span>
            </button>
          )}
        </form>

        {/* Compact Location Ribbon */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-surface-container-lowest rounded-xl border border-surface-variant/30 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-primary text-[17px] shrink-0 material-symbols-fill">
              location_on
            </span>
            <span className="font-bold text-on-surface truncate">
              {selectedLocality || cooperativeInfo.area}, {activeCityConfig?.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="text-[11px] font-bold text-primary hover:underline shrink-0 ml-2 flex items-center gap-0.5"
          >
            <span>Change</span>
            <span className="material-symbols-outlined text-[13px]">expand_more</span>
          </button>
        </div>
      </div>

      {/* 2. Sleek Modern Hero Banner */}
      <div className="bg-gradient-to-br from-primary/10 via-surface-container-lowest to-secondary/10 rounded-2xl p-4 sm:p-5 border border-primary/20 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-black">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            <span>{t('heroBadge')}</span>
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium">
            {t('heroReg')}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight leading-snug">
            {t('heroTitle')}
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-surface-container-lowest p-2 rounded-xl border border-surface-variant/30 flex flex-col items-center gap-0.5 shadow-2xs">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">currency_rupee</span>
            <span className="text-[11px] font-black text-on-surface">₹0 Commission</span>
            <span className="text-[9px] text-on-surface-variant">100% to Worker</span>
          </div>
          <div className="bg-surface-container-lowest p-2 rounded-xl border border-surface-variant/30 flex flex-col items-center gap-0.5 shadow-2xs">
            <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
            <span className="text-[11px] font-black text-on-surface">Escrow Safe</span>
            <span className="text-[9px] text-on-surface-variant">4-Digit PIN Release</span>
          </div>
          <div className="bg-surface-container-lowest p-2 rounded-xl border border-surface-variant/30 flex flex-col items-center gap-0.5 shadow-2xs">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">verified_user</span>
            <span className="text-[11px] font-black text-on-surface">Skill Verified</span>
            <span className="text-[9px] text-on-surface-variant">Live Practical Test</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            className="h-11 bg-primary text-on-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:bg-primary-container transition-all shadow-sm"
            onClick={() => navigateTo('workers')}
            type="button"
          >
            <span>{t('findServiceBtn')}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
          <button
            className="h-11 bg-surface-container-lowest text-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:bg-surface-container-high transition-all border border-primary/30 shadow-2xs"
            onClick={() => navigateTo('register')}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">engineering</span>
            <span>{t('joinWorkerBtn')}</span>
          </button>
        </div>
      </div>

      {/* 3. Compact Urgent Service Banner */}
      <div className="bg-tertiary-fixed text-on-tertiary-fixed p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs border border-tertiary/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px] material-symbols-fill">
              emergency_home
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-tertiary truncate">
                {t('emergencyTitle')}
              </span>
              <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.2 rounded-full text-[9px] font-extrabold">
                {t('emergencyEta')}
              </span>
            </div>
            <p className="text-[11px] text-on-tertiary-fixed-variant truncate mt-0.5">
              Power trip, pipe burst or lock repair? Dispatch immediate on-duty technician.
            </p>
          </div>
        </div>
        <button
          className="px-3.5 py-2 bg-tertiary text-on-tertiary font-bold text-xs rounded-xl shrink-0 shadow-xs flex items-center gap-1 hover:bg-tertiary-container active:scale-95 transition-all"
          id="emergencyBtn"
          type="button"
          onClick={() => setEmergencyModalOpen(true)}
        >
          <span>Request</span>
          <span className="material-symbols-outlined text-[15px]">bolt</span>
        </button>
      </div>

      {/* 4. Service Categories Grid */}
      <div className="flex flex-col gap-2.5" id="categoriesGrid">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-on-surface">
              {t('categoriesTitle')}
            </h2>
            <p className="text-[11px] text-on-surface-variant">
              {t('categoriesSub')}
            </p>
          </div>
          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
            {t('tradesCount')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-1.5 cursor-pointer hover:bg-surface-container-lowest hover:border-primary/40 border border-surface-variant/30 shadow-2xs transition-all active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface line-clamp-1">
                  {getCategoryName(cat)}
                </span>
                <span className="text-[10px] text-on-surface-variant line-clamp-1">
                  {cat.desc}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-secondary font-bold pt-1 mt-auto border-t border-surface-variant/20">
                <span>{t('fromPrice')} ₹{cat.startingPrice}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. How SAHYOG Operates (Concise 4-Step Flow) */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-variant/30 shadow-2xs flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-wider">
            Fair & Democratic Cooperative
          </span>
          <h3 className="text-sm font-black text-on-surface">
            How SAHYOG Works in 4 Simple Steps
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <span className="font-bold text-on-surface">Direct Match</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              Select verified local guild technicians nearby.
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <span className="font-bold text-on-surface">Safe Escrow</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              Payment held securely in RBI-compliant escrow.
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <span className="font-bold text-on-surface">Live Repair</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              Technician performs quality repair on time.
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1">
            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <span className="font-bold text-on-surface">4-Digit PIN</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              Share your secret PIN to release funds after satisfaction.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
