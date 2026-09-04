'use client';

import React, { useState } from 'react';
import { FinancialCredential } from '../types/credential';
import { MOCK_CREDENTIALS } from '../data/mockCredentials';
import { IssuerBadge } from './IssuerBadge';
import { CredentialModal } from './CredentialModal';
import { ShieldCheck, Lock, Eye, Calendar, Building2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface FinancialCredentialsProps {
  onSelectCredentialForProof?: (credential: FinancialCredential) => void;
}

export const FinancialCredentials: React.FC<FinancialCredentialsProps> = ({
  onSelectCredentialForProof,
}) => {
  const [selectedCredential, setSelectedCredential] = useState<FinancialCredential | null>(null);

  return (
    <section id="credentials" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-12 scroll-mt-24">
      <div className="text-left mb-8">
        <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" /> Attested Credentials
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2">Financial Credentials</h2>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl">
          Attested credentials issued by verified financial institutions. The underlying values remain strictly private on your device while enabling ZK proofs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {MOCK_CREDENTIALS.map((cred) => {
          const isActive = cred.status === 'active';
          const isExpired = cred.status === 'expired';
          const isRevoked = cred.status === 'revoked';

          return (
            <div
              key={cred.credentialId}
              className={`bg-[var(--bg-card)] border ${
                isActive
                  ? 'border-[var(--border-color)] hover:border-[var(--primary-emerald)]'
                  : 'border-[var(--border-color)]/60 opacity-80'
              } rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-lg relative`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs font-semibold text-[var(--text-muted)]">{cred.credentialId}</span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-xs ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : isExpired
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                        : 'bg-red-500/10 text-red-500 border border-red-500/30'
                    }`}
                  >
                    {isActive && '✓ Active'}
                    {isExpired && '⚠ Expired'}
                    {isRevoked && '✕ Revoked'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{cred.claim}</h3>

                {/* Display Threshold / Value */}
                <div className="my-4 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="text-[0.7rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider block">ATTRIBUTES</span>
                    <span className="font-mono text-lg font-extrabold text-[var(--primary-emerald)]">{cred.displayThreshold}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.7rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider block">PERIOD</span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">{cred.period}</span>
                  </div>
                </div>

                {/* Issuer Metadata */}
                <div className="space-y-2 text-xs mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Issuer:</span>
                    <span className="font-semibold text-[var(--text-primary)]">{cred.issuerName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Issuer Verification:</span>
                    <IssuerBadge issuerName={cred.issuerName} issuerStatus={cred.issuerStatus} credentialType={cred.claim} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)]">Privacy Protection:</span>
                    <span className="font-semibold text-[var(--primary-emerald)] inline-flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 🔒 Protected
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedCredential(cred)}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--primary-emerald)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> View Credential Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Credential Detail Modal */}
      {selectedCredential && (
        <CredentialModal
          credential={selectedCredential}
          onClose={() => setSelectedCredential(null)}
          onSelectForProof={onSelectCredentialForProof}
        />
      )}
    </section>
  );
};
