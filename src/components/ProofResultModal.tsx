'use client';

import React, { useState } from 'react';
import { ProofResult } from '../types/credential';
import { X, CheckCircle2, ShieldCheck, Lock, Copy, Check, Share2, ExternalLink } from 'lucide-react';

interface ProofResultModalProps {
  result: ProofResult | null;
  onClose: () => void;
  onNavigateToVerify: (proofId: string) => void;
}

export const ProofResultModal: React.FC<ProofResultModalProps> = ({
  result,
  onClose,
  onNavigateToVerify,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.proofId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">Private Proof Generated</h3>
            <p className="text-xs text-[var(--text-secondary)]">Verified on Midnight Network ({result.midnightNetwork})</p>
          </div>
        </div>

        {/* Proof Payload Grid */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 mb-6 text-xs sm:text-sm space-y-3">
          <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
            <span className="text-[var(--text-muted)]">Target Claim:</span>
            <span className="font-bold text-[var(--text-primary)]">{result.claim}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
            <span className="text-[var(--text-muted)]">Eligibility Result:</span>
            <span className="font-bold text-emerald-500 inline-flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Requirement Satisfied
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
            <span className="text-[var(--text-muted)]">Attesting Issuer:</span>
            <span className="font-semibold text-[var(--text-primary)]">{result.issuerName} (✓ Verified)</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
            <span className="text-[var(--text-muted)]">Credential Status:</span>
            <span className="font-bold text-emerald-500">✓ Active</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
            <span className="text-[var(--text-muted)]">Midnight ZK Proof:</span>
            <span className="font-bold text-indigo-500">✓ Valid Cryptographic Proof</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
            <span className="text-[var(--text-muted)]">Underlying Income:</span>
            <span className="font-semibold text-[var(--primary-emerald)] inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 🔒 Hidden
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[var(--text-muted)]">Transaction History:</span>
            <span className="font-semibold text-[var(--primary-emerald)] inline-flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 🔒 Hidden
            </span>
          </div>
        </div>

        {/* Proof Commitment ID Box */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 mb-6 flex items-center justify-between gap-2">
          <div className="truncate text-xs font-mono">
            <span className="text-[var(--text-muted)] block text-[0.65rem] uppercase">Proof Commitment ID</span>
            <span className="text-[var(--primary-emerald)] font-bold">{result.proofId}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer shrink-0"
            title="Copy Proof ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              onNavigateToVerify(result.proofId);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" /> Open Verifier Interface
          </button>

          <button
            onClick={handleCopy}
            className="py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" /> {copied ? 'Copied!' : 'Share Proof'}
          </button>
        </div>
      </div>
    </div>
  );
};
