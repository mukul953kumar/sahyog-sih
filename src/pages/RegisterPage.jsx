import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RegisterPage = () => {
  const {
    handleLogin,
    navigateTo,
    submitWorkerRegistration,
    activeCityConfig,
    selectedLocality,
    switchRole,
  } = useApp();

  // Role: 'customer' | 'worker'
  const [role, setRole] = useState('worker');

  // Customer form state
  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerPhone, setCustomerPhone] = useState('98765 43210');
  const [customerLocality, setCustomerLocality] = useState(selectedLocality || 'Civil Lines, Sultanpur');

  // Worker multi-step wizard: 1 (Basic Details) -> 2 (Video & Tools) -> 3 (Review & Submit) -> 4 (Success / Admin Link)
  const [workerStep, setWorkerStep] = useState(1);

  // Worker Form State
  const [workerName, setWorkerName] = useState('Sanjay Vishwakarma');
  const [workerPhone, setWorkerPhone] = useState('98450 12345');
  const [workerTrade, setWorkerTrade] = useState('Master Electrician & Inverter Specialist');
  const [tradeCategory, setTradeCategory] = useState('electrical');
  const [experience, setExperience] = useState('6 Yrs');
  const [workshopName, setWorkshopName] = useState('Vishwakarma Electricals & Battery Care');
  const [workshopAddress, setWorkshopAddress] = useState('Shop #4, Near Golaghat Chauraha, Sultanpur');
  const [verificationMethod, setVerificationMethod] = useState('skill_assessment'); // 'skill_assessment' | 'dpi_eshram'
  const [eShramNumber, setEShramNumber] = useState('e-Shram #9921-7788-4412');

  // Video Assessment State
  const [selectedVideoPreset, setSelectedVideoPreset] = useState('electrical_panel');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [submittedKyc, setSubmittedKyc] = useState(null);

  // Sample Demo Video Presets for Trades
  const VIDEO_PRESETS = {
    electrical_panel: {
      id: 'electrical_panel',
      trade: 'electrical',
      title: 'Live 3-Phase MCB Panel Troubleshooting & Earthing Test',
      duration: '2:12 mins',
      recordedAt: 'Sultanpur Chapter Trade Testing Bench',
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
      description: 'Sanjay demonstrates safe troubleshooting of high-amperage industrial distribution board, verifying < 4 ohms neutral-earth resistance with 1000V safety gloves.',
      checklist: [
        'Live safety circuit isolation (Passed)',
        '1000V Insulated safety tools protocol (Passed)',
        'Load balance test & voltage drop check (Passed)',
      ],
      practicalScore: '98/100',
      grade: 'Grade A+ (Master Wireman Review)',
    },
    plumbing_pump: {
      id: 'plumbing_pump',
      trade: 'plumbing',
      title: 'Submersible Water Motor Overhaul & Pressure Test',
      duration: '2:05 mins',
      recordedAt: 'Civil Lines Sanitation Guild Bench',
      thumbnail: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
      description: 'Demonstrating replacement of worn impeller, capacitor draw testing under simulated water head, and zero-leakage pipe jointing.',
      checklist: [
        'Hydrostatic seal leakage test (Passed)',
        'Dual-capacitor load draw audit (Passed)',
        'Teflon jointing & safety isolation (Passed)',
      ],
      practicalScore: '96/100',
      grade: 'Grade A (Master Plumber Review)',
    },
    cleaning_steam: {
      id: 'cleaning_steam',
      trade: 'cleaning',
      title: 'Chemical-Free High-Pressure Steam Sanitation Demo',
      duration: '1:54 mins',
      recordedAt: 'Community Centre Trade Depot',
      thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
      description: 'Demonstrating 140°C pressurized steam extraction on hardened grime, tile grout sterilization without toxic acids.',
      checklist: [
        'Eco-friendly non-toxic standard (Passed)',
        'Appliance protection & masking (Passed)',
        'High-pressure steam sanitization (Passed)',
      ],
      practicalScore: '97/100',
      grade: 'Grade A+ (Sanitation Lead Review)',
    },
    carpentry_wood: {
      id: 'carpentry_wood',
      trade: 'carpentry',
      title: 'Teak Wood Mortise Joint & Safety Router Bench Demo',
      duration: '2:20 mins',
      recordedAt: 'Sultanpur Carpentry Guild Hub',
      thumbnail: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=600&auto=format&fit=crop&q=80',
      description: 'Precision dovetail mortise cut, deadbolt lock mortise embedding, and safety kickback prevention protocols.',
      checklist: [
        'Precision tolerance < 0.5mm (Passed)',
        'Eye & respiratory protection (Passed)',
        'Structural load tolerance check (Passed)',
      ],
      practicalScore: '96/100',
      grade: 'Grade A (Master Craftsman Review)',
    },
  };

  const currentPreset = VIDEO_PRESETS[selectedVideoPreset] || VIDEO_PRESETS.electrical_panel;

  // Handle Customer Form Submit
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    handleLogin(customerPhone, 'customer', customerName);
  };

  // Handle Worker Final Submit
  const handleWorkerSubmit = (e) => {
    e.preventDefault();
    const newKyc = submitWorkerRegistration({
      name: workerName,
      phone: workerPhone,
      trade: workerTrade,
      tradeId: tradeCategory,
      experience,
      locality: activeCityConfig.name,
      verificationMethod,
      eShramId: verificationMethod === 'dpi_eshram' ? eShramNumber : null,
      workshopName,
      workshopAddress,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      demoVideo: currentPreset,
      toolsVerified: ['Fluke Multimeter', 'Rotary Hammer Drill', 'Insulated Pliers', 'Earthing Tester'],
      peerGuarantors: [
        { name: 'Awadhesh Sharma', memberId: 'SLN-101', role: 'Master Wireman Guarantor' },
        { name: 'Ram Prasad Bind', memberId: 'SLN-108', role: 'Chapter Executive Member' },
      ],
    });

    setSubmittedKyc(newKyc);
    setWorkerStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 pb-28 animate-fade-in">
      {/* Top Breadcrumb & Progress Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-primary uppercase tracking-wider font-black flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span>Cooperative Onboarding Portal</span>
          </span>
          <span className="text-on-surface-variant">
            {role === 'worker' ? `Step ${workerStep} of 4` : 'Step 1 of 1'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
          {role === 'worker' ? (
            <>
              <div className={`h-full bg-primary transition-all duration-300 ${
                workerStep === 1 ? 'w-1/4' : workerStep === 2 ? 'w-2/4' : workerStep === 3 ? 'w-3/4' : 'w-full'
              }`}></div>
            </>
          ) : (
            <div className="w-full h-full bg-emerald-600 rounded-full"></div>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight mt-1">
          {workerStep === 4 ? 'Application Under Review!' : 'Join SAHYOG Cooperative'}
        </h1>
        <p className="text-xs text-on-surface-variant">
          {workerStep === 4
            ? 'Your practical skill demo has been submitted to the District Cooperative Nodal Officer.'
            : 'India’s worker-owned local services cooperative. Zero platform commission & 100% direct payouts.'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: ROLE SELECTION (CUSTOMER VS WORKER-OWNER) */}
      {/* ========================================================================= */}
      {workerStep === 1 && (
        <div className="flex flex-col gap-3">
          <label className="text-xs font-black text-on-surface">Choose Account Type</label>
          <div className="grid grid-cols-2 gap-2">
            {/* Customer Option */}
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all active:scale-[0.98] ${
                role === 'customer'
                  ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-300/40 shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high border-surface-variant/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                {role === 'customer' && (
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                )}
              </div>
              <span className="text-xs font-black text-emerald-950 mt-1">Customer / Resident</span>
              <span className="text-[11px] text-on-surface-variant leading-tight">
                Book verified plumbers, electricians at ₹0 platform fee.
              </span>
            </button>

            {/* Worker-Owner Option */}
            <button
              type="button"
              onClick={() => setRole('worker')}
              className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all active:scale-[0.98] ${
                role === 'worker'
                  ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-300/40 shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high border-surface-variant/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">handyman</span>
                </span>
                {role === 'worker' && (
                  <span className="material-symbols-outlined text-amber-600 text-[20px]">check_circle</span>
                )}
              </div>
              <span className="text-xs font-black text-amber-950 mt-1">Worker-Owner (कारीगर)</span>
              <span className="text-[11px] text-on-surface-variant leading-tight">
                Keep 100% labour earnings, practical skill verification & co-op shares.
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOW A: CUSTOMER REGISTRATION FORM */}
      {/* ========================================================================= */}
      {role === 'customer' && (
        <form
          onSubmit={handleCustomerSubmit}
          className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-variant/40 flex flex-col gap-3.5 animate-fade-in"
        >
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
            <span className="text-xs font-bold text-emerald-950">
              Customer Instant Setup • Instant Escrow Safety
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface">Full Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface">Mobile Phone (OTP Verification)</label>
            <div className="flex items-stretch gap-2">
              <span className="px-3 bg-surface-container-low rounded-xl text-on-surface font-bold text-xs flex items-center border border-surface-variant/40">
                +91
              </span>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface">Residential Area / Locality</label>
            <input
              type="text"
              value={customerLocality}
              onChange={(e) => setCustomerLocality(e.target.value)}
              className="h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all mt-1"
          >
            <span>Complete Registration & Enter SAHYOG</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>
      )}

      {/* ========================================================================= */}
      {/* FLOW B: WORKER-OWNER MULTI-STEP PRACTICAL ONBOARDING WIZARD */}
      {/* ========================================================================= */}
      {role === 'worker' && workerStep === 1 && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-variant/40 flex flex-col gap-3.5 animate-fade-in">
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200">
            <span className="material-symbols-outlined text-amber-700 text-[20px]">engineering</span>
            <div>
              <h3 className="text-xs font-black text-amber-950">Stage 1: Trade Guild & Workshop Identity</h3>
              <p className="text-[10px] text-amber-900/80">Tell us about your trade and local service experience.</p>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface">
              Full Name (कारीगर का नाम) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              placeholder="e.g. Sanjay Vishwakarma"
              className="h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface">
              Mobile Number (10-Digit) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-stretch gap-2">
              <span className="px-3 bg-surface-container-low rounded-xl text-on-surface font-bold text-xs flex items-center border border-surface-variant/40">
                +91
              </span>
              <input
                type="tel"
                required
                value={workerPhone}
                onChange={(e) => setWorkerPhone(e.target.value)}
                className="flex-1 h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Primary Guild Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface">
              Primary Trade Guild (पेशा / व्यवसाय) <span className="text-red-500">*</span>
            </label>
            <select
              value={tradeCategory}
              onChange={(e) => {
                setTradeCategory(e.target.value);
                if (e.target.value === 'electrical') {
                  setWorkerTrade('Master Electrician & Inverter Specialist');
                  setSelectedVideoPreset('electrical_panel');
                } else if (e.target.value === 'plumbing') {
                  setWorkerTrade('Plumber & Submersible Motor Specialist');
                  setSelectedVideoPreset('plumbing_pump');
                } else if (e.target.value === 'cleaning') {
                  setWorkerTrade('Residential Deep Cleaning Lead');
                  setSelectedVideoPreset('cleaning_steam');
                } else if (e.target.value === 'carpentry') {
                  setWorkerTrade('Master Carpenter & Furniture Specialist');
                  setSelectedVideoPreset('carpentry_wood');
                } else {
                  setWorkerTrade('Certified Home Appliance Technician');
                  setSelectedVideoPreset('electrical_panel');
                }
              }}
              className="h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="electrical">⚡ Electrical & Inverter Wiring (विद्युत कर्मी)</option>
              <option value="plumbing">🚰 Plumbing & Motor Specialist (प्लंबर)</option>
              <option value="carpentry">🪚 Carpentry & Woodcraft (बढ़ई)</option>
              <option value="cleaning">🧹 Residential Deep Cleaning (सफाई)</option>
              <option value="appliance">❄️ AC & Appliance Maintenance (एसी मरम्मत)</option>
            </select>
          </div>

          {/* Experience & Workshop */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface">Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="h-11 px-3 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40"
              >
                <option value="3 Yrs">3 Years</option>
                <option value="5 Yrs">5 Years</option>
                <option value="6 Yrs">6 Years</option>
                <option value="10+ Yrs">10+ Years</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface">City / Chapter</label>
              <input
                type="text"
                disabled
                value={`${activeCityConfig.name} (${activeCityConfig.state})`}
                className="h-11 px-3 rounded-xl bg-surface-container text-on-surface font-bold text-xs border border-surface-variant/40 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface">Workshop / Shop Name</label>
            <input
              type="text"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              className="h-11 px-3.5 rounded-xl bg-surface-container-low text-on-surface font-bold text-xs border border-surface-variant/40"
            />
          </div>

          {/* Verification Method Chooser */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-xs font-black text-on-surface">Choose Verification Pathway</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVerificationMethod('skill_assessment')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  verificationMethod === 'skill_assessment'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/40 shadow-xs'
                    : 'bg-surface-container border-surface-variant/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-amber-700">smart_display</span>
                    <span>Practical Skill Video</span>
                  </span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-full">
                    Recommended
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant">
                  For informal trades without ITI degree. Upload a 2-min demo video + tool proof.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setVerificationMethod('dpi_eshram')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  verificationMethod === 'dpi_eshram'
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300/40 shadow-xs'
                    : 'bg-surface-container border-surface-variant/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-950 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-blue-700">badge</span>
                    <span>Govt e-Shram DPI</span>
                  </span>
                  <span className="text-[9px] bg-blue-200 text-blue-900 font-extrabold px-1.5 py-0.2 rounded-full">
                    Fast Track
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant">
                  Instantly link existing 12-digit e-Shram or DigiLocker ITI Certificate.
                </span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setWorkerStep(2);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-container active:scale-[0.99] transition-all mt-2"
          >
            <span>Continue to Stage 2: Video & Tool Proof</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PRACTICAL VIDEO DEMO & TOOLKIT UPLOAD */}
      {/* ========================================================================= */}
      {role === 'worker' && workerStep === 2 && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-variant/40 flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[20px]">smart_display</span>
              <div>
                <h3 className="text-xs font-black text-amber-950">Stage 2: Practical Skill Video Assessment</h3>
                <p className="text-[10px] text-amber-900/80">Upload live proof of your trade skills for Guild Audit.</p>
              </div>
            </div>
            <span className="text-xs font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
              Score ~ {currentPreset.practicalScore}
            </span>
          </div>

          {/* Interactive Demo Video Selector (Jury Friendly) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface flex items-center justify-between">
              <span>Select Sample Live Benchmark Demo Video (or upload custom)</span>
              <span className="text-[10px] text-primary font-bold">Jury Evaluation Ready</span>
            </label>

            {/* Video Player Card */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-surface-variant/40 shadow-md">
              <img
                src={currentPreset.thumbnail}
                alt={currentPreset.title}
                className="w-full h-full object-cover opacity-80"
              />

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                <div className="flex items-center justify-between">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    <span>LIVE BENCH TEST</span>
                  </span>
                  <span className="bg-black/60 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {currentPreset.duration}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white text-xs font-black line-clamp-1">{currentPreset.title}</h4>
                      <p className="text-[10px] text-slate-300 line-clamp-1">
                        📍 {currentPreset.recordedAt} • Tradesperson: {workerName}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVideoPlaying(!videoPlaying)}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all shrink-0"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {videoPlaying ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                  </div>

                  {/* Video Playing Notification */}
                  {videoPlaying && (
                    <div className="bg-primary/90 text-white text-[10px] font-bold p-1.5 rounded-lg flex items-center gap-1 animate-fade-in mt-1">
                      <span className="material-symbols-outlined text-[14px]">volume_up</span>
                      <span>Playing live trade demo for guild inspection...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Protocol Checklist Checked by AI & Guild */}
          <div className="p-3 bg-surface-container rounded-xl border border-surface-variant/30 flex flex-col gap-1.5">
            <span className="text-[11px] font-black text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-600 text-[16px]">fact_check</span>
              <span>Automated Safety & Standard Compliance Check</span>
            </span>

            <div className="space-y-1">
              {currentPreset.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Workshop & Tools Photo Proof */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">
              Workshop & Diagnostic Toolkit Verification Photo
            </label>
            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80"
                alt="Tools"
                className="w-14 h-14 rounded-lg object-cover ring-2 ring-primary/20 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-on-surface block truncate">{workshopName}</span>
                <span className="text-[10px] text-on-surface-variant block truncate">
                  Tools Verified: Fluke Multimeter, Rotary Hammer Drill, Insulated Pliers
                </span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  <span>Photo & Geotag Inspected</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2 Peer Guarantors */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">
              2 Peer Worker Guarantors (सहयोगी कामगार गवाह)
            </label>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-surface-container border border-surface-variant/30 flex flex-col gap-0.5">
                <span className="font-bold text-on-surface">1. Awadhesh Sharma</span>
                <span className="text-on-surface-variant text-[10px]">Member #SLN-101 • Master Wireman</span>
                <span className="text-emerald-700 font-extrabold text-[9px]">Vouched & Approved</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container border border-surface-variant/30 flex flex-col gap-0.5">
                <span className="font-bold text-on-surface">2. Ram Prasad Bind</span>
                <span className="text-on-surface-variant text-[10px]">Member #SLN-108 • Chapter Lead</span>
                <span className="text-emerald-700 font-extrabold text-[9px]">Vouched & Approved</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setWorkerStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs border border-surface-variant/40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setWorkerStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-11 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1 shadow-sm hover:bg-primary-container"
            >
              <span>Review & Submit</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: REVIEW & DEMOCRATIC COOPERATIVE CHARTER */}
      {/* ========================================================================= */}
      {role === 'worker' && workerStep === 3 && (
        <form
          onSubmit={handleWorkerSubmit}
          className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-variant/40 flex flex-col gap-4 animate-fade-in"
        >
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">assignment_turned_in</span>
            <div>
              <h3 className="text-xs font-black text-emerald-950">Stage 3: Review Application & Co-op Charter</h3>
              <p className="text-[10px] text-emerald-900/80">Confirm your cooperative co-owner terms before submission.</p>
            </div>
          </div>

          {/* Review Summary Card */}
          <div className="p-3.5 bg-surface-container-low rounded-xl border border-surface-variant/30 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-surface-variant/20">
              <span className="font-bold text-on-surface">{workerName}</span>
              <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {currentPreset.grade}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-on-surface-variant block">Primary Trade:</span>
                <strong className="text-on-surface">{workerTrade}</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block">Phone Number:</span>
                <strong className="text-on-surface">+91 {workerPhone}</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block">Chapter:</span>
                <strong className="text-on-surface">{activeCityConfig.name} Cooperative</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block">Practical Demo Video:</span>
                <strong className="text-emerald-700">{currentPreset.title}</strong>
              </div>
            </div>
          </div>

          {/* Cooperative Rights & Terms */}
          <div className="p-3 bg-secondary-container/20 rounded-xl border border-secondary/20 flex flex-col gap-1.5 text-xs">
            <span className="font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">balance</span>
              <span>Cooperative Co-Owner Rights:</span>
            </span>
            <p className="text-[11px] text-on-surface-variant">
              • <strong>100% Direct Labour Earnings:</strong> ₹0 platform commission deducted on every completed job.<br />
              • <strong>Equal Equity Share:</strong> 1 democratic vote in cooperative chapter resolutions.<br />
              • <strong>Co-op Welfare Reserve:</strong> Tool subsidy funds, healthcare benefits, and dividend share.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setWorkerStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs border border-surface-variant/40"
            >
              Back
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1 shadow-md hover:bg-primary-container active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Submit to Nodal Officer</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: SUCCESS CONFIRMATION & LIVE JURY ADMIN DEMO BUTTON */}
      {/* ========================================================================= */}
      {role === 'worker' && workerStep === 4 && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-lg border-2 border-emerald-400 flex flex-col gap-4 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center self-center shadow-xs">
            <span className="material-symbols-outlined text-[32px]">task_alt</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full self-center">
              Application ID: {submittedKyc?.id || 'KYC-2026-SLN-942'}
            </span>
            <h3 className="text-xl font-black text-on-surface">Practical Assessment Submitted!</h3>
            <p className="text-xs text-on-surface-variant max-w-sm self-center">
              <strong>{workerName}</strong>'s practical skill video and toolkit proof are now live in the District Nodal Officer's KYC Queue for review.
            </p>
          </div>

          {/* JURY DEMO FAST-FORWARD HIGHLIGHT */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 via-surface-container to-primary/5 rounded-2xl border-2 border-indigo-300 text-left flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
              </span>
              <div>
                <span className="text-xs font-black text-indigo-950 block">
                  Jury / Evaluator Live Verification Step
                </span>
                <span className="text-[10px] text-indigo-800 font-bold">
                  स्विच करके लाइव अप्रूवल और वीडियो रिव्यू देखें
                </span>
              </div>
            </div>

            <p className="text-[11px] text-indigo-950/80">
              Click the button below to switch to the <strong>Admin Dashboard (Dr. Rajeshwar Varma)</strong>, review {workerName}'s demo video inside the inspection modal, and approve them with 1 click!
            </p>

            <button
              type="button"
              onClick={() => {
                switchRole('admin');
                navigateTo('admin-dashboard');
              }}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span>Open Admin Dashboard & Review This Applicant</span>
            </button>
          </div>

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="text-xs font-bold text-primary hover:underline"
          >
            Return to Login Screen
          </button>
        </div>
      )}

      {/* Footer Back Link if not step 4 */}
      {workerStep !== 4 && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="text-xs text-primary font-bold hover:underline"
          >
            Already have an account? Sign In
          </button>
        </div>
      )}
    </div>
  );
};
