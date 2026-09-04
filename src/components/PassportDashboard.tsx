'use client';

import React from 'react';
import { Shield, Lock, CheckCircle2, Globe, Wallet, ShieldCheck, Sparkles } from 'lucide-react';

interface PassportDashboardProps {
  isConnected: boolean;
  address: string | null;
  networkId: string | null;
  activeCredentialsCount: number;
  onNavigateToProve: () => void;
  onNavigateToCredentials: () => void;
}

export const PassportDashboard: React.FC<PassportDashboardProps> = ({
  isConnected,
  address,
  networkId,
  activeCredentialsCount,
  onNavigateToProve,
  onNavigateToCredentials,
}) => {
  return (
    <section id="passport" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-10 scroll-mt-24">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] rounded-2xl flex items-center justify-center text-white shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">AFRIPASS</h2>
                <span className="text-xs font-bold py-0.5 px-2.5 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                  Level 2 Passport
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Financial Identity & Verified Credential Hub</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onNavigateToCredentials}
              className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
            >
              View Credentials ({activeCredentialsCount})
            </button>
            <button
              onClick={onNavigateToProve}
              className="py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Create Private ZK Proof
            </button>
          </div>
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
          {/* Card 1: Identity Status */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-2">IDENTITY STATUS</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--primary-emerald)] shrink-0" />
              <span className="font-bold text-base text-[var(--text-primary)]">Financial Passport</span>
            </div>
            <div className="mt-3 text-xs text-emerald-500 font-bold">✓ Active</div>
          </div>

          {/* Card 2: Financial Credential Status */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-2">CREDENTIALS</div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
              <span className="font-bold text-base text-[var(--text-primary)]">{activeCredentialsCount} Verified</span>
            </div>
            <div className="mt-3 text-xs text-indigo-500 font-bold">✓ Issuer Attested</div>
          </div>

          {/* Card 3: Privacy Status */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-2">PRIVACY PROTECTION</div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[var(--primary-emerald)] shrink-0" />
              <span className="font-bold text-base text-[var(--text-primary)]">Zero-Knowledge</span>
            </div>
            <div className="mt-3 text-xs text-emerald-500 font-bold">✓ Enabled</div>
          </div>

          {/* Card 4: Midnight Network */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-2">MIDNIGHT NETWORK</div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500 shrink-0" />
              <span className="font-bold text-base text-[var(--text-primary)] capitalize">{networkId || 'preprod'}</span>
            </div>
            <div className="mt-3 text-xs text-cyan-500 font-bold">✓ Active Ledger</div>
          </div>

          {/* Card 5: Wallet Status */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col justify-between shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-2">LACE WALLET</div>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[var(--primary-emerald)] shrink-0" />
              <span className="font-bold text-sm text-[var(--text-primary)] truncate">
                {isConnected ? `${address?.slice(0, 8)}...` : 'Not Connected'}
              </span>
            </div>
            <div className={`mt-3 text-xs font-bold ${isConnected ? 'text-emerald-500' : 'text-amber-500'}`}>
              {isConnected ? '✓ Connected' : '⚠ Click to Connect'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
