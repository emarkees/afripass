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
    <div id="verify" className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 my-12 shadow-md max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-sm font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" /> Privacy Verification Circuit
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold mb-2">Verify Credentials Privately</h3>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base">
          Execute the local ZK circuit to prove financial eligibility on the Midnight Preprod contract without exposing your private input.
        </p>
      </div>

      {/* Contract & State Metadata Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 w-full">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[0.75rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider">PREPROD CONTRACT</div>
          <div className="font-mono text-xs font-semibold break-all mt-1 text-[var(--primary-emerald)]">
            {contractAddress.slice(0, 14)}...{contractAddress.slice(-10)}
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[0.75rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider">CIRCUIT NAME</div>
          <div className="font-mono text-sm font-bold mt-1 text-[var(--accent-indigo)]">
            increment_counter(step)
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[0.75rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider">PUBLIC VERIFIED CLAIM COUNTER</div>
          <div className="font-mono text-xl font-extrabold text-[var(--badge-text)] mt-0.5">
            {lastCounter}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-md">
        <div className="flex flex-col gap-2 text-left mb-5">
          <label className="text-sm font-semibold text-[var(--text-secondary)] flex justify-between items-center">
            <span>Private Witness Credential (Synthetic Monthly Income - NGN)</span>
            <button
              type="button"
              onClick={() => setShowMasked(!showMasked)}
              className="bg-transparent border-0 text-[var(--text-muted)] text-xs cursor-pointer flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
            >
              {showMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showMasked ? 'Masked 🔒' : 'Show Value'}
            </button>
          </label>

          <div className="relative">
            <input
              type={showMasked ? 'password' : 'text'}
              value={stepInput}
              onChange={(e) => setStepInput(e.target.value)}
              disabled={proofState === 'generating' || proofState === 'submitting'}
              className="w-full py-3.5 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-base focus:outline-none focus:border-[var(--primary-emerald)] focus:ring-3 focus:ring-[rgba(16,185,129,0.15)] transition-all"
              placeholder="e.g. 350000"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] flex items-center gap-1 pointer-events-none">
              <Lock className="w-3.5 h-3.5 text-[var(--primary-emerald)]" /> Private Input
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            🔒 This information remains strictly private on your device. It is never transmitted unencrypted to verifiers.
          </p>
        </div>

        <PrivacyStatus proofState={proofState} txHash={txHash} />

        <div className="mt-6 text-center">
          {!isConnected ? (
            <button type="button" onClick={onConnect} className="w-full py-4 px-7 rounded-xl font-bold text-base cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm">
              Connect Lace Wallet to Verify
            </button>
          ) : (
            <button
              type="submit"
              disabled={proofState === 'generating' || proofState === 'submitting'}
              className="w-full py-4 px-7 rounded-xl font-bold text-base cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {proofState === 'generating' || proofState === 'submitting' ? (
                <>
                  <Cpu className="animate-spin w-5 h-5" /> Generating ZK Proof...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Private Proof
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Security Guarantee Notice */}
      <div className="mt-7 p-4 bg-[var(--badge-bg)] border border-[var(--badge-border)] rounded-xl text-xs text-[var(--badge-text)] flex items-center gap-3">
        <Lock className="w-5 h-5 shrink-0" />
        <div>
          <strong>Privacy Security Guarantee:</strong> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.
        </div>
      </div>
    </div>
  );
};
