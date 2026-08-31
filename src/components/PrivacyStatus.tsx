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
      <div className="status-banner status-idle">
        <Lock style={{ width: '1.5rem', height: '1.5rem', color: 'var(--text-muted)' }} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>🔒 Privacy Protected</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your private input is not displayed.
          </div>
        </div>
      </div>
    );
  }

  if (proofState === 'generating' || proofState === 'submitting') {
    return (
      <div className="status-banner status-generating">
        <Loader2 className="animate-spin" style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {proofState === 'generating' ? '🔐 Generating Private Proof' : '⚡ Submitting to Midnight Preprod'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your private input is being used to construct the proof.
          </div>
        </div>
      </div>
    );
  }

  if (proofState === 'success') {
    return (
      <div className="status-banner status-success">
        <ShieldCheck style={{ width: '1.75rem', height: '1.75rem', color: 'var(--badge-text)' }} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--badge-text)' }}>
            ✓ Verified on Midnight Preprod
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Proved without revealing your input. Your proof was submitted successfully.
          </div>
          {txHash && (
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              marginTop: '0.4rem',
              wordBreak: 'break-all',
              color: 'var(--text-muted)'
            }}>
              Transaction ID: {txHash}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
