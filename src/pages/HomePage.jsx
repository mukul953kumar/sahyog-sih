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
        return t('catElectrical') || 'Electrical';
      case 'plumbing':
        return t('catPlumbing') || 'Plumbing';
      case 'carpentry':
        return t('catCarpentry') || 'Carpentry';
      case 'painting':
        return t('catPainting') || 'Painting';
      case 'ac':
        return t('catAc') || 'AC Repair';
      case 'cleaning':
        return t('catCleaning') || 'Cleaning';
      case 'appliance':
        return t('catAppliance') || 'Appliance';
      case 'masonry':
        return t('catMasonry') || 'Masonry';
      default:
        return cat.name;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 pb-28 md:pb-16 gap-5 animate-fade-in pt-3">
      {/* 1. Search Bar with Integrated Voice Search & Location Badge */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full bg-surface-container-low rounded-2xl p-2 shadow-xs border border-surface-variant/40 transition-all focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface-container-lowest flex-1"
        >
          <span className="material-symbols-outlined text-primary ml-2.5 text-[22px]">
            search
          </span>
          <input
            className="w-full bg-transparent px-3 text-xs sm:text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none"
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

        {/* Location Ribbon */}
        <button
          type="button"
          onClick={() => setLocationModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2.5 bg-surface-container-lowest rounded-2xl border border-surface-variant/40 text-xs shadow-2xs hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-primary text-[18px] shrink-0 material-symbols-fill">
              location_on
            </span>
            <span className="font-bold text-on-surface truncate">
              {selectedLocality || cooperativeInfo.area}, {activeCityConfig?.name}
            </span>
          </div>
          <span className="material-symbols-outlined text-[14px] text-outline ml-1">expand_more</span>
        </button>
      </div>

      {/* 2. Sleek Hero Banner (Spacious Grid on Desktop) */}
      <div className="bg-gradient-to-br from-primary/10 via-surface-container-lowest to-secondary/10 rounded-3xl p-5 sm:p-7 border border-primary/20 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-black">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>{t('heroBadge') || '100% Worker-Owned Cooperative'}</span>
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">
              Reg #{cooperativeInfo.regNumber}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-on-surface tracking-tight leading-tight">
              {t('heroTitle') || 'Empowering Skilled Workers. Fair Prices for Citizens.'}
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-xl">
              {t('heroDesc') || 'A democratic platform operated by local technicians. 0% aggregator commission cuts, RBI escrow protection, and 4-digit PIN satisfaction release.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              className="h-11 px-5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              onClick={() => navigateTo('workers')}
              type="button"
            >
              <span>{t('findServiceBtn') || 'Find Technician'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              className="h-11 px-5 bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 border border-primary/30 shadow-2xs active:scale-95 transition-all"
              onClick={() => navigateTo('register')}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">engineering</span>
              <span>{t('joinWorkerBtn') || 'Join as Co-Owner'}</span>
            </button>
          </div>
        </div>

        {/* 3 Value Pillars */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-2.5">
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-variant/30 flex flex-col items-center text-center gap-1 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
            </div>
            <span className="text-xs font-black text-on-surface">₹0 Commission</span>
            <span className="text-[10px] text-on-surface-variant">100% directly to worker</span>
          </div>

          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-variant/30 flex flex-col items-center text-center gap-1 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <span className="text-xs font-black text-on-surface">Escrow Safe</span>
            <span className="text-[10px] text-on-surface-variant">4-Digit PIN Release</span>
          </div>

          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-variant/30 flex flex-col items-center text-center gap-1 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <span className="text-xs font-black text-on-surface">Skill Verified</span>
            <span className="text-[10px] text-on-surface-variant">2-Min Practical Video</span>
          </div>
        </div>
      </div>

      {/* 3. Emergency Dispatch Banner */}
      <div className="bg-tertiary-fixed text-on-tertiary-fixed p-4 sm:p-4.5 rounded-2xl flex items-center justify-between gap-4 shadow-xs border border-tertiary/20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px] material-symbols-fill">
              emergency_home
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-tertiary truncate">
                {t('emergencyTitle') || '15-Minute Emergency Dispatch'}
              </span>
              <span className="bg-tertiary-container text-on-tertiary-container px-2.5 py-0.5 rounded-full text-[10px] font-black">
                {t('emergencyEta') || '15 MIN ETA'}
              </span>
            </div>
            <p className="text-xs text-on-tertiary-fixed-variant truncate mt-0.5">
              Power trip, pipe burst or lock failure? Immediate dispatch to nearest on-duty technician.
            </p>
          </div>
        </div>
        <button
          className="px-4 py-2.5 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-bold text-xs rounded-xl shrink-0 shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
          type="button"
          onClick={() => setEmergencyModalOpen(true)}
        >
          <span>Request Emergency</span>
          <span className="material-symbols-outlined text-[16px]">bolt</span>
        </button>
      </div>

      {/* 4. Service Categories Grid (4 columns across on desktop) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-on-surface">
              {t('categoriesTitle') || 'Cooperative Service Guilds'}
            </h2>
            <p className="text-xs text-on-surface-variant">
              {t('categoriesSub') || 'Direct booking with certified local trade co-owners'}
            </p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
            {t('tradesCount') || '8 Active Guilds'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-surface-container-lowest hover:bg-surface-container-low rounded-2xl p-4 flex flex-col gap-2 cursor-pointer hover:border-primary/40 border border-surface-variant/30 shadow-2xs hover:shadow-sm transition-all active:scale-[0.98] group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface line-clamp-1">
                  {getCategoryName(cat)}
                </span>
                <span className="text-xs text-on-surface-variant line-clamp-1">
                  {cat.desc}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-secondary font-bold pt-2 mt-auto border-t border-surface-variant/20">
                <span>{t('fromPrice') || 'From'} ₹{cat.startingPrice}</span>
                <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. How SAHYOG Operates (4-Column Desktop Cards) */}
      <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 border border-surface-variant/30 shadow-2xs flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-wider">
            Democratic & Fair Cooperative
          </span>
          <h3 className="text-base sm:text-lg font-black text-on-surface mt-0.5">
            How SAHYOG Operates in 4 Simple Steps
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1.5">
            <span className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">
              1
            </span>
            <span className="font-bold text-sm text-on-surface mt-1">Direct Match</span>
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Find verified local guild technicians nearby without middleman markups.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1.5">
            <span className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">
              2
            </span>
            <span className="font-bold text-sm text-on-surface mt-1">Safe Escrow</span>
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Payment is held securely in RBI-compliant escrow with zero commission deduction.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1.5">
            <span className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">
              3
            </span>
            <span className="font-bold text-sm text-on-surface mt-1">Live Quality Repair</span>
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Technician arrives on time and performs work with insured safety standards.
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-1.5">
            <span className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs">
              4
            </span>
            <span className="font-bold text-sm text-on-surface mt-1">4-Digit PIN Release</span>
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Share your secret PIN only when satisfied to release 100% direct payout.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
