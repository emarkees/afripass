'use client';

import React, { useState } from 'react';
import { ShieldCheck, Cpu, Lock, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { PrivacyStatus } from './PrivacyStatus';

interface CircuitCallProps {
  isConnected: boolean;
  proofState: 'idle' | 'generating' | 'submitting' | 'success' | 'error';
  txHash: string | null;
  lastCounter: number;
  contractAddress: string;
  error: string | null;
  onCallCircuit: (stepAmount: number) => Promise<void>;
  onConnect: () => void;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({
  isConnected,
  proofState,
  txHash,
  lastCounter,
  contractAddress,
  error,
  onCallCircuit,
  onConnect,
}) => {
  const [stepInput, setStepInput] = useState<string>('350000');
  const [showMasked, setShowMasked] = useState<boolean>(true);
  const [submittedWitness, setSubmittedWitness] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      onConnect();
      return;
    }

    const amount = parseInt(stepInput, 10);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    setSubmittedWitness(true);
    await onCallCircuit(amount);
  };

  return (
    <div id="verify" className="visual-section" style={{ maxWidth: '800px', margin: '3rem auto' }}>
      <div className="section-header">
        <span className="privacy-badge">
          <ShieldCheck style={{ width: '1rem', height: '1rem' }} /> Privacy Verification Circuit
        </span>
        <h3 className="section-title">Verify Credentials Privately</h3>
        <p className="section-subtitle">
          Execute the local ZK circuit to prove financial eligibility on the Midnight Preprod contract without exposing your private input.
        </p>
      </div>

      {/* Contract & State Metadata Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PREPROD CONTRACT</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600, wordBreak: 'break-all', marginTop: '0.25rem', color: 'var(--primary-emerald)' }}>
            {contractAddress.slice(0, 14)}...{contractAddress.slice(-10)}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CIRCUIT NAME</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--accent-indigo)' }}>
            increment_counter(step)
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PUBLIC VERIFIED CLAIM COUNTER</div>
          <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, color: 'var(--badge-text)', marginTop: '0.1rem' }}>
            {lastCounter}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Private Witness Credential (Synthetic Monthly Income - NGN)</span>
            <button
              type="button"
              onClick={() => setShowMasked(!showMasked)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {showMasked ? <EyeOff style={{ width: '0.9rem', height: '0.9rem' }} /> : <Eye style={{ width: '0.9rem', height: '0.9rem' }} />}
              {showMasked ? 'Masked 🔒' : 'Show Value'}
            </button>
          </label>

          <div style={{ position: 'relative' }}>
            <input
              type={showMasked ? 'password' : 'text'}
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              disabled={proofState === 'generating' || proofState === 'submitting'}
              className="form-input"
              placeholder="e.g. 350000"
              required
            />
            <div style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Lock style={{ width: '0.85rem', height: '0.85rem', color: 'var(--primary-emerald)' }} /> Private Input
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            🔒 This information remains strictly private on your device. It is never transmitted unencrypted to verifiers.
          </p>
        </div>

        <PrivacyStatus proofState={proofState} txHash={txHash} />

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          {!isConnected ? (
            <button type="button" onClick={onConnect} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
              Connect Lace Wallet to Verify
            </button>
          ) : (
            <button
              type="submit"
              disabled={proofState === 'generating' || proofState === 'submitting'}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', gap: '0.5rem' }}
            >
              {proofState === 'generating' || proofState === 'submitting' ? (
                <>
                  <Cpu className="animate-spin" style={{ width: '1.25rem', height: '1.25rem' }} /> Generating ZK Proof...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} /> Generate Private Proof
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Security Guarantee Notice */}
      <div style={{
        marginTop: '1.75rem',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--badge-bg)',
        border: '1px solid var(--badge-border)',
        borderRadius: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--badge-text)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <Lock style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
        <div>
          <strong>Privacy Security Guarantee:</strong> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.
        </div>
      </div>
    </div>
  );
};
