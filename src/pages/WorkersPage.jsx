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
    setSkillAssessmentModalWorker,
  } = useApp();

  const [cityFilter, setCityFilter] = useState(selectedCity || 'sultanpur');

  // Sync city filter with global selectedCity
  React.useEffect(() => {
    if (selectedCity) {
      setCityFilter(selectedCity);
    }
  }, [selectedCity]);

  // Filter workers based on city, category, search, and availability
  const filteredWorkers = workers.filter((worker) => {
    const matchesCity =
      cityFilter === 'all' ||
      (worker.city && worker.city.toLowerCase() === cityFilter.toLowerCase());

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

    return matchesCity && matchesCategory && matchesSearch && matchesAvailability;
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

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'electrical', label: t('catElectrical') || 'Electrician', icon: 'bolt' },
    { id: 'plumbing', label: t('catPlumbing') || 'Plumbing', icon: 'faucet' },
    { id: 'ac', label: t('catAc') || 'AC Repair', icon: 'ac_unit' },
    { id: 'carpentry', label: t('catCarpentry') || 'Carpentry', icon: 'carpenter' },
    { id: 'cleaning', label: t('catCleaning') || 'Cleaning', icon: 'cleaning_services' },
    { id: 'emergency', label: 'Emergency', icon: 'emergency_home', isEmergency: true },
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 pb-28 md:pb-16 gap-4 pt-3 animate-fade-in">
      {/* 1. Unified Search & Location Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-3.5 sm:p-4 border border-surface-variant/40 shadow-2xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full bg-surface-container-low rounded-2xl border border-surface-variant/40 flex items-center px-3.5 py-2 focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface-container-lowest transition-all">
            <span className="material-symbols-outlined text-outline text-[22px] shrink-0">search</span>
            <input
              className="w-full bg-transparent px-2.5 text-xs sm:text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none"
              placeholder={t('searchPlaceholder') || 'Search electrician, plumber, AC repair, carpentry...'}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                aria-label="Clear"
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-on-surface p-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setVoiceSearchModalOpen(true)}
                className="text-primary hover:text-primary-container p-1 shrink-0"
                title="Voice Search"
              >
                <span className="material-symbols-outlined text-[20px] material-symbols-fill">mic</span>
              </button>
            )}
          </div>

          {/* Quick Location Pill */}
          <button
            type="button"
            onClick={() => setLocationModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 bg-surface-container-low hover:bg-surface-container px-3.5 py-2 rounded-2xl border border-surface-variant/40 text-xs font-bold text-on-surface shrink-0 active:scale-95 transition-all shadow-2xs"
            title="Change Location"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-primary text-[18px] material-symbols-fill shrink-0">
                location_on
              </span>
              <span className="truncate">{selectedLocality || activeCityConfig.name}, {activeCityConfig.name}</span>
            </div>
            <span className="material-symbols-outlined text-[14px] text-outline ml-1">expand_more</span>
          </button>
        </div>

        {/* 2. Horizontal Category Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.isEmergency) {
                    setEmergencyModalOpen(true);
                  } else {
                    setSelectedCategory(cat.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-primary text-white shadow-xs'
                    : cat.isEmergency
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-container'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-surface-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Filter & Sort Bar */}
        <div className="flex items-center justify-between gap-2 px-1 text-xs pt-1 border-t border-surface-variant/30 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* City Dropdown */}
            <div className="relative">
              <select
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  if (e.target.value !== 'all') {
                    const target = supportedCities.find((c) => c.id === e.target.value);
                    if (target) updateLocation(target.id, target.defaultLocality);
                  }
                }}
                className="appearance-none bg-surface-container-low pl-2.5 pr-6 py-1 rounded-lg text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none cursor-pointer"
              >
                {supportedCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                <option value="all">All Cities</option>
              </select>
              <span className="material-symbols-outlined text-[14px] text-outline absolute right-1.5 top-1.5 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-surface-container-low pl-2.5 pr-6 py-1 rounded-lg text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none cursor-pointer"
              >
                <option value="distance">Nearest</option>
                <option value="rating">Top Rated</option>
                <option value="jobs">Most Jobs</option>
              </select>
              <span className="material-symbols-outlined text-[14px] text-outline absolute right-1.5 top-1.5 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Available Today Pill */}
            <button
              type="button"
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                availableOnly
                  ? 'bg-secondary text-white'
                  : 'bg-surface-container-low text-on-surface-variant border border-surface-variant/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Available Now</span>
            </button>
          </div>

          {/* Result Count */}
          <span className="text-xs font-bold text-on-surface-variant shrink-0">
            Showing <strong className="text-on-surface">{sortedWorkers.length}</strong> {sortedWorkers.length === 1 ? 'Cooperative Worker' : 'Cooperative Workers'}
          </span>
        </div>
      </div>

      {/* 4. Worker Cards Grid (2-column on desktop/tablet, 1-column on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {sortedWorkers.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-surface-container-low rounded-2xl p-6 border border-surface-variant/30">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">person_search</span>
            <p className="font-bold text-on-surface text-base">No technicians match this filter.</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Try resetting your search or location filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setAvailableOnly(false);
                setCityFilter('all');
              }}
              className="mt-3 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          sortedWorkers.map((worker) => (
            <article
              key={worker.id}
              onClick={() => handleWorkerClick(worker.id)}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-2xs hover:shadow-md border border-surface-variant/40 hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between gap-3 active:scale-[0.99] group"
            >
              {/* Header: Photo + Info + Co-Owner Badge */}
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img
                    alt={worker.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-surface-container border border-surface-variant/40 group-hover:scale-105 transition-transform"
                    src={worker.avatar}
                  />
                  <span
                    className="absolute -bottom-1 -right-1 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center shadow-xs"
                    title="Cooperative Verified"
                  >
                    <span className="material-symbols-outlined text-[13px] material-symbols-fill">
                      check
                    </span>
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-on-surface text-base truncate">
                      {worker.name}
                    </h3>
                    <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md shrink-0">
                      Co-Owner #{worker.memberId}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant font-medium line-clamp-1 mt-0.5">
                    {worker.trade}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-on-surface flex-wrap">
                    <span className="flex items-center gap-0.5 font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[11px]">
                      ★ {worker.rating} ({worker.reviewCount})
                    </span>
                    <span className="text-[11px] text-on-surface-variant flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px] text-outline">near_me</span>
                      {worker.distance}
                    </span>
                    <span className="text-[11px] text-secondary font-bold">
                      {worker.onTimeRate} On-Time
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges strip: Demo Video & Next Slot */}
              <div className="flex items-center justify-between text-xs bg-surface-container-low px-3 py-1.5 rounded-xl border border-surface-variant/20 flex-wrap gap-1">
                <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-primary text-[15px]">schedule</span>
                  <span>Next: <strong className="text-on-surface">{worker.nextSlot}</strong></span>
                </div>

                {worker.skillAssessment?.demoVideo ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSkillAssessmentModalWorker(worker);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[14px] text-amber-700 material-symbols-fill">
                      smart_display
                    </span>
                    <span>2-Min Demo Video</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>DigiLocker Verified</span>
                  </span>
                )}
              </div>

              {/* Price & Action Row */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-variant/30">
                <div>
                  <span className="text-[10px] text-on-surface-variant block leading-tight font-medium">
                    Standard Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-primary">
                      ₹{worker.baseQuote}
                    </span>
                    <span className="text-[10px] text-secondary font-bold">(0% fee)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkerClick(worker.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-primary-container active:scale-95 transition-all shrink-0"
                >
                  <span>Book Technician</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
