import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SkillAssessmentModal = () => {
  const { skillAssessmentModalWorker, setSkillAssessmentModalWorker, t } = useApp();
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'workshop' | 'guarantors'
  const [isPlaying, setIsPlaying] = useState(false);

  if (!skillAssessmentModalWorker) return null;

  const worker = skillAssessmentModalWorker;
  const assessment = worker.skillAssessment;

  if (!assessment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-300 flex flex-col max-h-[92vh]">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-emerald-900 via-primary to-emerald-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-xs">
              <span className="material-symbols-outlined text-[22px] material-symbols-fill">
                verified
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white leading-none">
                  Practical Skill Assessment Proof
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/40">
                  {assessment.grade || 'Grade A+'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                For non-eShram / non-ITI grassroots tradespeople • Peer-Audited Guild Proof
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPlaying(false);
              setSkillAssessmentModalWorker(null);
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Worker Summary Banner */}
        <div className="px-4 py-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={worker.avatar || worker.thumbnail}
              alt={worker.name}
              className="w-11 h-11 rounded-xl object-cover border-2 border-primary shadow-xs shrink-0"
            />
            <div>
              <h4 className="font-black text-sm text-slate-900 leading-tight">{worker.name}</h4>
              <p className="text-xs text-primary font-bold">{worker.trade}</p>
              <p className="text-[10px] text-slate-500">
                Experience: {worker.experience || worker.experienceYears || '4+ Yrs'} • Practical Score: <strong className="text-emerald-800 font-bold">{assessment.practicalScore || '96/100'}</strong>
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-xs">
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            <span>Skill Verified</span>
          </span>
        </div>

        {/* Sub-Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`pb-2 px-2 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'video'
                ? 'border-primary text-primary font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">smart_display</span>
            <span>2-Min Demo Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workshop')}
            className={`pb-2 px-2 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'workshop'
                ? 'border-primary text-primary font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Workshop & Tools Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guarantors')}
            className={`pb-2 px-2 flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'guarantors'
                ? 'border-primary text-primary font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>2 Peer Guarantors</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3 text-xs text-slate-700">
          {/* TAB 1: 2-MINUTE DEMO VIDEO */}
          {activeTab === 'video' && assessment.demoVideo && (
            <div className="flex flex-col gap-3 animate-fade-in">
              {/* Simulated Interactive Video Container */}
              <div className="relative w-full h-52 bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-300 group">
                <img
                  src={assessment.demoVideo.thumbnail}
                  alt={assessment.demoVideo.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isPlaying ? 'opacity-85' : 'opacity-95'
                  }`}
                />

                {/* Video Overlay Info */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white text-[11px] bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                  <span className="font-bold flex items-center gap-1 truncate">
                    <span className="material-symbols-outlined text-[14px] text-amber-400">videocam</span>
                    {assessment.demoVideo.title}
                  </span>
                  <span className="font-mono bg-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                    {assessment.demoVideo.duration}
                  </span>
                </div>

                {/* Central Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-xl active:scale-95 transition-all group-hover:scale-105"
                  >
                    <span className="material-symbols-outlined text-3xl material-symbols-fill">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                </div>

                {/* Video Scrubber Simulation */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2 flex flex-col gap-1 text-white">
                  <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`bg-amber-400 h-full rounded-full transition-all duration-500 ${
                        isPlaying ? 'w-3/5 animate-pulse' : 'w-1/4'
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/90">
                    <span>{isPlaying ? '01:18 / 02:14' : '00:00 / 02:14'}</span>
                    <span className="text-amber-300 font-bold">● High Definition Trade Camera</span>
                  </div>
                </div>
              </div>

              {/* Evaluation Verdict & Checklist */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">
                    Cooperative Master Evaluator Verdict:
                  </span>
                  <strong className="text-primary font-black bg-primary-fixed/40 px-2 py-0.5 rounded">
                    Score: {assessment.practicalScore || '96/100'}
                  </strong>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {assessment.demoVideo.description}
                </p>

                {assessment.demoVideo.checklist && (
                  <div className="pt-1 border-t border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1 text-[10px] uppercase">
                      Practical Safety & Execution Audit:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                      {assessment.demoVideo.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                          <span className="material-symbols-outlined text-[14px] text-emerald-600 material-symbols-fill">
                            check_circle
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WORKSHOP & TOOLS PROOF */}
          {activeTab === 'workshop' && assessment.workshopProof && (
            <div className="flex flex-col gap-3 animate-fade-in">
              <div className="relative w-full h-48 bg-slate-100 rounded-2xl overflow-hidden border border-slate-300 shadow-xs">
                <img
                  src={assessment.workshopProof.photo}
                  alt={assessment.workshopProof.shopName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 text-white">
                  <h5 className="font-black text-sm">{assessment.workshopProof.shopName}</h5>
                  <p className="text-[11px] text-slate-200">{assessment.workshopProof.shopAddress}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    Inspected Toolkit & Equipment Inventory:
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    Field Verified
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {assessment.workshopProof.toolsVerified.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px] text-primary">build</span>
                      {tool}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  {assessment.workshopProof.inspectedDate}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: 2 PEER GUARANTORS */}
          {activeTab === 'guarantors' && assessment.peerGuarantors && (
            <div className="flex flex-col gap-3 animate-fade-in">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs">
                <strong className="block mb-0.5 font-black text-sm">
                  Community Peer Guarantor Guarantee
                </strong>
                When an unorganized worker does not possess formal diplomas, 2 existing certified cooperative members personally vouch for their character, honesty, and workmanship.
              </div>

              <div className="space-y-2">
                {assessment.peerGuarantors.map((guarantor, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center font-black">
                        {idx + 1}
                      </div>
                      <div>
                        <strong className="font-bold text-slate-900 text-xs block">
                          {guarantor.name}
                        </strong>
                        <span className="text-[10px] text-slate-500">
                          {guarantor.role || 'Senior Co-Owner'} • Member #{guarantor.memberId}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">handshake</span>
                      Vouched
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory Inclusion Note */}
          <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2 mt-auto">
            <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
              shield
            </span>
            <span className="leading-snug">
              <strong>Grassroots Inclusion Protocol:</strong> In accordance with Cooperative Societies Act Section 44, skilled artisans without institutional documentation are admitted upon successful 2-minute live work demonstration and physical workshop audit.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-semibold">
            Status: <strong className="text-emerald-800 font-bold">100% Verified Genuine</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setSkillAssessmentModalWorker(null);
            }}
            className="px-4 py-2 bg-primary hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all"
          >
            Close Practical Proof
          </button>
        </div>
      </div>
    </div>
  );
};
