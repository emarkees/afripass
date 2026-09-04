'use client';

import React, { useState } from 'react';
import { ShieldCheck, Cpu, Lock, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, Check, Info, FileText, Server, Share2, ExternalLink } from 'lucide-react';
import { PrivacyStatus } from './PrivacyStatus';
import { IssuerBadge } from './IssuerBadge';
import { ProofResultModal } from './ProofResultModal';
import { FinancialCredential, ProofResult } from '../types/credential';
import { MOCK_CREDENTIALS } from '../data/mockCredentials';

interface CircuitCallProps {
  isConnected: boolean;
  proofState: 'idle' | 'generating' | 'submitting' | 'success' | 'error';
  txHash: string | null;
  lastCounter: number;
  contractAddress: string;
  error: string | null;
  selectedCredentialForProof?: FinancialCredential | null;
  onCallCircuit: (stepAmount: number) => Promise<void>;
  onConnect: () => void;
  onNavigateToVerify?: (proofId: string) => void;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({
  isConnected,
  proofState,
  txHash,
  lastCounter,
  contractAddress,
  error,
  selectedCredentialForProof,
  onCallCircuit,
  onConnect,
  onNavigateToVerify,
}) => {
  const [credentialSource, setCredentialSource] = useState<'attested' | 'synthetic'>('attested');
  const [stepInput, setStepInput] = useState<string>('');
  const [showMasked, setShowMasked] = useState<boolean>(true);
  const [activeProofResult, setActiveProofResult] = useState<ProofResult | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);

  const isInputValid = Boolean(stepInput && stepInput.trim() !== '' && !isNaN(Number(stepInput)) && Number(stepInput) > 0);
  const isButtonDisabled = !isInputValid || proofState === 'generating' || proofState === 'submitting';

  // Selected credential info
  const currentCredential = selectedCredentialForProof || MOCK_CREDENTIALS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid) return;
    if (!isConnected) {
      onConnect();
      return;
    }

    const amount = parseInt(stepInput, 10);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    await onCallCircuit(amount);

    // Create ProofResult object
    const generatedResult: ProofResult = {
      proofId: `PROOF-AFP-${Math.floor(100000 + Math.random() * 900000)}`,
      claim: 'Monthly Income ≥ ₦1,000,000',
      result: true,
      issuerName: credentialSource === 'attested' ? currentCredential.issuerName : 'Synthetic User Input',
      issuerVerified: credentialSource === 'attested',
      credentialStatus: currentCredential.status,
      midnightNetwork: 'Midnight Preprod',
      txHash: txHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      underlyingDataDisclosed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setActiveProofResult(generatedResult);
  };

  return (
    <div id="verify" className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 my-12 shadow-md max-w-4xl mx-auto text-left">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs sm:text-sm font-semibold mb-3">
          <ShieldCheck className="w-4 h-4" /> Midnight ZK Proof Pipeline
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold mb-2">Prove Income Eligibility</h3>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-2xl mx-auto">
          Prove that your verified income satisfies the required threshold (≥ ₦1,000,000) on the Midnight Preprod contract without exposing underlying bank statements.
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
          <div className="text-[0.75rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider">COMPACT CIRCUIT</div>
          <div className="font-mono text-sm font-bold mt-1 text-indigo-500">
            increment_counter(step)
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col justify-between">
          <div className="text-[0.75rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider">PUBLIC VERIFIED CLAIMS</div>
          <div className="font-mono text-xl font-extrabold text-[var(--badge-text)] mt-0.5">
            {lastCounter}
          </div>
        </div>
      </div>

      {/* Credential Source Toggle */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 mb-8">
        <div className="text-sm font-bold text-[var(--text-primary)] mb-3">Select Credential Source:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            onClick={() => setCredentialSource('attested')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              credentialSource === 'attested'
                ? 'bg-emerald-500/10 border-[var(--primary-emerald)] text-[var(--text-primary)]'
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-slate-400'
            }`}
          >
            <input
              type="radio"
              name="source"
              checked={credentialSource === 'attested'}
              onChange={() => setCredentialSource('attested')}
              className="mt-1 accent-[var(--primary-emerald)]"
            />
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                <span>Issuer-Attested Credential</span>
                <IssuerBadge issuerName={currentCredential.issuerName} issuerStatus={currentCredential.issuerStatus} />
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Attested by {currentCredential.issuerName} ({currentCredential.displayThreshold}). Provenance is cryptographically attached.
              </p>
            </div>
          </label>

          <label
            onClick={() => setCredentialSource('synthetic')}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              credentialSource === 'synthetic'
                ? 'bg-amber-500/10 border-amber-500 text-[var(--text-primary)]'
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-slate-400'
            }`}
          >
            <input
              type="radio"
              name="source"
              checked={credentialSource === 'synthetic'}
              onChange={() => setCredentialSource('synthetic')}
              className="mt-1 accent-amber-500"
            />
            <div>
              <div className="font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span>Synthetic Demo Credential</span>
                <span className="text-[0.65rem] font-bold py-0.5 px-2 rounded-md bg-amber-500/20 text-amber-500 border border-amber-500/30 uppercase">DEMO MODE</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Manually supplied demo value. Used for development testing without institutional provenance.
              </p>
            </div>
          </label>
        </div>

        {credentialSource === 'synthetic' && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>DEMO MODE:</strong> This credential is synthetic and does not represent a real financial institution. Zero-knowledge proofs prove the numerical condition, while issuer attestations establish data authenticity.
            </span>
          </div>
        )}
      </div>

      {/* 6-Step Visual ZK Sequence Pipeline */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            6-STEP VERIFICATION PIPELINE FLOW
          </div>
          <span className="text-xs font-semibold py-0.5 px-2.5 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
            {proofState === 'idle' && 'Ready to Prove'}
            {proofState === 'generating' && '⚡ Processing Local ZK Witness...'}
            {proofState === 'submitting' && '⚡ Submitting to Midnight Preprod...'}
            {proofState === 'success' && '✓ Verification Complete'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* STEP 1 */}
          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-emerald-500/50 text-left transition-all">
            <div className="text-[0.65rem] text-emerald-500 font-bold mb-1">STEP 1</div>
            <div className="font-bold text-[var(--text-primary)] mb-1">Credential</div>
            <div className="text-[0.65rem] text-emerald-500 font-medium">✓ Credential Found</div>
          </div>

          {/* STEP 2 */}
          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-emerald-500/50 text-left transition-all">
            <div className="text-[0.65rem] text-emerald-500 font-bold mb-1">STEP 2</div>
            <div className="font-bold text-[var(--text-primary)] mb-1">Attestation</div>
            <div className="text-[0.65rem] text-emerald-500 font-medium">✓ {credentialSource === 'attested' ? 'Issuer Verified' : 'Synthetic Mode'}</div>
          </div>

          {/* STEP 3 */}
          <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-emerald-500/50 text-left transition-all">
            <div className="text-[0.65rem] text-emerald-500 font-bold mb-1">STEP 3</div>
            <div className="font-bold text-[var(--text-primary)] mb-1">Condition</div>
            <div className="text-[0.65rem] text-emerald-500 font-medium">✓ Income ≥ ₦1M</div>
          </div>

          {/* STEP 4 */}
          <div className={`p-3 rounded-xl bg-[var(--bg-card)] border text-left transition-all ${
            proofState === 'generating' || proofState === 'submitting' || proofState === 'success'
              ? 'border-emerald-500/50'
              : 'border-[var(--border-color)] opacity-75'
          }`}>
            <div className="text-[0.65rem] text-indigo-500 font-bold mb-1">STEP 4</div>
            <div className="font-bold text-[var(--text-primary)] mb-1">Local Witness</div>
            <div className="text-[0.65rem] text-[var(--text-muted)] font-medium">
              {proofState === 'generating' ? '⚡ Witness Active' : proofState === 'success' ? '✓ Private Witness' : '🔒 Private Device'}
            </div>
          </div>

          {/* STEP 5 */}
          <div className={`p-3 rounded-xl bg-[var(--bg-card)] border text-left transition-all ${
            proofState === 'generating'
              ? 'border-amber-500 animate-pulse bg-amber-500/10'
              : proofState === 'submitting' || proofState === 'success'
              ? 'border-emerald-500/50'
              : 'border-[var(--border-color)] opacity-75'
          }`}>
            <div className="text-[0.65rem] text-amber-500 font-bold mb-1">STEP 5</div>
            <div className="font-bold text-[var(--text-primary)] mb-1">ZK Proof</div>
            <div className="text-[0.65rem] text-[var(--text-muted)] font-medium">
              {proofState === 'generating' ? '⚡ Generating Proof...' : proofState === 'submitting' || proofState === 'success' ? '✓ Proof Generated' : '⏳ Compact Circuit'}
            </div>
          </div>

          {/* STEP 6 */}
          <div className={`p-3 rounded-xl bg-[var(--bg-card)] border text-left transition-all ${
            proofState === 'submitting'
              ? 'border-cyan-500 animate-pulse bg-cyan-500/10'
              : proofState === 'success'
              ? 'border-emerald-500/50'
              : 'border-[var(--border-color)] opacity-75'
          }`}>
            <div className="text-[0.65rem] text-cyan-500 font-bold mb-1">STEP 6</div>
            <div className="font-bold text-[var(--text-primary)] mb-1">On-Chain</div>
            <div className="text-[0.65rem] text-[var(--text-muted)] font-medium">
              {proofState === 'submitting' ? '⚡ Submitting...' : proofState === 'success' ? '✓ Midnight Preprod' : '⏳ Ledger Submit'}
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col gap-2 text-left mb-5">
          <label className="text-sm font-semibold text-[var(--text-secondary)] flex justify-between items-center">
            <span>Private Witness Value (Monthly Income Metric - NGN)</span>
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
              placeholder="e.g. 2000000"
              required
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] flex items-center gap-1 pointer-events-none">
              <Lock className="w-3.5 h-3.5 text-[var(--primary-emerald)]" /> Private Witness
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1.5">
            🔒 Processed exclusively inside local browser WebAssembly ZK circuit. Never sent to network unencrypted.
          </p>
        </div>

        <PrivacyStatus proofState={proofState} txHash={txHash} />

        <div className="mt-6 text-center">
          {!isConnected ? (
            <button
              type="button"
              onClick={onConnect}
              className="w-full py-4 px-7 rounded-xl font-bold text-base cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm"
            >
              Connect Lace Wallet to Generate ZK Proof
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isButtonDisabled}
                title={!isInputValid ? "Please enter a valid private witness value to generate proof" : "Generate ZK Proof"}
                className="w-full py-4 px-7 rounded-xl font-bold text-base cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                {proofState === 'generating' || proofState === 'submitting' ? (
                  <>
                    <Cpu className="animate-spin w-5 h-5" /> Generating Midnight ZK Proof...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Generate Private Proof
                  </>
                )}
              </button>
              {!isInputValid && (
                <p className="text-xs text-amber-500 font-semibold">
                  ⚠️ Enter your private witness value above to enable ZK proof generation.
                </p>
              )}
            </div>
          )}
        </div>
      </form>

      {/* Generated Proof Actions Bar */}
      {proofState === 'success' && activeProofResult && (
        <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
          <div>
            <div className="font-bold text-emerald-500 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Private Proof Ready & Verified
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              Claim: Income ≥ ₦1,000,000 &bull; Issuer: {activeProofResult.issuerName}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setResultModalOpen(true)}
              className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-emerald)] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> View Proof Summary
            </button>
            {onNavigateToVerify && (
              <button
                onClick={() => onNavigateToVerify(activeProofResult.proofId)}
                className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[var(--primary-emerald)] hover:brightness-105 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" /> Open Verifier
              </button>
            )}
          </div>
        </div>
      )}

      {/* Security Guarantee Notice */}
      <div className="mt-7 p-4 bg-[var(--badge-bg)] border border-[var(--badge-border)] rounded-xl text-xs text-[var(--badge-text)] flex items-center gap-3">
        <Lock className="w-5 h-5 shrink-0 text-[var(--primary-emerald)]" />
        <div>
          <strong className="text-[var(--primary-emerald)]">Proved without revealing your input:</strong> AfriPass combines issuer attestation with Midnight zero-knowledge technology to allow the required financial condition to be proven without exposing underlying bank records.
        </div>
      </div>

      {/* Proof Result Modal */}
      {resultModalOpen && activeProofResult && (
        <ProofResultModal
          result={activeProofResult}
          onClose={() => setResultModalOpen(false)}
          onNavigateToVerify={(pId) => {
            if (onNavigateToVerify) onNavigateToVerify(pId);
          }}
        />
      )}
    </div>
  );
};
