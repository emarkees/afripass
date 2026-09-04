'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, Lock, QrCode, Copy, FileText, AlertCircle } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import { ProofResult } from '../../types/credential';

export const ProviderVerifyView: React.FC = () => {
  const [proofInput, setProofInput] = useState<string>('PROOF-AFP-849201');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resultPayload, setResultPayload] = useState<ProofResult | null>(null);
  const [activeMode, setActiveMode] = useState<'code' | 'qr'>('code');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofInput.trim()) return;

    setIsVerifying(true);
    try {
      const res = await verificationService.verifyProofPayload(proofInput.trim());
      setResultPayload(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-xl">
        <div className="text-center mb-8 max-w-xl mx-auto">
          <span className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" /> Provider ZK Proof Verifier
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-2">
            Verify Customer ZK Proof
          </h2>
          <p className="text-xs sm:text-base text-[var(--text-secondary)]">
            Verify zero-knowledge proof commitments directly against the Midnight Preprod ledger without requesting raw bank statements.
          </p>
        </div>

        {/* Verification Method Tabs */}
        <div className="flex justify-center gap-2 mb-6 border-b border-[var(--border-color)] pb-4">
          <button
            onClick={() => setActiveMode('code')}
            className={`py-2 px-4 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'code'
                ? 'bg-[var(--primary-emerald)] text-white shadow-sm'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Proof Code / Payload
          </button>

          <button
            onClick={() => setActiveMode('qr')}
            className={`py-2 px-4 rounded-xl font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'qr'
                ? 'bg-[var(--primary-emerald)] text-white shadow-sm'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> Scan Verification QR
          </button>
        </div>

        {activeMode === 'qr' ? (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 text-center max-w-md mx-auto mb-8">
            <QrCode className="w-16 h-16 text-[var(--primary-emerald)] mx-auto mb-4 animate-pulse" />
            <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">QR Code Scanner Ready</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Position the customer's AfriPass Verification QR code within camera range to automatically decode proof reference.
            </p>
            <button
              onClick={() => setActiveMode('code')}
              className="py-2.5 px-6 rounded-xl font-bold text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-emerald)]"
            >
              Switch to Manual Input
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 mb-8 shadow-sm">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              ENTER PROOF COMMITMENT ID OR PAYLOAD
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={proofInput}
                  onChange={(e) => setProofInput(e.target.value)}
                  className="w-full py-3.5 px-4 pr-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
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
                {isVerifying ? 'Verifying Proof...' : 'Verify Proof'}
              </button>
            </div>
          </form>
        )}

        {/* Output Result Table */}
        {resultPayload && (
          <div className="bg-[var(--bg-surface)] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-md text-left animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[var(--text-primary)]">AFRIPASS VERIFICATION RESULT</h3>
                  <p className="text-xs text-[var(--text-muted)]">Midnight Preprod Ledger Verification &bull; {resultPayload.createdAt}</p>
                </div>
              </div>

              <span className="py-1 px-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-xs inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> PROOF VALID & SATISFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-6">
              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Verified Claim:</span>
                  <span className="font-bold text-[var(--text-primary)]">{resultPayload.claim}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Attesting Institution:</span>
                  <span className="font-semibold text-emerald-500">✓ {resultPayload.issuerName} (Approved)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--text-muted)]">Credential Status:</span>
                  <span className="font-bold text-emerald-500">✓ Active</span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Requirement Status:</span>
                  <span className="font-bold text-emerald-500">✓ Satisfied</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-muted)]">Midnight ZK Proof:</span>
                  <span className="font-bold text-indigo-500">✓ Valid Cryptographic Proof</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--text-muted)]">Ledger State:</span>
                  <span className="font-mono text-xs text-[var(--primary-emerald)] font-bold">Midnight Preprod</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--badge-bg)] border border-[var(--badge-border)] rounded-xl p-4 text-xs text-[var(--badge-text)] space-y-2">
              <div className="font-bold text-[var(--primary-emerald)] flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> Non-Disclosed Private Data Summary:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.8rem]">
                <div>Exact Income: <strong>🔒 Not Disclosed</strong></div>
                <div>Bank Account Balances: <strong>🔒 Not Disclosed</strong></div>
                <div>Full Bank Statements: <strong>🔒 Not Disclosed</strong></div>
                <div>Transaction Logs: <strong>🔒 Not Disclosed</strong></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
