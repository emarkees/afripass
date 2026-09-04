'use client';

import React from 'react';
import { MOCK_ISSUERS } from '../data/mockCredentials';
import { Building2, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

export const IssuerRegistry: React.FC = () => {
  return (
    <section id="issuers" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-12 scroll-mt-24 text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-md">
        <div className="text-left mb-8">
          <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-semibold mb-3">
            <Building2 className="w-4 h-4 text-[var(--primary-emerald)]" /> Institutional Registry
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2">
            Trusted Issuers
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl">
            Financial institutions, fintechs, cooperatives, and employers that provide cryptographically attested financial credentials for AfriPass.
          </p>
        </div>

        {/* Demo Warning Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs sm:text-sm flex items-start gap-3 mb-8">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong>SYNTHETIC DEMO ISSUERS:</strong> All listed issuers are synthetic demo entities configured for architectural demonstration. AfriPass demonstrates institutional attestation without claiming live production bank API connections.
          </div>
        </div>

        {/* Issuers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_ISSUERS.map((issuer) => (
            <div
              key={issuer.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--primary-emerald)] transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[0.65rem] font-bold py-0.5 px-2 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase">
                    DEMO / SYNTHETIC
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{issuer.name}</h3>
                <div className="text-xs font-semibold text-[var(--primary-emerald)] inline-flex items-center gap-1 mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Attester
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  {issuer.description}
                </p>

                <div className="border-t border-[var(--border-color)]/60 pt-3">
                  <span className="text-[0.65rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider block mb-1.5">
                    CREDENTIALS ISSUED
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {issuer.credentialsOffered.map((credName) => (
                      <span
                        key={credName}
                        className="text-[0.7rem] font-semibold py-0.5 px-2 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      >
                        {credName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
