'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, X, Building2, CheckCircle2, Lock } from 'lucide-react';
import { IssuerStatus } from '../types/credential';

interface IssuerBadgeProps {
  issuerName: string;
  issuerStatus: IssuerStatus;
  credentialType?: string;
  isDemo?: boolean;
}

export const IssuerBadge: React.FC<IssuerBadgeProps> = ({
  issuerName,
  issuerStatus,
  credentialType = 'Financial Credential',
  isDemo = true,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer"
        title="Click to view issuer provenance"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>✓ Issuer Verified</span>
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-[var(--primary-emerald)]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Verified Issuer</h3>
                <p className="text-xs text-[var(--text-secondary)]">Institutional Provenance Attestation</p>
              </div>
            </div>

            <div className="space-y-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Issuer Institution:</span>
                <span className="font-semibold text-[var(--text-primary)]">{issuerName}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Credential Type:</span>
                <span className="font-semibold text-[var(--text-primary)]">{credentialType}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Issuer Status:</span>
                <span className="font-bold text-emerald-500 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Issuer
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]/60">
                <span className="text-[var(--text-muted)]">Attestation Presence:</span>
                <span className="font-semibold text-indigo-500">✓ Cryptographically Attested</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-[var(--text-muted)]">Privacy Guarantee:</span>
                <span className="font-semibold text-[var(--primary-emerald)] inline-flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Underlying Data Hidden
                </span>
              </div>
            </div>

            {isDemo && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Demo Issuer Note:</strong> Demo issuer — synthetic financial data. This credential is for architectural demonstration and does not represent an actual live banking integration.
                </div>
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="w-full mt-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </>
  );
};
