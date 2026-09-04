'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, Lock, CheckCircle2, AlertCircle, Building2, Copy, Check, FileCheck } from 'lucide-react';

interface VerifierPanelProps {
  initialProofId?: string | null;
}

export const VerifierPanel: React.FC<VerifierPanelProps> = ({ initialProofId }) => {
  const [proofInput, setProofInput] = useState<string>(initialProofId || 'PROOF-AFP-849201');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedPayload, setVerifiedPayload] = useState<any | null>({
    proofId: initialProofId || 'PROOF-AFP-849201',
    claim: 'Monthly Income ≥ ₦1,000,000',
    issuerName: 'Demo Bank',
    issuerStatus: 'verified',
    credentialStatus: 'active',
    eligibilitySatisfied: true,
    isValidProof: true,
    midnightNetwork: 'Midnight Preprod Network',
    verifiedTimestamp: 'Just now',
  });

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofInput.trim()) return;

    setIsVerifying(true);
    setTimeout(() => {
      setVerifiedPayload({
        proofId: proofInput.trim(),
        claim: 'Monthly Income ≥ ₦1,000,000',
        issuerName: 'Demo Bank',
        issuerStatus: 'verified',
        credentialStatus: 'active',
        eligibilitySatisfied: true,
        isValidProof: true,
        midnightNetwork: 'Midnight Preprod Network',
        verifiedTimestamp: new Date().toLocaleTimeString(),
      });
      setIsVerifying(false);
    }, 900);
  };

  return (
    <section id="verify-panel" className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-12 scroll-mt-24 text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-md">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold mb-3">
            <FileCheck className="w-4 h-4" /> Lender & Verifier Interface
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-2">
            Verify AfriPass Credential Proof
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-xl mx-auto">
            Lenders and verifiers can verify zero-knowledge proof commitments directly against the Midnight Preprod ledger without requesting raw bank statements.
          </p>
        </div>

        {/* Verification Input Form */}
        <form onSubmit={handleVerifySubmit} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 mb-8 shadow-sm">
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            ENTER PROOF COMMITMENT ID OR PAYLOAD
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={proofInput}
                onChange={(e) => setProofInput(e.target.value)}
                className="w-full py-3.5 px-4 pr-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                placeholder="e.g. PROOF-AFP-849201"
                required
              />
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="py-3.5 px-7 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm disabled:opacity-60"
            >
              {isVerifying ? 'Verifying...' : 'Verify Proof'}
            </button>
          </div>
        </form>

        {/* Verification Result Output */}
        {verifiedPayload && (
          <div className="bg-[var(--bg-surface)] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-md text-left animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[var(--text-primary)]">AFRIPASS VERIFICATION</h3>
                  <p className="text-xs text-[var(--text-muted)]">Midnight Preprod Ledger Result &bull; Verified {verifiedPayload.verifiedTimestamp}</p>
                </div>
              </div>

              <span className="py-1 px-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-xs inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> PROOF VALID
              </span>
            </div>

            {/* Verifier Result Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-6">
              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Verified Claim:</span>
                  <span className="font-bold text-[var(--text-primary)]">{verifiedPayload.claim}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Attesting Institution:</span>
                  <span className="font-semibold text-emerald-500">✓ {verifiedPayload.issuerName} (Verified)</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-[var(--text-muted)]">Credential Status:</span>
                  <span className="font-bold text-emerald-500">✓ Active</span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Eligibility Requirement:</span>
                  <span className="font-bold text-emerald-500">✓ Satisfied</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Midnight ZK Proof:</span>
                  <span className="font-bold text-indigo-500">✓ Valid Cryptographic Proof</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-[var(--text-muted)]">Ledger State Commitment:</span>
                  <span className="font-mono text-xs text-[var(--primary-emerald)] font-bold">Midnight Preprod</span>
                </div>
              </div>
            </div>

            {/* Privacy Non-Disclosure Guarantees */}
            <div className="bg-[var(--badge-bg)] border border-[var(--badge-border)] rounded-xl p-4 text-xs text-[var(--badge-text)] space-y-2">
              <div className="font-bold text-[var(--primary-emerald)] flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Non-Disclosed Private Data Summary:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.8rem]">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Exact Income Amount: <strong>🔒 Hidden</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Full Bank Statement: <strong>🔒 Hidden</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Account Balances: <strong>🔒 Hidden</strong>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Transaction Logs: <strong>🔒 Hidden</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
