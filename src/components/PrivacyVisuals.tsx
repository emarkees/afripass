'use client';

import React from 'react';
import { Shield, Lock, CheckCircle2, Cpu, Database, EyeOff, FileText, Sparkles } from 'lucide-react';

export const HeroPrivacyFlow: React.FC = () => {
  return (
    <div className="visual-section" style={{ margin: '2rem 0', padding: '2rem' }}>
      <div className="section-header">
        <span className="privacy-badge">
          <Shield style={{ width: '1rem', height: '1rem' }} /> Local ZK Proof Pipeline
        </span>
        <h3 className="section-title">Zero-Knowledge Verification Model</h3>
        <p className="section-subtitle">How AfriPass protects sensitive credentials before ledger submission</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem 0'
      }}>
        {/* Step 1 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <FileText style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Private Witness</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Income Credential (step)</div>
        </div>

        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>➔</div>

        {/* Step 2 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'var(--badge-bg)',
            border: '1px solid var(--badge-border)',
            color: 'var(--primary-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <Lock style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>🔒 ZK Shield</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Local Witness Encryption</div>
        </div>

        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>➔</div>

        {/* Step 3 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            color: 'var(--accent-indigo)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <Cpu style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>ZK Proof</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Compact Circuit Output</div>
        </div>

        <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>➔</div>

        {/* Step 4 */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'var(--badge-bg)',
            border: '1px solid var(--badge-border)',
            color: 'var(--badge-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Verified On-Chain</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Midnight Preprod Ledger</div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyCards: React.FC = () => {
  return (
    <div className="cards-grid">
      {/* Card 1 */}
      <div className="card">
        <div className="card-icon">
          <Lock style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
        <h4 className="card-title">KEEP DATA PRIVATE</h4>
        <p className="card-desc">
          Sensitive financial credentials remain a private input during verification and are never sent to external servers or public chains.
        </p>
      </div>

      {/* Card 2 */}
      <div className="card">
        <div className="card-icon">
          <CheckCircle2 style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
        <h4 className="card-title">PROVE WITHOUT REVEALING</h4>
        <p className="card-desc">
          Use zero-knowledge technology to prove your financial claim satisfies eligibility criteria without disclosing private underlying values.
        </p>
      </div>

      {/* Card 3 */}
      <div className="card">
        <div className="card-icon">
          <Shield style={{ width: '1.5rem', height: '1.5rem' }} />
        </div>
        <h4 className="card-title">VERIFY ON MIDNIGHT</h4>
        <p className="card-desc">
          Submit cryptographic verification proofs directly to the Midnight Preprod ledger for verifiable financial identity state updates.
        </p>
      </div>
    </div>
  );
};

export const PublicVsPrivateVisual: React.FC = () => {
  return (
    <div className="visual-section">
      <div className="section-header">
        <h3 className="section-title">Public vs. Private Architecture</h3>
        <p className="section-subtitle">Understanding what stays on your device vs. what is published to the Midnight ledger</p>
      </div>

      <div className="diagram-split">
        {/* Private Column */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px dashed rgba(239, 68, 68, 0.4)',
          borderRadius: '1rem',
          padding: '1.75rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: '#ef4444' }}>
            <EyeOff style={{ width: '1.5rem', height: '1.5rem' }} />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>PRIVATE WITNESS</h4>
          </div>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            fontFamily: 'monospace'
          }}>
            circuit input: step (Uint&lt;32&gt;)
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your private input (e.g. synthetic monthly income credential) is used strictly within the local WebAssembly ZK circuit to construct the mathematical proof. It is never transmitted across the network or logged anywhere.
          </p>
        </div>

        {/* Public Column */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--badge-border)',
          borderRadius: '1rem',
          padding: '1.75rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: 'var(--badge-text)' }}>
            <Database style={{ width: '1.5rem', height: '1.5rem' }} />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>PUBLIC RESULT</h4>
          </div>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '0.75rem',
            fontFamily: 'monospace'
          }}>
            ledger state: counter (Uint&lt;32&gt;)
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Only the verified state transition counter and proof compliance commitment are updated on the Midnight public ledger. Observers verify validity without recovering the private witness.
          </p>
        </div>
      </div>
    </div>
  );
};
