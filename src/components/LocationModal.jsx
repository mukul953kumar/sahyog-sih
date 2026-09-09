import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const LocationModal = () => {
  const {
    t,
    locationModalOpen,
    setLocationModalOpen,
    selectedCity,
    selectedLocality,
    updateLocation,
    supportedCities,
  } = useApp();

  const [tempCity, setTempCity] = useState(selectedCity || 'sultanpur');
  const [tempLocality, setTempLocality] = useState(selectedLocality || 'Civil Lines, Golaghat');
  const [customLocalityInput, setCustomLocalityInput] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState('');

  // Sync with context when modal opens
  useEffect(() => {
    if (locationModalOpen) {
      setTempCity(selectedCity || 'sultanpur');
      setTempLocality(selectedLocality || 'Civil Lines, Golaghat');
      setCustomLocalityInput('');
      setGpsSuccessMessage('');
      setIsDetectingGps(false);
    }
  }, [locationModalOpen, selectedCity, selectedLocality]);

  if (!locationModalOpen) return null;

  const activeCityData = supportedCities.find((c) => c.id === tempCity) || supportedCities[0];

  const handleCitySelect = (cityId) => {
    setTempCity(cityId);
    const targetCity = supportedCities.find((c) => c.id === cityId);
    if (targetCity) {
      setTempLocality(targetCity.defaultLocality);
      setCustomLocalityInput('');
      setGpsSuccessMessage('');
    }
  };

  const handleLocalityChipClick = (area) => {
    if (area === 'All') {
      setTempLocality(activeCityData.defaultLocality);
    } else {
      setTempLocality(`${area}, ${activeCityData.name}`);
    }
    setCustomLocalityInput('');
  };

  // Simulate fast high-accuracy device GPS detection (detects Sultanpur as user is in Sultanpur)
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsSuccessMessage('');

    setTimeout(() => {
      setIsDetectingGps(false);
      setTempCity('sultanpur');
      setTempLocality('Civil Lines, Golaghat');
      setCustomLocalityInput('Civil Lines, Sultanpur (GPS Locked)');
      setGpsSuccessMessage('GPS Locked: Civil Lines, Sultanpur (Ward 8, UP)');
    }, 600);
  };

  const handleConfirm = () => {
    const finalLocality =
      customLocalityInput.trim() || tempLocality || activeCityData.defaultLocality;
    updateLocation(tempCity, finalLocality);
    setLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="locationModalTitle"
        className="bg-surface-container-lowest rounded-2xl w-full max-w-lg shadow-2xl border border-surface-variant/40 max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-surface-variant/30 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-primary material-symbols-fill">
                location_on
              </span>
            </div>
            <div>
              <h3 id="locationModalTitle" className="font-title-lg text-title-lg font-bold text-on-surface">
                {t('selectLocation') || 'अपनी लोकेशन चुनें'}
              </h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                {t('switchCityNotice') || 'सत्यापित स्थानीय सहकारी कामगारों से जुड़ने के लिए अपना शहर चुनें'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocationModalOpen(false)}
            aria-label="Close location modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* GPS Auto-Detect Button */}
          <div>
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="w-full py-2.5 px-3.5 bg-secondary-container/60 hover:bg-secondary-container text-on-secondary-container rounded-xl border border-secondary/30 flex items-center justify-between font-label-lg font-bold transition-all shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[20px] text-secondary ${
                    isDetectingGps ? 'animate-spin' : 'material-symbols-fill'
                  }`}
                >
                  {isDetectingGps ? 'sync' : 'my_location'}
                </span>
                <span>
                  {isDetectingGps
                    ? 'जीपीएस लोकेशन ट्रैक हो रही है...'
                    : t('detectLocation') || 'मेरी वर्तमान लोकेशन उपयोग करें (GPS)'}
                </span>
              </div>
              <span className="text-[11px] bg-white/80 px-2 py-0.5 rounded-md font-bold text-secondary">
                Auto Detect
              </span>
            </button>

            {gpsSuccessMessage && (
              <div className="mt-2 p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-fade-in">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">
                  check_circle
                </span>
                <span>{gpsSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* City Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-label-md text-label-md font-bold text-on-surface">
                {t('currentCity') || 'शहर चुनें / Select City'}
              </label>
              <span className="text-[11px] text-primary font-bold">
                4 Active Cooperative Chapters
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {supportedCities.map((city) => {
                const isSelected = tempCity === city.id;
                return (
                  <div
                    key={city.id}
                    onClick={() => handleCitySelect(city.id)}
                    className={`cursor-pointer p-3 rounded-xl border transition-all text-left relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-primary-fixed/25 border-primary shadow-xs ring-1 ring-primary'
                        : 'bg-surface-container-low border-surface-variant/40 hover:bg-surface-container hover:border-surface-variant'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-title-md text-title-md font-extrabold text-on-surface">
                          {city.name}
                        </span>
                        {city.id === 'sultanpur' && (
                          <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                            You Are Here
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        {city.state}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-surface-variant/20 flex items-center justify-between">
                      <span className="text-[10px] text-primary font-semibold">
                        {city.id === 'sultanpur' || city.id === 'bengaluru'
                          ? '5 Workers'
                          : '3 Workers'}
                      </span>
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isSelected ? 'text-primary' : 'text-outline'
                        }`}
                      >
                        {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Localities Chips for Selected City */}
          <div>
            <label className="block font-label-md text-label-md font-bold text-on-surface mb-2">
              {t('popularLocalities') || 'प्रमुख इलाके / Popular Localities in'}{' '}
              <span className="text-primary font-extrabold">{activeCityData.name}</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {activeCityData.popularAreas.map((area) => {
                const isAreaActive =
                  tempLocality.includes(area) ||
                  (area === 'All' && tempLocality === activeCityData.defaultLocality);

                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleLocalityChipClick(area)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                      isAreaActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-high hover:bg-surface-variant/60 text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {area === 'All' ? 'grid_view' : 'near_me'}
                    </span>
                    <span>{area}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Address Input */}
          <div>
            <label className="block font-label-md text-label-md font-bold text-on-surface mb-1.5">
              {t('customAddressPlaceholder') || 'गली, मोहल्ला या लैंडमार्क (Custom Street/Landmark)'}
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                edit_road
              </span>
              <input
                type="text"
                value={customLocalityInput}
                onChange={(e) => setCustomLocalityInput(e.target.value)}
                placeholder={`e.g. Near Golaghat, Civil Lines, ${activeCityData.name}...`}
                className="w-full bg-surface-container-low border border-surface-variant/50 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
              />
            </div>
          </div>

          {/* Selected Summary Card */}
          <div className="bg-surface-container-low/70 rounded-xl p-3 border border-surface-variant/30 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
              verified_user
            </span>
            <div className="text-xs text-on-surface">
              <div className="font-bold text-on-surface">
                {activeCityData.chapter}
              </div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">
                Reg: <span className="font-mono">{activeCityData.regNumber}</span> • {activeCityData.ward}
              </div>
              <div className="text-[11px] text-primary font-medium mt-1">
                📍 {tempLocality}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-surface-variant/30 flex items-center justify-end gap-2 bg-surface-container-low/50">
          <button
            type="button"
            onClick={() => setLocationModalOpen(false)}
            className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface rounded-lg transition-colors"
          >
            रद्द करें / Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-primary hover:bg-primary-container active:scale-95 text-on-primary rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>{t('confirmLocation') || 'लोकेशन सेट करें (Confirm)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
