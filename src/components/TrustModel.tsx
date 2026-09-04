'use client';

import React from 'react';
import { Building2, ShieldCheck, Cpu, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export const TrustModel: React.FC = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-12 scroll-mt-24 text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-md">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-[var(--primary-emerald)]" /> Cryptographic Provenance Stack
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
            Why Can I Trust This?
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
            AfriPass combines institutional data provenance with Midnight zero-knowledge verification to eliminate centralized data targets.
          </p>
        </div>

        {/* Visual Trust Stack Flow Diagram */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 text-center">
            {/* Step 1 */}
            <div className="flex-1 min-w-[140px] p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <Building2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-[var(--text-primary)]">1. Trusted Issuer</div>
              <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">Bank / Fintech Attests</div>
            </div>

            <ArrowRight className="w-5 h-5 text-[var(--primary-emerald)] shrink-0 hidden md:block" />

            {/* Step 2 */}
            <div className="flex-1 min-w-[140px] p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <ShieldCheck className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-[var(--text-primary)]">2. AfriPass Credential</div>
              <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">Attested Credential Held</div>
            </div>

            <ArrowRight className="w-5 h-5 text-[var(--primary-emerald)] shrink-0 hidden md:block" />

            {/* Step 3 */}
            <div className="flex-1 min-w-[140px] p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <Cpu className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-[var(--text-primary)]">3. Midnight ZK Proof</div>
              <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">Compact Circuit Executed</div>
            </div>

            <ArrowRight className="w-5 h-5 text-[var(--primary-emerald)] shrink-0 hidden md:block" />

            {/* Step 4 */}
            <div className="flex-1 min-w-[140px] p-4 rounded-xl bg-[var(--badge-bg)] border border-[var(--badge-border)]">
              <CheckCircle2 className="w-6 h-6 text-[var(--badge-text)] mx-auto mb-2" />
              <div className="text-xs font-bold text-[var(--badge-text)]">4. Verifier</div>
              <div className="text-[0.65rem] text-[var(--badge-text)] opacity-80 mt-1">Proved W/O Revealing</div>
            </div>
          </div>
        </div>

        {/* 3-Part Explanatory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 text-xs flex items-center justify-center font-extrabold">1</span>
              Trusted Issuer
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              A licensed financial institution or approved organization attests to the user's financial record provenance (e.g. 6-month monthly income).
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-500 text-xs flex items-center justify-center font-extrabold">2</span>
              AfriPass Credential
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              The attested information becomes a structured financial credential stored encrypted in the user's client application.
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6">
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 text-xs flex items-center justify-center font-extrabold">3</span>
              Midnight ZK Proof
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Midnight allows AfriPass to prove the required condition on Preprod without exposing underlying sensitive bank records to lenders.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
