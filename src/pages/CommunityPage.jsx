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
  const [activeTab, setActiveTab] = useState('voting'); // 'voting' | 'depot' | 'audit'
  const [showExplainer, setShowExplainer] = useState(true);

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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 pb-28 md:pb-16 animate-fade-in">
      {/* 1. Header with Role-Aware Simple Terms */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">
              {isWorker ? 'diversity_3' : 'public'}
            </span>
            <span>
              {isWorker
                ? isHindi
                  ? 'सहकारी यूनियन खजाना • Guild Ledger & Governance'
                  : 'Cooperative Guild Ledger & Democratic Governance'
                : isHindi
                ? '100% खुला जन-खाता • Public Transparency Ledger'
                : '100% Public Transparency Ledger & Community Fund'}
            </span>
          </div>
          <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {isWorker
              ? isHindi
                ? 'सहकारी गिल्ड लेजर व वोटिंग'
                : 'Cooperative Guild Ledger & Voting'
              : isHindi
              ? 'सार्वजनिक लेजर व सामुदायिक कोष'
              : 'Public Ledger & Community Fund'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl">
            {isWorker
              ? isHindi
                ? 'SAHYOG में हर कारीगर को-ओनर (मालिक) है। यहाँ यूनियन की कुल कमाई, टूल व कल्याण कोष (Welfare Fund) का पारदर्शी हिसाब और शहर के फैसलों पर आपका सीधा वोट है।'
                : 'Every worker is an equal co-owner in SAHYOG. Review our collective earnings, welfare allocations, and cast your direct vote on chapter resolutions.'
              : isHindi
              ? 'यहाँ कॉर्पोरेट बिचौलियों का कोई 20% कट नहीं है। पूरा हिसाब-किताब सार्वजनिक है कि कारीगरों को कितना मेहनताना गया और शहर के कल्याण में कितना पैसा लगा।'
              : 'Zero aggregator commission cuts. 100% of customer payments go directly to local tradespeople, with transparent public ledger auditing.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowExplainer(!showExplainer)}
          className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shrink-0 self-start md:self-center"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            {showExplainer ? 'visibility_off' : 'help'}
          </span>
          <span>
            {showExplainer
              ? isHindi ? 'गाइड छिपाएं' : 'Hide Guide'
              : isHindi ? 'यह Ledger क्या है? (Guide)' : 'How This Ledger Works'}
          </span>
        </button>
      </div>

      {/* 2. "How SAHYOG Ledger Works" - Simple Visual Guide */}
      {showExplainer && (
        <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-5 sm:p-6 rounded-3xl border border-emerald-200/80 shadow-sm space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
              <span>
                {isHindi
                  ? 'सरल भाषा में समझें: SAHYOG Ledger क्या है?'
                  : 'How the SAHYOG Cooperative Ledger Works'}
              </span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {isHindi ? '3 सरल सिद्धांत' : '3 Core Pillars'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {/* Pillar 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                ₹0
              </div>
              <h3 className="font-bold text-xs text-slate-900">
                {isHindi ? '0% कॉर्पोरेट कमीशन' : '0% Corporate Commission'}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'ग्राहकों का 100% मेहनताना सीधे काम करने वाले कारीगर के खाते में जाता है। कोई निजी कंपनी कट नहीं काटती।'
                  : '100% of agreed labour is credited directly to the worker. Zero middleman cuts or aggregator take-rates.'}
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
                  ? 'बुकिंग के ₹10 सरचार्ज से कारीगरों का ₹5 लाख का सामूहिक दुर्घटना बीमा और 50% सस्ती टूल किट की व्यवस्था होती है।'
                  : 'The nominal ₹10 surcharge funds a ₹5 Lakh member accident cover and subsidized wholesale diagnostic equipment.'}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">how_to_vote</span>
              </div>
              <h3 className="font-bold text-xs text-slate-900">
                {isHindi ? 'आपका वोट, आपका फैसला' : '1-Member 1-Vote Democracy'}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'सहकारी खजाने का बचा हुआ पैसा शहर के किस कल्याणकारी काम में खर्च होगा, इस पर सभी सदस्य वोट डालते हैं।'
                  : 'Surplus allocations, training programs, and tool grants are voted on directly by registered cooperative members.'}
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
            {isHindi ? 'Escrow सुरक्षा रिकॉर्ड' : 'Escrow Success Rate'}
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
              {cooperativeInfo?.metrics?.escrowSuccessRate || '100% Safe'}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              {isHindi ? 'शून्य (0) फ्रॉड रिकॉर्ड' : 'Zero Fraud Recorded'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {[
          {
            id: 'voting',
            label: isHindi ? '1. लोकतांत्रिक प्रस्ताव व वोटिंग' : '1. Democratic Chapter Resolutions',
            icon: 'how_to_vote',
          },
          {
            id: 'depot',
            label: isHindi ? '2. थोक टूल व सामग्री डिपो (30% छूट)' : '2. Wholesale Hardware & Tool Depot',
            icon: 'storefront',
          },
          {
            id: 'audit',
            label: isHindi ? '3. पारदर्शी लेन-देन सूची' : '3. Live Public Audit & Transactions',
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

      {/* TAB 1: DEMOCRATIC VOTING RESOLUTIONS */}
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

      {/* TAB 2: SUSTAINABLE WHOLESALE TOOL DEPOT */}
      {activeTab === 'depot' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-black mb-1">
                {isHindi ? 'सहकारी आय का दूसरा स्रोत (Revenue Pillar #2)' : 'Platform Revenue Stream #2'}
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

      {/* TAB 3: LIVE PUBLIC AUDIT & TRANSACTIONS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                {isHindi ? 'सार्वजनिक ऑडिट व पारदर्शी लेन-देन' : 'Live Public Transaction Audit'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'हर एक रुपये का खुला रिकॉर्ड: 0% कमीशन, सीधा बैंक सेटलमेंट और ₹10 सुरक्षा पूल।'
                  : 'Immutable ledger record: 0% platform commission, 100% direct bank credits, and ₹10 safety surcharge.'}
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-xl">
              100% Audited
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
                    +₹{txn.surcharge} {isHindi ? 'बीमा फंड' : 'Welfare Pool'}
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
    </div>
  );
};
