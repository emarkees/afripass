'use client';

import React from 'react';
import { Sparkles, ShieldCheck, DollarSign, PiggyBank, History, ChevronRight } from 'lucide-react';
import { CredentialType } from '../types/credential';

interface ProveFlowProps {
  onSelectClaim: (claimType: CredentialType, threshold: number) => void;
}

export const ProveFlow: React.FC<ProveFlowProps> = ({ onSelectClaim }) => {
  return (
    <section id="prove" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-12 scroll-mt-24 text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-md">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-[var(--primary-emerald)]" /> Zero-Knowledge Proof Generator
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
            What do you want to prove?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
            Select a financial eligibility condition below. AfriPass uses your attested credential locally to generate a Midnight ZK proof on Preprod without revealing underlying bank data.
          </p>
        </div>

        {/* Claim Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Option 1: Income Eligibility */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--primary-emerald)] transition-all shadow-sm group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[var(--primary-emerald)] mb-4 group-hover:scale-105 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Income Eligibility</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                Prove that your verified monthly income satisfies a required lending threshold (e.g. ≥ ₦1,000,000).
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs space-y-1 mb-6">
                <div className="text-[var(--text-muted)]">Target Condition:</div>
                <div className="font-mono font-bold text-[var(--primary-emerald)]">Monthly Income ≥ ₦1,000,000</div>
              </div>
            </div>

            <button
              onClick={() => onSelectClaim('income', 1000000)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              Create Proof <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option 2: Savings History */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--primary-emerald)] transition-all shadow-sm group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-105 transition-transform">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Savings History</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                Prove that your verified savings history satisfies a required time horizon (e.g. 6+ months deposit history).
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs space-y-1 mb-6">
                <div className="text-[var(--text-muted)]">Target Condition:</div>
                <div className="font-mono font-bold text-indigo-500">Savings Period ≥ 6 Months</div>
              </div>
            </div>

            <button
              onClick={() => onSelectClaim('savings', 500000)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-indigo-600 to-indigo-700 hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              Create Proof <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option 3: Repayment History */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--primary-emerald)] transition-all shadow-sm group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-4 group-hover:scale-105 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Repayment History</h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                Prove that your credit repayment history satisfies lender compliance requirements (100% on-time repayment).
              </p>
              <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs space-y-1 mb-6">
                <div className="text-[var(--text-muted)]">Target Condition:</div>
                <div className="font-mono font-bold text-cyan-500">Repayment Compliance = 100%</div>
              </div>
            </div>

            <button
              onClick={() => onSelectClaim('repayment', 100)}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-cyan-600 to-cyan-700 hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              Create Proof <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
