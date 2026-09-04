'use client';

import React from 'react';
import { Lock, ShieldCheck, CheckCircle2, Info, Eye, EyeOff, Building2, Plus, Equal } from 'lucide-react';

export const PrivacyModelUpgrade: React.FC = () => {
  return (
    <section id="privacy-model" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-12 scroll-mt-24 text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-md">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-semibold mb-3">
            <Lock className="w-4 h-4 text-[var(--primary-emerald)]" /> Midnight ZK Privacy Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
            Privacy Is Not the Same as Data Authenticity
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
            Zero-knowledge proofs protect the information being revealed. They do not independently establish that user-supplied financial data originated from a legitimate financial institution. AfriPass solves this by combining institutional attestation with Midnight ZK proofs.
          </p>
        </div>

        {/* Visual Architecture Formula */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 text-center">
            {/* Component 1 */}
            <div className="flex-1 min-w-[130px] p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <Building2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-[var(--text-primary)]">Issuer Attestation</div>
              <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">Data Authenticity</div>
            </div>

            <Plus className="w-4 h-4 text-[var(--text-muted)] shrink-0 hidden xs:block" />

            {/* Component 2 */}
            <div className="flex-1 min-w-[130px] p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <Lock className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-[var(--text-primary)]">Private Credential</div>
              <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">Client Encryption</div>
            </div>

            <Plus className="w-4 h-4 text-[var(--text-muted)] shrink-0 hidden xs:block" />

            {/* Component 3 */}
            <div className="flex-1 min-w-[130px] p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <ShieldCheck className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-[var(--text-primary)]">Midnight ZK Proof</div>
              <div className="text-[0.65rem] text-[var(--text-muted)] mt-1">Mathematical Proof</div>
            </div>

            <Equal className="w-4 h-4 text-[var(--text-muted)] shrink-0 hidden xs:block" />

            {/* Output */}
            <div className="flex-1 min-w-[150px] p-4 rounded-xl bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)]">
              <CheckCircle2 className="w-6 h-6 text-[var(--badge-text)] mx-auto mb-2" />
              <div className="text-xs font-extrabold text-[var(--badge-text)]">Financial Verification</div>
              <div className="text-[0.65rem] text-[var(--badge-text)] opacity-80 mt-1">Verify More, Reveal Less</div>
            </div>
          </div>
        </div>

        {/* Public vs Private Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[var(--bg-surface)] border border-emerald-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-emerald-500 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" /> What Is PRIVATE (Kept Secret)
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Exact monthly income (e.g. ₦2,000,000)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Complete bank statements and transaction histories
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Account balances and personal spending habits
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span> Private witness parameters used during ZK proof generation
              </li>
            </ul>
          </div>

          <div className="bg-[var(--bg-surface)] border border-indigo-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-indigo-500 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5" /> What Is PUBLIC / VERIFIABLE
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span> Proof validity result (Requirement satisfied: YES/NO)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span> Attesting institution provenance (e.g. Demo Bank - Verified)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span> Credential status (`Active` / `Valid`)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span> Midnight Preprod smart contract address & state counter commitment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
