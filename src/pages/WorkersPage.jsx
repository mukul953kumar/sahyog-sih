import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const WorkersPage = () => {
  const {
    t,
    workers,
    navigateTo,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    availableOnly,
    setAvailableOnly,
    sortBy,
    setSortBy,
    setSelectedWorkerId,
    setEmergencyModalOpen,
    setVoiceSearchModalOpen,
    selectedCity,
    selectedLocality,
    activeCityConfig,
    setLocationModalOpen,
    updateLocation,
    supportedCities,
  } = useApp();

  const [cityFilter, setCityFilter] = useState(selectedCity || 'sultanpur');
  const [activeLocalityFilter, setActiveLocalityFilter] = useState('all');

  // Keep cityFilter in sync with global context
  React.useEffect(() => {
    if (selectedCity) {
      setCityFilter(selectedCity);
      setActiveLocalityFilter('all');
    }
  }, [selectedCity]);

  // Filter workers based on city, locality, category, search, and availability
  const filteredWorkers = workers.filter((worker) => {
    // City filter
    const matchesCity =
      cityFilter === 'all' ||
      (worker.city && worker.city.toLowerCase() === cityFilter.toLowerCase());

    // Locality filter
    const matchesLocality =
      activeLocalityFilter === 'all' ||
      (worker.area && worker.area.toLowerCase().includes(activeLocalityFilter.toLowerCase())) ||
      (worker.coverageArea &&
        worker.coverageArea.toLowerCase().includes(activeLocalityFilter.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      worker.category === selectedCategory ||
      (selectedCategory === 'emergency' && worker.availableNow);

    const matchesSearch =
      !searchQuery ||
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.city && worker.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (worker.area && worker.area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      worker.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAvailability = !availableOnly || worker.availableNow;

    return (
      matchesCity &&
      matchesLocality &&
      matchesCategory &&
      matchesSearch &&
      matchesAvailability
    );
  });

  // Sort workers
  const sortedWorkers = [...filteredWorkers].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'jobs') return b.jobsCompleted - a.jobsCompleted;
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  const handleWorkerClick = (workerId) => {
    setSelectedWorkerId(workerId);
    navigateTo('worker-detail', { workerId });
  };

  const handleCityTabClick = (cityId) => {
    setCityFilter(cityId);
    setActiveLocalityFilter('all');
    if (cityId !== 'all') {
      const targetCity = supportedCities.find((c) => c.id === cityId);
      if (targetCity) {
        updateLocation(cityId, targetCity.defaultLocality);
      }
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'electrical', label: t('catElectrical') },
    { id: 'plumbing', label: t('catPlumbing') },
    { id: 'ac', label: t('catAc') },
    { id: 'carpentry', label: t('catCarpentry') },
    { id: 'cleaning', label: t('catCleaning') },
    { id: 'emergency', label: 'Emergency', isEmergency: true },
  ];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-28 sm:pb-32">
      {/* Search & Discovery Header */}
      <div className="px-3 sm:px-layout-margin-mobile pt-space-sm pb-space-xs bg-surface-container-lowest">
        {/* Active Chapter & Location Quick Bar */}
        <div className="flex items-center justify-between bg-surface-container-low/80 rounded-xl px-3 py-2 mb-2.5 border border-surface-variant/40 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 material-symbols-fill">
              location_on
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface truncate">
                {selectedLocality}, {activeCityConfig.name}
              </span>
              <span className="text-[10px] text-primary font-semibold truncate">
                {activeCityConfig.chapter}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="text-xs font-black text-primary bg-white hover:bg-primary-fixed/30 active:scale-95 px-2.5 py-1 rounded-lg border border-primary/30 flex items-center gap-1 shrink-0 ml-2 shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">edit_location</span>
            <span>{t('changeLocation') || 'बदलें'}</span>
          </button>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-1">
          {supportedCities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleCityTabClick(city.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                cityFilter === city.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              <span>{city.name}</span>
              {city.id === 'sultanpur' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleCityTabClick('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
              cityFilter === 'all'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            All Cities
          </button>
        </div>

        {/* Search Input Field */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-space-sm flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="w-full h-12 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant text-[16px] font-body-md focus:outline-none focus:bg-surface-container-lowest shadow-[0_1px_2px_rgba(20,30,24,0.05)] border border-surface-variant/40 transition-colors"
            id="serviceSearch"
            placeholder={t('searchPlaceholder')}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery ? (
            <button
              aria-label="Clear"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-space-sm flex items-center text-outline hover:text-on-surface"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          ) : (
            <button
              aria-label="Voice search"
              onClick={() => setVoiceSearchModalOpen(true)}
              className="absolute inset-y-0 right-0 pr-space-sm flex items-center text-primary hover:text-primary-container"
              type="button"
              title="बोलकर खोजें (Speak to Search)"
            >
              <span className="material-symbols-outlined text-[20px] material-symbols-fill">mic</span>
            </button>
          )}
        </div>

        {/* Locality Quick Chips for Active City */}
        <div className="flex items-center gap-space-xs overflow-x-auto py-space-xs no-scrollbar mt-space-xs">
          {activeCityConfig.popularAreas.map((area) => (
            <button
              key={area}
              onClick={() => setActiveLocalityFilter(area === 'All' ? 'all' : area)}
              className={`flex items-center gap-space-xxs px-space-sm py-1.5 rounded-full text-label-md font-label-md shrink-0 shadow-xs transition-all ${
                (area === 'All' && activeLocalityFilter === 'all') ||
                activeLocalityFilter.toLowerCase() === area.toLowerCase()
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {area === 'All' ? 'near_me' : 'location_pin'}
              </span>
              <span>{area === 'All' ? `All ${activeCityConfig.name}` : area}</span>
            </button>
          ))}
          <button
            onClick={() => {
              setAvailableOnly(!availableOnly);
            }}
            className={`flex items-center gap-space-xxs px-space-sm py-1.5 rounded-full text-label-md font-label-md shrink-0 transition-colors ${
              availableOnly
                ? 'bg-secondary text-white font-bold'
                : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span>{t('availableToday')}</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xxs pt-space-xxs border-b border-surface-variant no-scrollbar text-label-md font-label-md">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.isEmergency) {
                    setEmergencyModalOpen(true);
                  } else {
                    setSelectedCategory(cat.id);
                  }
                }}
                className={`category-tab py-2 px-space-xs shrink-0 transition-colors flex items-center gap-1 ${
                  isSelected
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : cat.isEmergency
                    ? 'text-tertiary-container hover:text-tertiary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cat.isEmergency && (
                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                    fmd_bad
                  </span>
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Control Bar */}
      <div className="px-3 sm:px-layout-margin-mobile py-space-xs bg-surface-container flex items-center justify-between gap-2 shadow-[0_1px_3px_rgba(20,30,24,0.04)] border-b border-surface-variant/40">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold shrink-0">
            {t('sortLabel')}
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-surface-container-lowest pl-2.5 pr-7 py-1 rounded-md text-on-surface font-label-md text-label-md shadow-xs border border-surface-variant/50 focus:outline-none cursor-pointer"
            >
              <option value="distance">{t('sortDistance')}</option>
              <option value="rating">{t('sortRating')}</option>
              <option value="jobs">{t('sortJobs')}</option>
            </select>
            <span className="material-symbols-outlined text-[16px] text-outline absolute right-1.5 top-1.5 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Available Now Toggle Switch */}
        <label className="flex items-center gap-space-xs cursor-pointer select-none">
          <span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse"></span>
            {t('availableNow')}
          </span>
          <div className="relative">
            <input
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-9 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container"></div>
          </div>
        </label>
      </div>

      {/* Cooperative Value Guarantee Banner */}
      <div className="px-layout-margin-mobile pt-space-sm pb-space-xxs">
        <div className="p-space-sm bg-secondary-container/30 rounded-lg flex items-start gap-space-xs border border-secondary/20">
          <span
            className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5 material-symbols-fill"
          >
            handshake
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-secondary-container font-bold">
              {t('guaranteeTitle')}
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight mt-0.5">
              {t('guaranteeDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Results Count & Active Badge */}
      <div className="px-layout-margin-mobile pt-space-xs pb-space-xxs flex items-center justify-between">
        <span className="font-label-md text-label-md text-on-surface-variant">
          {t('showingWorkers')}: <strong className="text-on-surface font-bold">{sortedWorkers.length}</strong>
        </span>
        <span className="inline-flex items-center gap-1 text-label-sm font-label-sm px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-[13px] text-primary">verified_user</span>
          {t('coopAudited')}
        </span>
      </div>

      {/* Worker Cards List */}
      <div className="px-layout-margin-mobile flex flex-col gap-space-sm pb-space-2xl pt-space-xxs">
        {sortedWorkers.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-xl p-6">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">person_search</span>
            <p className="font-headline-sm text-on-surface">No workers match this filter.</p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Try resetting the search or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setAvailableOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-label-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          sortedWorkers.map((worker) => (
            <article
              key={worker.id}
              onClick={() => handleWorkerClick(worker.id)}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_4px_rgba(20,30,24,0.06)] flex flex-col gap-space-sm transition-all hover:shadow-[0_4px_12px_rgba(20,30,24,0.08)] border border-surface-variant/40 cursor-pointer"
            >
              {/* Top Row: Avatar & Details */}
              <div className="flex items-start gap-space-sm">
                <div className="relative shrink-0">
                  <img
                    alt={worker.name}
                    className="w-16 h-16 rounded-lg object-cover bg-surface-container border border-surface-variant/40"
                    src={worker.avatar}
                  />
                  <span
                    className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary rounded-full w-5 h-5 flex items-center justify-center shadow"
                    title="Cooperative Verified"
                  >
                    <span className="material-symbols-outlined text-[14px] material-symbols-fill text-white">
                      check
                    </span>
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface truncate font-extrabold">
                      {worker.name}
                    </h3>
                    <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed font-bold px-2 py-0.5 rounded shrink-0">
                      Co-Owner
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-0.5 line-clamp-1">
                    {worker.trade}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-label-sm font-label-sm text-on-surface">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-[16px] material-symbols-fill text-amber-500">
                      star
                    </span>
                    <span className="font-bold">{worker.rating}</span>
                    <span className="text-on-surface-variant">({worker.reviewCount} reviews)</span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-secondary font-semibold">{worker.onTimeRate} On-Time</span>
                  </div>
                </div>
              </div>

              {/* Certifications & Proximity meta */}
              <div className="bg-surface-container-low rounded-lg p-space-xs flex flex-col gap-1 text-body-sm font-body-sm border border-surface-variant/20">
                <div className="flex items-center justify-between flex-wrap gap-x-2">
                  <span className="flex items-center gap-1 text-primary font-bold text-label-sm font-label-sm">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    {worker.chapter || `${worker.city} Chapter`}
                  </span>
                  <span className="flex items-center gap-1 text-on-surface text-label-sm font-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-outline">
                      near_me
                    </span>
                    {worker.distance} • {worker.area ? worker.area.split(',')[0] : worker.city}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-0.5 text-label-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      schedule
                    </span>
                    Next: <strong className="text-on-surface">{worker.nextSlot}</strong>
                  </span>
                  {worker.skillAssessment?.demoVideo ? (
                    <span className="text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                      <span>Demo Verified</span>
                    </span>
                  ) : (
                    <span className="text-secondary font-bold">DigiLocker Certified</span>
                  )}
                </div>
              </div>

              {/* Action and Pricing Tier */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-variant/40">
                <div className="min-w-0 shrink">
                  <span className="text-[10px] sm:text-xs text-on-surface-variant font-semibold block leading-tight">
                    Standard Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg text-primary font-black">
                      ₹{worker.baseQuote}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-secondary font-bold whitespace-nowrap">
                      (0% fee)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkerClick(worker.id);
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                >
                  <span className="truncate max-w-[150px] sm:max-w-none">{t('viewProfileAndBook')}</span>
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">arrow_forward</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
