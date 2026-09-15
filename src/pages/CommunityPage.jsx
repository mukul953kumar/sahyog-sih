import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESOLUTIONS } from '../data/hardcodedData';
import { CoopHardwareStoreModal } from '../components/CoopHardwareStoreModal';
import { soundEffects } from '../utils/soundEffects';

export const CommunityPage = () => {
  const { cooperativeInfo, activeCityConfig, userRole, language } = useApp();
  const [resolutions, setResolutions] = useState(RESOLUTIONS);
  const [votedMap, setVotedMap] = useState({});
  const [storeOpen, setStoreOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('welfare'); // 'welfare' | 'depot' | 'voting' | 'payouts'
  const [showExplainer, setShowExplainer] = useState(true);

  // Welfare Aid Application State
  const [aidModalOpen, setAidModalOpen] = useState(false);
  const [aidType, setAidType] = useState('tool');
  const [aidAmount, setAidAmount] = useState('2500');
  const [aidReason, setAidReason] = useState('');
  const [aidSubmitted, setAidSubmitted] = useState(false);

  const isWorker = userRole === 'worker';
  const isHindi = language === 'hi';

  const handleVote = (id, isFor) => {
    if (votedMap[id]) return;
    setResolutions((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            votesFor: isFor ? r.votesFor + 1 : r.votesFor,
            votesAgainst: !isFor ? r.votesAgainst + 1 : r.votesAgainst,
          };
        }
        return r;
      })
    );
    setVotedMap((prev) => ({ ...prev, [id]: isFor ? 'for' : 'against' }));
    soundEffects.playSuccessChime();
  };

  const handleAidSubmit = (e) => {
    e.preventDefault();
    soundEffects.playCashPayoutChime();
    setAidSubmitted(true);
    setTimeout(() => {
      setAidSubmitted(false);
      setAidModalOpen(false);
      setAidReason('');
    }, 2200);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 pb-28 md:pb-16 animate-fade-in">
      {/* 1. Clean, Human-Friendly Header (No Complex Ledger Terms) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">
              {isWorker ? 'shield_with_heart' : 'diversity_3'}
            </span>
            <span>
              {isWorker
                ? isHindi
                  ? 'सहकारी कल्याण, सुरक्षा व सदस्य लाभ'
                  : 'Cooperative Welfare & Member Benefits'
                : isHindi
                ? 'सामाजिक प्रभाव व कारीगर कल्याण कोष'
                : 'Community Welfare & Social Impact'}
            </span>
          </div>
          <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {isWorker
              ? isHindi
                ? 'कारीगर कल्याण कोष व सदस्य लाभ'
                : 'Worker Welfare Fund & Member Benefits'
              : isHindi
              ? 'सामुदायिक कल्याण कोष व प्रभाव'
              : 'Community Welfare & Social Impact'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl">
            {isWorker
              ? isHindi
                ? 'SAHYOG में हर कारीगर को-ओनर (मालिक) है। ₹10 बुकिंग सरचार्ज से आपका ₹5 लाख दुर्घटना बीमा, टूल रिपेयर ग्रांट और सस्ती सामग्री सुनिश्चित होती है।'
                : 'Every worker is an equal co-owner in SAHYOG. The ₹10 booking surcharge funds your ₹5 Lakh accidental cover, emergency tool grants, and wholesale equipment discounts.'
              : isHindi
              ? 'यहाँ कोई कॉर्पोरेट बिचौलिया कट नहीं है। 100% मेहनताना सीधा कारीगर को जाता है और मामूली ₹10 सरचार्ज से स्थानीय कारीगरों का कल्याण कोष चलता है।'
              : 'Zero middleman take-rates. 100% of labour goes directly to workers, while a nominal ₹10 surcharge funds member health covers and community grants.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          {isWorker && (
            <button
              type="button"
              onClick={() => setAidModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[17px]">medical_services</span>
              <span>{isHindi ? 'आपातकालीन सहायता मांगें' : 'Claim Emergency Aid'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowExplainer(!showExplainer)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {showExplainer ? 'visibility_off' : 'help'}
            </span>
            <span>
              {showExplainer
                ? isHindi ? 'गाइड छिपाएं' : 'Hide Guide'
                : isHindi ? 'कल्याण मॉडल समझें' : 'How Welfare Works'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Visual Guide: The 3 Pillars of Cooperative Welfare */}
      {showExplainer && (
        <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-5 sm:p-6 rounded-3xl border border-emerald-200/80 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">volunteer_activism</span>
              <span>
                {isHindi
                  ? 'सरल भाषा में समझें: SAHYOG सहकारी मॉडल कैसे काम करता है?'
                  : 'How the SAHYOG Cooperative Welfare Model Works'}
              </span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {isHindi ? '3 सरल स्तंभ' : '3 Core Pillars'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Pillar 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                ₹0
              </div>
              <h3 className="font-bold text-xs text-slate-900">
                {isHindi ? '0% कॉर्पोरेट कमीशन' : '0% Corporate Cut'}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'ग्राहक जो मेहनताना देते हैं, उसका 100% सीधे कारीगर के बैंक खाते में ट्रांसफर होता है। कोई निजी कंपनी 20-30% नहीं काटती।'
                  : '100% of customer labour is credited directly to the worker. Zero middleman commissions or unfair aggregator deductions.'}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
              </div>
              <h3 className="font-bold text-xs text-slate-900">
                {isHindi ? '₹10 सुरक्षा व टूल फंड' : '₹10 Welfare & Tool Pool'}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'हर बुकिंग के मामूली ₹10 से कारीगरों का ₹5 लाख का सामूहिक दुर्घटना बीमा और ₹5,000 की टूल रिपेयर ग्रांट मिलती है।'
                  : 'The nominal ₹10 surcharge funds a ₹5 Lakh member accident cover and emergency tool replacement assistance.'}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">how_to_vote</span>
              </div>
              <h3 className="font-bold text-xs text-slate-900">
                {isHindi ? '1-सदस्य 1-वोट लोकतंत्र' : '1-Member 1-Vote Democracy'}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'कल्याण कोष का पैसा शहर के किस विकास कार्य में खर्च होगा (ट्रेनिंग, सेफ्टी किट, रेनकोट), इस पर हर सदस्य वोट देता है।'
                  : 'Surplus allocations, training programs, and safety kits are voted on democratically by registered cooperative members.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Executive Financial Transparency KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isHindi ? 'कारीगरों की सीधी कमाई' : 'Direct Worker Earnings'}
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              {cooperativeInfo?.metrics?.directWorkerEarnings || '₹18,42,000'}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              {isHindi ? '✓ 100% परिवारों को मिला' : '✓ 100% Remuneration Paid'}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isHindi ? 'बचाया गया कमीशन' : 'Commissions Saved'}
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
              {cooperativeInfo?.metrics?.commissionsSaved || '₹3,68,400'}
            </span>
            <span className="text-[11px] text-slate-500 font-bold block mt-0.5">
              {isHindi ? '20% प्राइवेट ऐप कट से बचत' : 'vs 20% Aggregator Cuts'}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isHindi ? 'सत्यापित कारीगर सदस्य' : 'Active Co-Owners'}
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {cooperativeInfo?.metrics?.activeCoOwners || '412'}
            </span>
            <span className="text-[11px] text-primary font-bold block mt-0.5">
              {isHindi ? 'बराबर के वोटिंग पार्टनर' : 'Equal Voting Members'}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isHindi ? 'बीमा व सुरक्षा कवरेज' : 'Insurance Shield'}
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
              ₹5,00,000
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              {isHindi ? 'प्रति सक्रिय सदस्य बीमा' : 'Per Active Member Cover'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation (Simple, Intuitive) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          {
            id: 'welfare',
            label: isHindi ? '1. कल्याण कोष व ₹5 लाख बीमा' : '1. Member Welfare & ₹5L Insurance',
            icon: 'shield_with_heart',
          },
          {
            id: 'depot',
            label: isHindi ? '2. थोक टूल डिपो (30% छूट)' : '2. Wholesale Hardware Depot (30% Off)',
            icon: 'storefront',
          },
          {
            id: 'voting',
            label: isHindi ? '3. लोकतांत्रिक वोटिंग व प्रस्ताव' : '3. Democratic Voting & Ballots',
            icon: 'how_to_vote',
          },
          {
            id: 'payouts',
            label: isHindi ? '4. सीधा बैंक भुगतान रिकॉर्ड (0% कट)' : '4. Direct Bank Settlements Log',
            icon: 'receipt_long',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all shrink-0 active:scale-95 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 5. TAB CONTENT AREAS */}

      {/* TAB 1: MEMBER WELFARE FUND & INSURANCE DETAILS */}
      {activeTab === 'welfare' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-black mb-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-700">verified_user</span>
                <span>{isHindi ? 'सहकारी सामाजिक सुरक्षा कवच' : 'Cooperative Social Safety Shield'}</span>
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {isHindi ? '₹10 बुकिंग सरचार्ज का पारदर्शी वितरण' : 'Transparent ₹10 Welfare Pool Breakdown'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi
                  ? 'ग्राहकों द्वारा दी गई ₹10 सुरक्षा फीस का 100% उपयोग स्थानीय कारीगरों के कल्याण व सुरक्षा के लिए होता है।'
                  : 'Every single rupee of the ₹10 fee is pooled transparently for technician health, tools, and family protection.'}
              </p>
            </div>

            {isWorker && (
              <button
                type="button"
                onClick={() => setAidModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>{isHindi ? 'सहायता आवेदन' : 'Request Welfare Aid'}</span>
              </button>
            )}
          </div>

          {/* 3 Welfare Benefit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Benefit 1 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  60% Fund (₹6)
                </span>
              </div>
              <h3 className="font-black text-sm text-slate-900 mt-1">
                {isHindi ? '₹5,00,000 सामूहिक दुर्घटना बीमा' : '₹5 Lakh Group Accidental Cover'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'काम के दौरान बिजली का झटका, ऊंचाई से गिरना या आकस्मिक चोट लगने पर अस्पताल का 100% खर्च व परिवार को सुरक्षा।'
                  : 'Comprehensive accidental & hospitalization shield covering high-voltage shocks, scaffolding falls, and occupational hazards.'}
              </p>
              <div className="mt-auto pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                <span>Active Coverage: Ward 112</span>
                <span>100% Cashless ✓</span>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50/80 to-white border border-amber-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">home_repair_service</span>
                </span>
                <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                  25% Fund (₹2.50)
                </span>
              </div>
              <h3 className="font-black text-sm text-slate-900 mt-1">
                {isHindi ? '₹5,000 टूल रिपेयर व रिप्लेसमेंट' : '₹5,000 Tool Repair & Replacement'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'ड्रिल मशीन खराब होने, टेस्टर जलने या पाइप कटर टूटने पर 24 घंटे के अंदर आपातकालीन टूल सहायता ग्रांट।'
                  : 'Instant micro-grants for broken diagnostic testers, drill motors, or lost trade tools within 24 hours.'}
              </p>
              <div className="mt-auto pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-amber-900">
                <span>Micro-Grant Desk</span>
                <span>No Repayment ✓</span>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/80 to-white border border-blue-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </span>
                <span className="text-xs font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                  15% Fund (₹1.50)
                </span>
              </div>
              <h3 className="font-black text-sm text-slate-900 mt-1">
                {isHindi ? 'सोलर व ईवी अपस्किलिंग वर्कशॉप' : 'EV & Solar Tech Upskilling'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'सोलर पैनल इंस्टॉलेशन, ईवी चार्जर वायरिंग और स्मार्ट होम ऑटोमेशन के लिए मुफ्त प्रैक्टिकल ट्रेनिंग व सर्टिफिकेट।'
                  : 'Free hands-on masterclasses on rooftop solar, EV chargers, and smart home automation with NSDC badges.'}
              </p>
              <div className="mt-auto pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] font-bold text-blue-900">
                <span>Next Batch: 22 Sept</span>
                <span>Govt NSDC Badge ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHOLESALE TOOL DEPOT */}
      {activeTab === 'depot' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-black mb-1">
                {isHindi ? 'सहकारी आय का दूसरा स्रोत (Revenue Stream #2)' : 'Platform Revenue Stream #2'}
              </div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {isHindi ? 'थोक हार्डवेयर व टूल डिपो' : 'Cooperative Wholesale Hardware & Equipment Depot'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi
                  ? 'कारीगरों से कमीशन लेने के बजाय, SAHYOG सीधे निर्माताओं (Havells, Schneider, Supreme, Bosch) से थोक में सामग्री लाकर 30% छूट पर उपलब्ध कराता है।'
                  : 'Direct-from-factory ISI certified hardware & tools at 30% bulk discount. Generates sustainable co-op margins without charging commissions on worker labour.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStoreOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-2xl font-black text-xs shrink-0 flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <span>{isHindi ? 'कैटलॉग देखें' : 'Browse Catalog'}</span>
              <span className="material-symbols-outlined text-[16px]">storefront</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-900 uppercase">Havells ISI Wires & MCBs</span>
              <span className="text-xl font-black text-slate-900">30% Wholesale Discount</span>
              <p className="text-[11px] text-slate-600">{isHindi ? 'फैक्ट्री मूल्य: ₹1,650 (बाजार ₹2,400)' : 'Factory Price: ₹1,650 vs Retail ₹2,400'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-1">
              <span className="text-xs font-bold text-emerald-900 uppercase">Supreme CPVC Heavy Pipes</span>
              <span className="text-xl font-black text-slate-900">25% Discount</span>
              <p className="text-[11px] text-slate-600">{isHindi ? 'प्लंबर थोक मूल्य: ₹320 (बाजार ₹440)' : 'Plumber Trade Price: ₹320 vs Retail ₹440'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col gap-1">
              <span className="text-xs font-bold text-blue-900 uppercase">Bosch & Stanley Power Kits</span>
              <span className="text-xl font-black text-slate-900">Co-op Subsidized</span>
              <p className="text-[11px] text-slate-600">{isHindi ? 'पंजीकृत कारीगरों के लिए 0% ब्याज ईएमआई' : '0% Interest 3-Month EMI for Members'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEMOCRATIC VOTING RESOLUTIONS */}
      {activeTab === 'voting' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {isHindi
                  ? `${activeCityConfig.name} चैप्टर: सक्रिय सहकारी प्रस्ताव`
                  : `${activeCityConfig.name} Chapter: Active Democratic Resolutions`}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'हर प्रस्ताव पर सदस्य और नागरिक वोट देकर तय करते हैं कि कल्याणकारी फंड का उपयोग कैसे हो।'
                  : 'Every member and citizen has a democratic voice on cooperative welfare allocations.'}
              </p>
            </div>
            <span className="text-xs bg-primary/10 text-primary font-black px-3 py-1 rounded-xl shrink-0">
              {resolutions.length} {isHindi ? 'प्रस्ताव' : 'Resolutions'}
            </span>
          </div>

          <div className="space-y-4">
            {resolutions.map((res) => {
              const totalVotes = res.votesFor + res.votesAgainst;
              const forPercent = totalVotes > 0 ? Math.round((res.votesFor / totalVotes) * 100) : 0;
              const hasVoted = votedMap[res.id];

              return (
                <article
                  key={res.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col gap-3 hover:border-primary/40 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {res.chapter}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {isHindi ? `प्रस्ताव #${res.id} • अंतिम तिथि: ${res.deadline}` : `Resolution #${res.id} • Deadline: ${res.deadline}`}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
                        {isHindi ? (res.titleHindi || res.title) : res.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {isHindi ? (res.descriptionHindi || res.description) : res.description}
                      </p>
                      {(res.impact || res.impactHindi) && (
                        <div className="mt-2 text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">verified</span>
                          <span>{isHindi ? (res.impactHindi || res.impact) : res.impact}</span>
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
                      {isHindi ? `आवंटन: ${res.amount}` : `Allocated: ${res.amount}`}
                    </span>
                  </div>

                  {/* Voting Progress Visualization */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">thumb_up</span>
                        <span>{forPercent}% {isHindi ? `समर्थन में (${res.votesFor} वोट)` : `In Favor (${res.votesFor} Votes)`}</span>
                      </span>
                      <span className="text-rose-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">thumb_down</span>
                        <span>{100 - forPercent}% {isHindi ? `विपक्ष में (${res.votesAgainst} वोट)` : `Against (${res.votesAgainst} Votes)`}</span>
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-500 rounded-l-full"
                        style={{ width: `${forPercent}%` }}
                      ></div>
                      <div
                        className="bg-rose-500 h-full transition-all duration-500 rounded-r-full"
                        style={{ width: `${100 - forPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {hasVoted ? (
                      <div className="w-full p-2.5 bg-emerald-100/80 text-emerald-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-300">
                        <span className="material-symbols-outlined text-[17px]">check_circle</span>
                        <span>
                          {isHindi
                            ? `आपका वोट दर्ज हो गया: ${hasVoted === 'for' ? 'स्वीकार (Yes)' : 'अस्वीकार (No)'}`
                            : `Vote Recorded: ${hasVoted === 'for' ? 'In Favor (Yes)' : 'Against (No)'}`}
                        </span>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleVote(res.id, true)}
                          className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                          <span>{isHindi ? 'स्वीकार करें (Vote Yes)' : 'Vote Yes (In Favor)'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVote(res.id, false)}
                          className="px-4 h-10 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs border border-slate-200 active:scale-95 transition-all flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                          <span>{isHindi ? 'अस्वीकार (Vote No)' : 'Vote No'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: DIRECT BANK SETTLEMENT LOG (0% COMMISSION PROOFS) */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {isHindi ? 'सीधा बैंक भुगतान रिकॉर्ड (0% कमीशन सबूत)' : 'Direct Bank Settlement Log (0% Platform Deductions)'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'हर एक लेन-देन का पारदर्शी UTR रिकॉर्ड: 100% सीधा बैंक ट्रांसफर और ₹10 कल्याण कोष।'
                  : 'Audited record of direct IMPS/UPI transfers: 100% labour credited directly to worker accounts.'}
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-xl">
              100% Direct Payout
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              {
                id: 'TXN-9941',
                service: isHindi ? '3-फेज एमसीबी ओवरहॉल (सिविल लाइन्स)' : '3-Phase Distribution MCB Overhaul',
                labor: 550,
                commission: 0,
                surcharge: 10,
                worker: 'Awadhesh Sharma',
                ref: 'UTR #CB-994102',
                time: isHindi ? 'कल, 3:12 PM' : 'Yesterday, 3:12 PM',
              },
              {
                id: 'TXN-9932',
                service: isHindi ? 'सीलिंग फैन फिटिंग (गोलाघाट)' : 'Ceiling Fan Fitting & Regulator',
                labor: 350,
                commission: 0,
                surcharge: 10,
                worker: 'Awadhesh Sharma',
                ref: 'UPI #UPI-331902',
                time: isHindi ? '13 सित, 11:36 AM' : '13 Sept, 11:36 AM',
              },
              {
                id: 'TXN-9920',
                service: isHindi ? 'इन्वर्टर बैटरी वायरिंग (पायगीपुर)' : 'Inverter Battery Wiring & Phase Balancer',
                labor: 600,
                commission: 0,
                surcharge: 10,
                worker: 'Awadhesh Sharma',
                ref: 'UTR #CB-771891',
                time: isHindi ? '10 सित, 4:42 PM' : '10 Sept, 4:42 PM',
              },
              {
                id: 'TXN-9908',
                service: isHindi ? 'किचन एग्जॉस्ट वायरिंग (सिविल लाइन्स)' : 'Kitchen Modular Power Points',
                labor: 520,
                commission: 0,
                surcharge: 10,
                worker: 'Awadhesh Sharma',
                ref: 'UTR #SBI-661902',
                time: isHindi ? '08 सित, 12:16 PM' : '08 Sept, 12:16 PM',
              },
            ].map((txn) => (
              <div key={txn.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{txn.id}</span>
                    <span className="font-bold text-slate-800">{txn.service}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {isHindi ? `कारीगर: ${txn.worker} • ${txn.ref} • ${txn.time}` : `Technician: ${txn.worker} • ${txn.ref} • ${txn.time}`}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ₹{txn.labor} {isHindi ? 'सीधा मेहनताना (0% कट)' : 'Direct Payout (0% Cut)'}
                  </span>
                  <span className="text-slate-500 font-bold">
                    +₹{txn.surcharge} {isHindi ? 'कल्याण फंड' : 'Welfare Pool'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wholesale Hardware Depot Modal */}
      <CoopHardwareStoreModal
        isOpen={storeOpen}
        onClose={() => setStoreOpen(false)}
      />

      {/* Worker Emergency Aid Claim Modal */}
      {aidModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-emerald-600/30 flex flex-col gap-4 relative">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">medical_services</span>
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Ward 112 Co-op Treasury
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                    {isHindi ? 'आपातकालीन सहायता अनुरोध' : 'Emergency Aid Request'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAidModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {aidSubmitted ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col items-center text-center gap-3 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <div>
                  <h4 className="font-black text-base text-emerald-950">
                    {isHindi ? 'सहायता आवेदन स्वीकृत!' : 'Emergency Aid Approved!'}
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 font-medium">
                    {isHindi
                      ? `₹${aidAmount} की राशि 15 मिनट में आपके बैंक खाते में क्रेडिट हो जाएगी।`
                      : `₹${aidAmount} micro-grant will be credited to your bank account within 15 mins.`}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAidSubmit} className="flex flex-col gap-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">
                    {isHindi ? 'सहायता का प्रकार चुनें:' : 'Select Aid Category:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'tool', label: '🛠️ Tool Repair Grant', defaultAmt: '2500' },
                      { id: 'medical', label: '🩺 Medical Emergency', defaultAmt: '5000' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setAidType(t.id);
                          setAidAmount(t.defaultAmt);
                        }}
                        className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                          aidType === t.id
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">
                    {isHindi ? 'आवश्यक सहायता राशि (₹):' : 'Requested Grant Amount (₹):'}
                  </label>
                  <input
                    type="number"
                    value={aidAmount}
                    onChange={(e) => setAidAmount(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">
                    {isHindi ? 'कारण / स्थिति विवरण:' : 'Reason / Incident Details:'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={aidReason}
                    onChange={(e) => setAidReason(e.target.value)}
                    placeholder={
                      isHindi
                        ? 'उदा. साइट पर हैमर ड्रिल मोटर जल गई, नया स्पिंडल खरीदने के लिए आपात सहायता चाहिए।'
                        : 'e.g. Drill motor burnt during site service, need grant for spare motor replacement.'
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder:text-slate-400"
                  />
                </div>

                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0">info</span>
                  <span>100% Non-Repayable Grant from Ward 112 Co-op Fund.</span>
                </div>

                <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setAidModalOpen(false)}
                    className="px-4 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Submit & Claim Instant Aid</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
