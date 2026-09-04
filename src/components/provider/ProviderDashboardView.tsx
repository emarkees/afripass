'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from '../../types/provider';
import {
  Building2,
  FilePlus,
  Search,
  CheckCircle2,
  Clock,
  Key,
  Lock,
  CreditCard,
  Activity,
  FileCheck,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { ProviderTab } from './ProviderSidebarNav';
import { providerService, DashboardStats } from '../../services/providerService';

interface ProviderDashboardViewProps {
  provider: Provider;
  onNavigateTab: (tab: ProviderTab) => void;
}

export const ProviderDashboardView: React.FC<ProviderDashboardViewProps> = ({
  provider,
  onNavigateTab,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const liveStats = await providerService.getDashboardStats();
        if (isMounted) setStats(liveStats);
      } catch (err) {
        console.warn('Dashboard stats API fetch warning:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const isPending = provider.status === 'pending';

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Onboarding KYC Review Banner */}
      {isPending && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-amber-600 dark:text-amber-400 text-xs sm:text-sm flex items-start gap-3">
          <Clock className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm mb-1">Organization Status: Pending Verification Review</h4>
            <p className="leading-relaxed">
              Your organization registration is currently under review by AfriPass Network Compliance. Once approved, you will have production privileges to issue and verify financial credentials.
            </p>
          </div>
        </div>
      )}

      {/* Hero Welcome Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">
                  {stats?.organizationName || provider.name}
                </h1>
                <span className="text-xs font-bold py-0.5 px-2.5 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                  {stats?.organizationRole || provider.role.toUpperCase()}
                </span>
                <span className="text-xs font-bold py-0.5 px-2.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Approved Provider
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                {stats?.organizationType || provider.type} &bull; {provider.country} &bull; {provider.businessEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('issue')}
              className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <FilePlus className="w-4 h-4" /> Issue Credential
            </button>
            <button
              onClick={() => onNavigateTab('verify')}
              className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" /> Verify ZK Proof
            </button>
          </div>
        </div>
      </div>

      {/* Primary Section 7 Statistics Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Credentials Issued */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            Credentials Issued
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--primary-emerald)]">
            {isLoading ? '...' : stats?.credentialsIssued.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Total attested claims
          </div>
        </div>

        {/* Active Credentials */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            Active Credentials
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {isLoading ? '...' : stats?.activeCredentials.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Currently valid
          </div>
        </div>

        {/* Revoked Credentials */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            Revoked Credentials
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-500">
            {isLoading ? '...' : stats?.revokedCredentials.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Deactivated by issuer
          </div>
        </div>

        {/* Expired Credentials */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            Expired Credentials
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[var(--text-muted)]">
            {isLoading ? '...' : stats?.expiredCredentials.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Past expiration date
          </div>
        </div>

        {/* Proofs Verified */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            Proofs Verified
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-500">
            {isLoading ? '...' : stats?.proofsVerified.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Midnight ZK proofs
          </div>
        </div>

        {/* Verification Requests */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            Verification Requests
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cyan-500">
            {isLoading ? '...' : stats?.verificationRequests.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Incoming consent requests
          </div>
        </div>

        {/* Active API Keys */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            Active API Keys
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-purple-500">
            {isLoading ? '...' : stats?.activeApiKeys.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Production keys active
          </div>
        </div>

        {/* API Usage */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm">
          <span className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
            API Calls
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-blue-500">
            {isLoading ? '...' : stats?.apiCalls.toLocaleString()}
          </div>
          <div className="text-[0.72rem] text-[var(--text-secondary)] mt-1">
            Current billing cycle
          </div>
        </div>
      </div>

      {/* Subscription & Organization Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Current Plan
            </span>
            <div className="text-xl font-extrabold text-[var(--text-primary)]">
              {stats?.currentPlan || 'Professional'}
            </div>
            <div className="text-xs text-emerald-500 font-bold mt-1">
              Status: {stats?.subscriptionStatus.toUpperCase() || 'ACTIVE'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Subscription Renewal
            </span>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {stats?.subscriptionRenewal || '30 September 2026'}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Auto-renews via Invoice</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Organization Status
            </span>
            <div className="text-lg font-bold text-emerald-500 capitalize">
              {stats?.organizationStatus || provider.status}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Institutional Attestation Enabled</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Quick Access Navigation Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-4">
              <FilePlus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Issue Financial Credential</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Attest monthly income, savings, or loan repayment history for a user.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('issue')}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-emerald)] transition-colors cursor-pointer"
          >
            Go to Issue Form →
          </button>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Verify ZK Proof</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Verify customer proof commitments directly on Midnight without raw bank data.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('verify')}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-indigo-500 transition-colors cursor-pointer"
          >
            Open Verifier Portal →
          </button>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center mb-4">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">API & Webhooks</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Manage production API keys and configure automated webhook listeners.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('api')}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-cyan-500 transition-colors cursor-pointer"
          >
            Manage API Keys →
          </button>
        </div>
      </div>
    </div>
  );
};
