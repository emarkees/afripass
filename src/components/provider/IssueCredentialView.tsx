'use client';

import React, { useState } from 'react';
import { Provider } from '../../types/provider';
import { CredentialType, FinancialCredential } from '../../types/credential';
import { credentialService } from '../../services/credentialService';
import { auditService } from '../../services/auditService';
import { FilePlus, ShieldCheck, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface IssueCredentialViewProps {
  provider: Provider;
  onSuccess: (credential: FinancialCredential) => void;
}

export const IssueCredentialView: React.FC<IssueCredentialViewProps> = ({
  provider,
  onSuccess,
}) => {
  const [type, setType] = useState<CredentialType>('income');
  const [claim, setClaim] = useState<string>('Monthly Income Credential');
  const [value, setValue] = useState<string>('2000000');
  const [currency, setCurrency] = useState<string>('NGN');
  const [period, setPeriod] = useState<string>('6 months');
  const [expiresAt, setExpiresAt] = useState<string>('2026-12-31');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [issuedCred, setIssuedCred] = useState<FinancialCredential | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue <= 0) return;

    setIsSubmitting(true);
    try {
      const result = await credentialService.issueCredential({
        type,
        claim,
        value: numericValue,
        currency,
        period,
        issuerId: provider.id,
        issuerName: provider.name,
        expiresAt,
      });

      await auditService.logEvent({
        category: 'Credential',
        action: 'Credential Issued',
        details: `Issued ${claim} (${result.credentialId}) with ${currency} ${numericValue.toLocaleString()} metric.`,
        actor: `${provider.name} (${provider.businessEmail})`,
        severity: 'info',
      });

      setIssuedCred(result);
      onSuccess(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 text-left animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Issue Financial Credential</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Create an institutional attestation for a customer. The underlying monetary value remains client-encrypted.
            </p>
          </div>
        </div>

        {issuedCred ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-6 text-left animate-fadeIn">
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-base mb-2">
              <CheckCircle2 className="w-5 h-5" /> Credential Successfully Issued & Attested
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              The financial credential has been cryptographically signed by <strong>{provider.name}</strong> and transferred to the user's private passport.
            </p>

            <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)] text-xs space-y-2 mb-4 font-mono">
              <div>Credential ID: <strong>{issuedCred.credentialId}</strong></div>
              <div>Claim: <strong>{issuedCred.claim}</strong></div>
              <div>Issuer: <strong>{issuedCred.issuerName} (✓ Verified)</strong></div>
              <div>Display Threshold: <strong>{issuedCred.displayThreshold}</strong></div>
              <div>Expiration: <strong>{issuedCred.expiresAt}</strong></div>
            </div>

            <button
              onClick={() => setIssuedCred(null)}
              className="py-2.5 px-5 rounded-xl font-bold text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-emerald)] transition-colors cursor-pointer"
            >
              + Issue Another Credential
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Credential Category *
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    const newType = e.target.value as CredentialType;
                    setType(newType);
                    if (newType === 'income') setClaim('Monthly Income Credential');
                    if (newType === 'savings') setClaim('Savings History Credential');
                    if (newType === 'repayment') setClaim('Repayment Compliance Credential');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
                >
                  <option value="income">Income Credential</option>
                  <option value="savings">Savings Credential</option>
                  <option value="repayment">Repayment History Credential</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Credential Label / Title *
                </label>
                <input
                  type="text"
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
                  placeholder="e.g. Monthly Income Credential"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Private Value (Numeric) *
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] font-mono"
                  placeholder="e.g. 2000000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] font-mono"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="GHS">GHS (GH₵)</option>
                  <option value="USD">USD ($)</option>
                  <option value="COMPLIANCE">COMPLIANCE (%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Observation Period *
                </label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
                  placeholder="e.g. 6 months"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Expiration Date *
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--badge-bg)] border border-[var(--badge-border)] text-xs text-[var(--badge-text)] flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0 text-[var(--primary-emerald)]" />
              <span>
                <strong>Attestation Guarantee:</strong> This credential will carry institutional provenance from <strong>{provider.name}</strong> while keeping the value encrypted off-chain.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Attesting Credential...' : 'Sign & Issue Financial Credential'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
