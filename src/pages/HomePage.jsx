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
    <div className="flex flex-col w-full max-w-2xl mx-auto px-layout-margin-mobile pb-space-2xl gap-space-lg">
      {/* Search & Locality Quick Bar */}
      <div className="flex flex-col gap-space-xs mt-space-sm">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full bg-surface-container-low rounded-lg p-space-xs shadow-xs border border-surface-variant/40"
        >
          <span className="material-symbols-outlined text-primary ml-space-xs text-[22px]">
            search
          </span>
          <input
            className="w-full bg-transparent px-space-xs font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
            id="serviceSearchInput"
            placeholder={t('searchPlaceholder')}
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
              className="p-1.5 rounded-full hover:bg-primary/10 text-primary flex items-center justify-center mr-1 transition-colors"
              title="बोलकर खोजें (Speak to Search)"
              aria-label="Voice Search"
            >
              <span className="material-symbols-outlined text-[22px] text-primary material-symbols-fill">
                mic
              </span>
            </button>
          )}
        </form>

        {/* Bharat AI Voice Assistant Card - Fully Localized */}
        <div className="bg-gradient-to-r from-emerald-950 via-primary to-emerald-900 text-white rounded-xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-2.5 border border-emerald-700/40 mt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-black shadow-xs">
              <span className="material-symbols-outlined text-[24px] material-symbols-fill">mic</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300 tracking-wide truncate">
                  {t('voiceBannerTitle')}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 leading-snug mt-0.5 line-clamp-2">
                {t('voiceBannerDesc')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setVoiceSearchModalOpen(true)}
            className="px-3 py-2 bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 rounded-lg font-black text-xs shrink-0 shadow-xs flex items-center gap-1 transition-all"
            title={t('voiceSearchBtn')}
          >
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span className="hidden xs:inline">{t('voiceSearchBtn')}</span>
          </button>
        </div>

        {/* Interactive Location Indicator & Quick Switcher */}
        <div className="flex items-center justify-between px-space-xxs mt-1 bg-surface-container-low/80 rounded-xl p-2.5 border border-surface-variant/40 shadow-2xs gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 material-symbols-fill">
              location_on
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                {cooperativeInfo.area}
              </span>
              <span className="text-[11px] text-primary font-semibold truncate">
                {cooperativeInfo.fullName} • {cooperativeInfo.ward}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="font-label-sm text-label-sm text-primary font-black bg-primary-fixed/50 hover:bg-primary-fixed active:scale-95 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 shadow-xs border border-primary/20"
          >
            <span className="material-symbols-outlined text-[14px]">edit_location</span>
            <span>{t('changeLocation') || 'बदलें'}</span>
          </button>
        </div>
      </div>

      {/* Trust Hero Card */}
      <div className="bg-surface-container-low rounded-xl p-space-md shadow-xs border border-surface-variant/30 flex flex-col gap-space-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-md">
            <span className="material-symbols-outlined text-[16px] material-symbols-fill text-secondary">
              verified
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              {t('heroBadge')}
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {t('heroReg')}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight leading-tight font-extrabold">
            {t('heroTitle')}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t('heroDesc')}
          </p>
        </div>

        {/* Trust Checklist Pill Box */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-2 rounded-lg border border-surface-variant/20">
            <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">
              {t('chkVerified')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-2 rounded-lg border border-surface-variant/20">
            <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">
              {t('chkEscrow')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-2 rounded-lg border border-surface-variant/20">
            <span className="material-symbols-outlined text-primary text-[18px]">currency_rupee</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">
              {t('chkZeroComm')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-lowest p-2 rounded-lg border border-surface-variant/20">
            <span className="material-symbols-outlined text-primary text-[18px]">pin</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">
              {t('chkOtpRelease')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            className="w-full h-12 bg-primary text-on-primary font-title-md text-title-md font-bold rounded-lg flex items-center justify-center gap-2 active:bg-primary-container transition-colors shadow-sm"
            onClick={() => navigateTo('workers')}
            type="button"
          >
            <span>{t('findServiceBtn')}</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <button
            className="w-full h-12 bg-surface-container-lowest text-primary font-title-md text-title-md font-bold rounded-lg flex items-center justify-center gap-2 active:bg-surface-container-high transition-colors border border-primary/20 shadow-xs"
            onClick={() => navigateTo('register')}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">badge</span>
            <span>{t('joinWorkerBtn')}</span>
          </button>
        </div>
      </div>

      {/* Urgent Service Banner */}
      <div className="bg-tertiary-fixed text-on-tertiary-fixed p-space-md rounded-xl flex flex-col gap-space-xs shadow-sm border border-tertiary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-title-md text-title-md font-bold text-tertiary">
            <span
              className="material-symbols-outlined text-[22px] text-tertiary material-symbols-fill"
            >
              emergency_home
            </span>
            <span>{t('emergencyTitle')}</span>
          </div>
          <span className="bg-tertiary-container text-on-tertiary-container px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
            {t('emergencyEta')}
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant leading-snug">
          {t('emergencyDesc')}
        </p>
        <div className="pt-2">
          <button
            className="w-full h-11 bg-tertiary text-on-tertiary font-title-md text-title-md font-bold rounded-lg flex items-center justify-center gap-2 active:bg-tertiary-container shadow-sm transition-all"
            id="emergencyBtn"
            type="button"
            onClick={() => setEmergencyModalOpen(true)}
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>{t('requestEmergencyBtn')}</span>
          </button>
        </div>
      </div>

      {/* Service Categories Grid Section */}
      <div className="flex flex-col gap-space-sm" id="categoriesGrid">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
              {t('categoriesTitle')}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {t('categoriesSub')}
            </p>
          </div>
          <span className="font-label-sm text-label-sm text-primary font-bold bg-primary-fixed/30 px-2 py-1 rounded">
            {t('tradesCount')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-space-xs">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="category-card bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2 cursor-pointer hover:bg-surface-container transition-all active:scale-[0.98] border border-surface-variant/40 shadow-xs"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
              </div>
              <div>
                <div className="font-title-md text-title-md text-on-surface font-bold">
                  {getCategoryName(cat)}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                  {cat.desc}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 font-label-sm text-label-sm text-secondary font-semibold">
                <span>{t('fromPrice')} ₹{cat.startingPrice}</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How SAHYOG Operates */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md border border-surface-variant/40 shadow-xs flex flex-col gap-space-md">
        <div>
          <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
            Fair & Transparent
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold mt-0.5">
            How SAHYOG Operates
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Simple 4-step workflow that protects both customer and technician
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-2.5 bg-surface-container-low rounded-lg">
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              1
            </span>
            <div>
              <h4 className="font-title-md text-[15px] font-bold text-on-surface">Direct Match</h4>
              <p className="font-body-sm text-[13px] text-on-surface-variant">
                Select your trade and connect with verified guild members nearby.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-surface-container-low rounded-lg">
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              2
            </span>
            <div>
              <h4 className="font-title-md text-[15px] font-bold text-on-surface">Upfront Safe Escrow</h4>
              <p className="font-body-sm text-[13px] text-on-surface-variant">
                Agree on fair price and hold payment securely in RBI-supervised escrow.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-surface-container-low rounded-lg">
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              3
            </span>
            <div>
              <h4 className="font-title-md text-[15px] font-bold text-on-surface">Verified Delivery</h4>
              <p className="font-body-sm text-[13px] text-on-surface-variant">
                Technician arrives on time, performs the repair, and cleans up the site.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-surface-container-low rounded-lg">
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              4
            </span>
            <div>
              <h4 className="font-title-md text-[15px] font-bold text-on-surface">4-Digit OTP Release</h4>
              <p className="font-body-sm text-[13px] text-on-surface-variant">
                Release your secret PIN to release funds only when completely satisfied.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Know Who You're Hiring / Zero Commission Comparison */}
      <div className="bg-surface-container-low rounded-xl p-space-md border border-surface-variant/40 flex flex-col gap-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-primary">verified_user</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
            Know Who You're Hiring
          </h3>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          SAHYOG verifies through national public digital identity stacks (e-Shram, Aadhaar & DigiLocker) before granting cooperative service licenses.
        </p>

        <div className="p-3 bg-secondary-container/40 rounded-lg border border-secondary/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-secondary-container font-extrabold">
              0% Platform Commission
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Traditional apps cut 20%-35%. Under SAHYOG, 100% goes directly to the technician family.
            </span>
          </div>
          <span className="text-2xl font-black text-secondary shrink-0 ml-2">100%</span>
        </div>
      </div>
    </div>
  );
};
