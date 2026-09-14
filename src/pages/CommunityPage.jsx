import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESOLUTIONS } from '../data/hardcodedData';

export const CommunityPage = () => {
  const { cooperativeInfo, activeCityConfig } = useApp();
  const [resolutions, setResolutions] = useState(RESOLUTIONS);
  const [votedMap, setVotedMap] = useState({});

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
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 pb-28 md:pb-16 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-bold mb-1">
          <span className="material-symbols-outlined text-[15px]">diversity_3</span>
          <span>{activeCityConfig.chapter || 'Sultanpur Cooperative Chapter'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-on-surface">
          Cooperative Dividend & Public Ledger
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
          In a worker-owned cooperative, financial ledgers and governance are 100% public, transparent, and democratic.
        </p>
      </div>

      {/* Hero Transparency Metrics Grid (4 across on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Direct Worker Payouts
          </span>
          <span className="text-2xl font-black text-primary mt-1">
            {cooperativeInfo.metrics.directWorkerEarnings}
          </span>
          <span className="text-xs text-secondary font-bold mt-0.5">
            100% paid to families
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Commissions Saved
          </span>
          <span className="text-2xl font-black text-secondary mt-1">
            {cooperativeInfo.metrics.commissionsSaved}
          </span>
          <span className="text-xs text-on-surface-variant mt-0.5">
            vs corporate aggregators
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Worker Co-Owners
          </span>
          <span className="text-2xl font-black text-on-surface mt-1">
            {cooperativeInfo.metrics.activeCoOwners}
          </span>
          <span className="text-xs text-primary font-bold mt-0.5">
            Equal voting shareholders
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-variant/30 flex flex-col shadow-2xs">
          <span className="text-xs font-bold text-on-surface-variant uppercase">
            Escrow Success Rate
          </span>
          <span className="text-2xl font-black text-on-surface mt-1">
            {cooperativeInfo.metrics.escrowSuccessRate}
          </span>
          <span className="text-xs text-secondary font-bold mt-0.5">
            Zero fraud recorded
          </span>
        </div>
      </div>

      {/* Democratic Governance / Active Voting */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-surface-variant/40 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-on-surface">
              Democratic Chapter Resolutions
            </h3>
            <p className="text-xs text-on-surface-variant">
              Every member and resident has voice in cooperative welfare allocations.
            </p>
          </div>
          <span className="material-symbols-outlined text-primary text-[26px]">how_to_vote</span>
        </div>

        <div className="space-y-3">
          {resolutions.map((res) => {
            const hasVoted = votedMap[res.id];
            const totalVotes = res.votesFor + res.votesAgainst;
            const percentageFor = Math.round((res.votesFor / totalVotes) * 100);

            return (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/30 flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-on-surface">
                    {res.title}
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-bold shrink-0 ${
                      res.status === 'Active'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{res.description}</p>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-secondary">{percentageFor}% In Favor ({res.votesFor} votes)</span>
                    <span className="text-on-surface-variant">{res.votesAgainst} opposed</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
                    <div
                      className="bg-secondary h-full rounded-full transition-all"
                      style={{ width: `${percentageFor}%` }}
                    ></div>
                  </div>
                </div>

                {/* Voting Actions */}
                {res.status === 'Active' && (
                  <div className="flex items-center gap-2 pt-1">
                    {hasVoted ? (
                      <span className="text-xs text-secondary font-bold flex items-center gap-1 bg-secondary-container/50 px-3 py-1.5 rounded-xl">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        You voted {hasVoted === 'for' ? 'Yes (In Favor)' : 'No (Against)'}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleVote(res.id, true)}
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                          <span>Vote Yes</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVote(res.id, false)}
                          className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-surface-variant/40 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                          <span>Vote No</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
