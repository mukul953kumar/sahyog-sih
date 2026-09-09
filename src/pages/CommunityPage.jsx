import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESOLUTIONS } from '../data/hardcodedData';

export const CommunityPage = () => {
  const { cooperativeInfo } = useApp();
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
    <div className="w-full max-w-2xl mx-auto px-layout-margin-mobile py-space-md flex flex-col gap-space-md pb-28">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold mb-1">
          <span className="material-symbols-outlined text-[14px]">diversity_3</span>
          <span>Bengaluru Urban Cooperative Chapter</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm font-black text-on-surface">
          Cooperative Dividend & Public Ledger
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          In a worker-owned cooperative, financial ledgers and governance are 100% public and democratic.
        </p>
      </div>

      {/* Hero Transparency Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            Direct Worker Payouts
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-primary">
            {cooperativeInfo.metrics.directWorkerEarnings}
          </span>
          <span className="font-label-sm text-[11px] text-secondary font-bold">
            100% paid to families
          </span>
        </div>

        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            Commissions Saved
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-secondary">
            {cooperativeInfo.metrics.commissionsSaved}
          </span>
          <span className="font-label-sm text-[11px] text-on-surface-variant">
            vs corporate aggregators
          </span>
        </div>

        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            Worker Co-Owners
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-on-surface">
            {cooperativeInfo.metrics.activeCoOwners}
          </span>
          <span className="font-label-sm text-[11px] text-primary font-bold">
            Equal voting shareholders
          </span>
        </div>

        <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-variant/30 flex flex-col gap-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
            Escrow Success Rate
          </span>
          <span className="font-headline-sm text-headline-sm font-black text-on-surface">
            {cooperativeInfo.metrics.escrowSuccessRate}
          </span>
          <span className="font-label-sm text-[11px] text-secondary font-bold">
            Zero fraud recorded
          </span>
        </div>
      </div>

      {/* Democratic Governance / Active Voting */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md border border-surface-variant/40 shadow-xs flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Democratic Chapter Resolutions
            </h3>
            <p className="font-body-sm text-[13px] text-on-surface-variant">
              Every member and resident has voice in cooperative welfare allocations.
            </p>
          </div>
          <span className="material-symbols-outlined text-primary text-[24px]">how_to_vote</span>
        </div>

        <div className="space-y-3">
          {resolutions.map((res) => {
            const hasVoted = votedMap[res.id];
            const totalVotes = res.votesFor + res.votesAgainst;
            const percentageFor = Math.round((res.votesFor / totalVotes) * 100);

            return (
              <div
                key={res.id}
                className="p-space-sm rounded-lg bg-surface-container-low border border-surface-variant/30 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-title-md text-[15px] font-bold text-on-surface leading-tight">
                    {res.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                      res.status === 'Active'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
                <p className="font-body-sm text-[13px] text-on-surface-variant">{res.description}</p>

                {/* Progress bar */}
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex justify-between text-label-sm font-bold">
                    <span className="text-secondary">{percentageFor}% In Favor ({res.votesFor} votes)</span>
                    <span className="text-on-surface-variant">{res.votesAgainst} opposed</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden flex">
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
                      <span className="font-label-sm text-secondary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        You voted {hasVoted === 'for' ? 'Yes (In Favor)' : 'No (Against)'}
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleVote(res.id, true)}
                          className="px-3 py-1.5 rounded bg-primary text-white font-label-sm font-bold flex items-center gap-1 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                          Vote Yes
                        </button>
                        <button
                          onClick={() => handleVote(res.id, false)}
                          className="px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface font-label-sm font-bold border border-surface-variant/40 hover:bg-surface-container-high"
                        >
                          <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                          Vote No
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
