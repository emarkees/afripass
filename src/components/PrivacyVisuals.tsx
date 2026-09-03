'use client';

import React from 'react';
import { Shield, Lock, Cpu, CheckCircle2, FileText, Database, EyeOff } from 'lucide-react';

export const HeroPrivacyFlow: React.FC = () => {
  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 my-8 shadow-md">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs sm:text-sm font-semibold mb-3">
          <Shield className="w-4 h-4 shrink-0" /> Local ZK Proof Pipeline
        </span>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-[var(--text-primary)]">Zero-Knowledge Verification Model</h3>
        <p className="text-[var(--text-secondary)] text-xs sm:text-base max-w-2xl mx-auto">How AfriPass protects sensitive credentials before ledger submission</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch text-center py-2">
        {/* Step 1 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm flex flex-col items-center justify-center transition-all hover:border-[var(--primary-emerald)]">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mb-3 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm mb-1 text-[var(--text-primary)]">Private Witness</div>
          <div className="text-xs text-[var(--text-muted)]">Income Credential (step)</div>
        </div>

        {/* Step 2 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm flex flex-col items-center justify-center transition-all hover:border-[var(--primary-emerald)]">
          <div className="w-10 h-10 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--primary-emerald)] flex items-center justify-center mb-3 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm mb-1 text-[var(--text-primary)]">🔒 ZK Shield</div>
          <div className="text-xs text-[var(--text-muted)]">Local Witness Encryption</div>
        </div>

        {/* Step 3 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm flex flex-col items-center justify-center transition-all hover:border-[var(--primary-emerald)]">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-[var(--accent-indigo)] flex items-center justify-center mb-3 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm mb-1 text-[var(--text-primary)]">ZK Proof</div>
          <div className="text-xs text-[var(--text-muted)]">Compact Circuit Output</div>
        </div>

        {/* Step 4 */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm flex flex-col items-center justify-center transition-all hover:border-[var(--primary-emerald)]">
          <div className="w-10 h-10 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] flex items-center justify-center mb-3 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm mb-1 text-[var(--text-primary)]">Verified On-Chain</div>
          <div className="text-xs text-[var(--text-muted)]">Midnight Preprod Ledger</div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyCards: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 my-8 items-stretch">
      {/* Card 1 */}
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden transition-all duration-200 hover:border-[var(--primary-emerald)] hover:shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--primary-emerald)] flex items-center justify-center mb-5 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold mb-3 text-[var(--text-primary)]">KEEP DATA PRIVATE</h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Sensitive financial credentials remain a private input during verification and are never sent to external servers or public chains.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden transition-all duration-200 hover:border-[var(--primary-emerald)] hover:shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--primary-emerald)] flex items-center justify-center mb-5 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold mb-3 text-[var(--text-primary)]">PROVE WITHOUT REVEALING</h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Use zero-knowledge technology to prove your financial claim satisfies eligibility criteria without disclosing private underlying values.
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden transition-all duration-200 hover:border-[var(--primary-emerald)] hover:shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--primary-emerald)] flex items-center justify-center mb-5 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold mb-3 text-[var(--text-primary)]">VERIFY ON MIDNIGHT</h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Submit cryptographic verification proofs directly to the Midnight Preprod ledger for verifiable financial identity state updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export const PublicVsPrivateVisual: React.FC = () => {
  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 my-8 shadow-md">
      <div className="text-center mb-8">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-[var(--text-primary)]">Public vs. Private Architecture</h3>
        <p className="text-[var(--text-secondary)] text-xs sm:text-base max-w-2xl mx-auto">Understanding what stays on your device vs. what is published to the Midnight ledger</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch">
        {/* Private Column */}
        <div className="bg-[var(--bg-surface)] border border-dashed border-red-500/40 rounded-2xl p-6 sm:p-7 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-red-500">
              <EyeOff className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-bold">PRIVATE WITNESS</h4>
            </div>
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-3 font-mono">
              circuit input: step (Uint&lt;32&gt;)
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Your private input (e.g. synthetic monthly income credential) is used strictly within the local WebAssembly ZK circuit to construct the mathematical proof. It is never transmitted across the network or logged anywhere.
            </p>
          </div>
        </div>

        {/* Public Column */}
        <div className="bg-[var(--bg-surface)] border border-[var(--badge-border)] rounded-2xl p-6 sm:p-7 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-[var(--badge-text)]">
              <Database className="w-6 h-6 shrink-0" />
              <h4 className="text-lg font-bold">PUBLIC RESULT</h4>
            </div>
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-3 font-mono">
              ledger state: counter (Uint&lt;32&gt;)
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Only the verified state transition counter and proof compliance commitment are updated on the Midnight public ledger. Observers verify validity without recovering the private witness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
