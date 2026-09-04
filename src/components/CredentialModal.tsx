'use client';

import React, { useState } from 'react';
import { FinancialCredential } from '../types/credential';
import { X, ShieldCheck, Lock, Calendar, Building2, ChevronDown, ChevronUp, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { IssuerBadge } from './IssuerBadge';

interface CredentialModalProps {
  credential: FinancialCredential | null;
  onClose: () => void;
  onSelectForProof?: (credential: FinancialCredential) => void;
}

export const CredentialModal: React.FC<CredentialModalProps> = ({
  credential,
  onClose,
  onSelectForProof,
}) => {
  const [trustFlowOpen, setTrustFlowOpen] = useState<boolean>(true);

  if (!credential) return null;

  const isExpired = credential.status === 'expired';
  const isRevoked = credential.status === 'revoked';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--badge-bg)] border border-[var(--badge-border)] flex items-center justify-center text-[var(--primary-emerald)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Financial Credential</div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{credential.claim}</h2>
          </div>
        </div>

        {/* Primary Meta Grid */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-[var(--text-muted)] block mb-1">Credential ID:</span>
            <span className="font-mono font-bold text-[var(--text-primary)]">{credential.credentialId}</span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] block mb-1">Credential Type:</span>
            <span className="font-semibold text-[var(--text-primary)] capitalize">{credential.type} Eligibility</span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] block mb-1">Attesting Institution:</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--text-primary)]">{credential.issuerName}</span>
              <IssuerBadge issuerName={credential.issuerName} issuerStatus={credential.issuerStatus} />
            </div>
          </div>

          <div>
            <span className="text-[var(--text-muted)] block mb-1">Credential Status:</span>
            <span
              className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-xs ${
                credential.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  : credential.status === 'expired'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                  : 'bg-red-500/10 text-red-500 border border-red-500/30'
              }`}
            >
              {credential.status === 'active' && '✓ Active'}
              {credential.status === 'expired' && '⚠ Expired'}
              {credential.status === 'revoked' && '✕ Revoked'}
            </span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] block mb-1">Issued Date:</span>
            <span className="font-medium text-[var(--text-primary)]">{credential.issuedAt}</span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] block mb-1">Expiration Date:</span>
            <span className="font-medium text-[var(--text-primary)]">{credential.expiresAt}</span>
          </div>
        </div>

        {/* Private Value Notice */}
        <div className="bg-[var(--badge-bg)] border border-[var(--badge-border)] rounded-xl p-4 mb-6 text-xs text-[var(--badge-text)] flex items-start gap-3">
          <Lock className="w-5 h-5 shrink-0 text-[var(--primary-emerald)] mt-0.5" />
          <div>
            <strong>🔒 Privacy Guarantee:</strong> Underlying financial value ({credential.formattedValue}) remains strictly encrypted in your client application. It is never exposed unencrypted to lenders or verifiers.
          </div>
        </div>

        {isRevoked && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-xs text-red-500 flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <strong>Revoked Credential:</strong> {credential.revocationReason || 'This credential was revoked by the issuing institution and cannot be used for proof generation.'}
            </div>
          </div>
        )}

        {/* Expandable Trust Flow */}
        <div className="border border-[var(--border-color)] rounded-xl overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => setTrustFlowOpen(!trustFlowOpen)}
            className="w-full bg-[var(--bg-surface)] p-4 flex items-center justify-between font-bold text-xs sm:text-sm text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--primary-emerald)]" /> How this credential is trusted
            </span>
            {trustFlowOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {trustFlowOpen && (
            <div className="p-5 bg-[var(--bg-card)] border-t border-[var(--border-color)] text-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[0.75rem] font-semibold text-center">
                <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] flex-1 min-w-[100px]">
                  Financial Institution
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--primary-emerald)] shrink-0 hidden xs:block" />
                <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] flex-1 min-w-[100px]">
                  Issuer Attestation
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--primary-emerald)] shrink-0 hidden xs:block" />
                <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] flex-1 min-w-[100px]">
                  AfriPass Credential
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--primary-emerald)] shrink-0 hidden xs:block" />
                <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] flex-1 min-w-[100px]">
                  Midnight ZK Proof
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--primary-emerald)] shrink-0 hidden xs:block" />
                <div className="p-2.5 rounded-lg bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] flex-1 min-w-[100px]">
                  Verifier
                </div>
              </div>
              <p className="text-[var(--text-secondary)] text-[0.8rem] leading-relaxed">
                1. <strong>Demo Bank</strong> attests to financial records.<br />
                2. <strong>AfriPass</strong> stores the attested credential in your local wallet state.<br />
                3. <strong>Midnight ZK</strong> evaluates the eligibility requirement locally without revealing the underlying financial records.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {onSelectForProof && credential.status === 'active' && (
            <button
              onClick={() => {
                onSelectForProof(credential);
                onClose();
              }}
              className="flex-1 py-3 px-5 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm"
            >
              Use for Private ZK Proof
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl font-bold text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
