'use client';

import React from 'react';
import { Lock, Cpu, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

interface PrivacyStatusProps {
  proofState: 'idle' | 'generating' | 'submitting' | 'success' | 'error';
  txHash: string | null;
}

export const PrivacyStatus: React.FC<PrivacyStatusProps> = ({ proofState, txHash }) => {
  if (proofState === 'idle') {
    return (
      <div className="rounded-[0.875rem] p-5 flex items-center gap-4 my-6 bg-slate-500/10 border border-slate-500/25 text-[var(--text-primary)]">
        <Lock className="w-6 h-6 text-[var(--text-muted)] shrink-0" />
        <div className="text-left">
          <div className="font-bold text-[0.95rem]">🔒 Privacy Protected</div>
          <div className="text-sm text-[var(--text-secondary)]">
            Your private input is not displayed.
          </div>
        </div>
      </div>
    );
  }

  if (proofState === 'generating' || proofState === 'submitting') {
    return (
      <div className="rounded-[0.875rem] p-5 flex items-center gap-4 my-6 bg-amber-500/10 border border-amber-500/30 text-amber-500">
        <Loader2 className="animate-spin w-6 h-6 text-amber-500 shrink-0" />
        <div className="text-left">
          <div className="font-bold text-[0.95rem]">
            {proofState === 'generating' ? '🔐 Generating Private Proof' : '⚡ Submitting to Midnight Preprod'}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Your private input is being used to construct the proof.
          </div>
        </div>
      </div>
    );
  }

  if (proofState === 'success') {
    return (
      <div className="rounded-[0.875rem] p-5 flex items-center gap-4 my-6 bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)]">
        <ShieldCheck className="w-7 h-7 text-[var(--badge-text)] shrink-0" />
        <div className="text-left flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div className="font-bold text-[0.95rem] text-[var(--badge-text)]">
              ✓ Verified on Midnight Preprod
            </div>
            <span className="text-xs font-semibold py-1 px-3 rounded-full bg-[var(--primary-emerald)]/15 text-[var(--primary-emerald)] border border-[var(--primary-emerald)]/30">
              🔒 Proved without revealing your input
            </span>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Your proof was generated locally and submitted successfully on-chain.
          </div>
          {txHash && (
            <div className="font-mono text-xs mt-2 break-all text-[var(--text-muted)]">
              Transaction ID: {txHash}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
