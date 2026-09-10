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
  ShieldCheck,
  CreditCard,
  Activity,
  FileCheck,
  Calendar,
  Check,
  TrendingUp,
  ArrowUpRight,
  UserCheck,
  Zap,
  Lock,
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

  // Monthly activity dataset for Shadcn-style visual chart
  const monthlyData = [
    { month: 'Apr', issued: 120, verified: 45 },
    { month: 'May', issued: 180, verified: 78 },
    { month: 'Jun', issued: 240, verified: 110 },
    { month: 'Jul', issued: 210, verified: 95 },
    { month: 'Aug', issued: 310, verified: 142 },
    { month: 'Sep', issued: 224, verified: 116 },
  ];

  const maxVal = 350;

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

      {/* Top Header Bar & Quick Actions (Shadcn Header Style) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-color)]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              {stats?.organizationName || provider.name}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> Approved Institution
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            {stats?.organizationType || provider.type} &bull; {provider.country} &bull; {provider.businessEmail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('issue')}
            className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center gap-2"
          >
            <FilePlus className="w-4 h-4" /> Issue Credential
          </button>
          <button
            onClick={() => onNavigateTab('verify')}
            className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Search className="w-4 h-4" /> Verify ZK Proof
          </button>
        </div>
      </div>

      {/* 4 Primary Shadcn Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Credentials Issued */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-[var(--primary-emerald)] transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Total Credentials Issued</span>
            <FileCheck className="w-4 h-4 text-[var(--primary-emerald)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-mono">
            {isLoading ? '...' : stats?.credentialsIssued.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-emerald-500 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% <span className="text-[var(--text-muted)] font-normal">from last month</span>
          </div>
        </div>

        {/* Card 2: Active Credentials */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Active Credentials</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-mono">
            {isLoading ? '...' : stats?.activeCredentials.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-emerald-500 font-semibold mt-2">
            <UserCheck className="w-3.5 h-3.5" /> 93.5% <span className="text-[var(--text-muted)] font-normal">active compliance rate</span>
          </div>
        </div>

        {/* Card 3: Midnight Proofs Verified */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-indigo-500 transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Midnight ZK Proofs Verified</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-mono">
            {isLoading ? '...' : stats?.proofsVerified.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-indigo-400 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.2% <span className="text-[var(--text-muted)] font-normal">from last week</span>
          </div>
        </div>

        {/* Card 4: API Volume */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-cyan-500 transition-all">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">API Requests (30d)</span>
            <Activity className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-mono">
            {isLoading ? '...' : stats?.apiCalls.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-cyan-400 font-semibold mt-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> &lt;14ms <span className="text-[var(--text-muted)] font-normal">avg response latency</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Shadcn Dashboard Section (Chart & Recent Audit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7/12) — Activity Overview Chart */}
        <div className="lg:col-span-7 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Overview</h3>
                <p className="text-xs text-[var(--text-secondary)]">Monthly attestation and zero-knowledge verification volume.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <span className="w-3 h-3 rounded-sm bg-[var(--primary-emerald)] inline-block"></span> Issued
                </span>
                <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block"></span> Verified
                </span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-64 mt-6 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[var(--border-color)]">
              {monthlyData.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Issued Bar */}
                    <div
                      className="w-3.5 sm:w-4 rounded-t-md bg-[var(--primary-emerald)] opacity-90 group-hover:opacity-100 transition-all relative"
                      style={{ height: `${(d.issued / maxVal) * 100}%` }}
                      title={`${d.month} Issued: ${d.issued}`}
                    ></div>
                    {/* Verified Bar */}
                    <div
                      className="w-3.5 sm:w-4 rounded-t-md bg-indigo-500 opacity-90 group-hover:opacity-100 transition-all relative"
                      style={{ height: `${(d.verified / maxVal) * 100}%` }}
                      title={`${d.month} Verified: ${d.verified}`}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-muted)] font-mono">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-[var(--text-secondary)]">
            <span>Ledger Network: <strong>Midnight Preprod</strong></span>
            <span className="text-[var(--primary-emerald)] font-semibold">✓ Synchronization Active</span>
          </div>
        </div>

        {/* Right Column (5/12) — Recent Network Activity */}
        <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Recent Activity</h3>
                <p className="text-xs text-[var(--text-secondary)]">Latest attestation and proof events.</p>
              </div>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-xs text-[var(--primary-emerald)] font-bold hover:underline"
              >
                View all →
              </button>
            </div>

            <div className="space-y-4">
              {/* Event 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">Monthly Income Credential</div>
                    <div className="text-[var(--text-muted)]">Subject: subject-anon-849</div>
                  </div>
                </div>
                <span className="text-[0.7rem] font-semibold text-emerald-500 font-mono">Issued</span>
              </div>

              {/* Event 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">PROOF-AFP-849201</div>
                    <div className="text-[var(--text-muted)]">Income ≥ ₦1,000,000</div>
                  </div>
                </div>
                <span className="text-[0.7rem] font-semibold text-indigo-400 font-mono">Verified</span>
              </div>

              {/* Event 3 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">API Key Created</div>
                    <div className="text-[var(--text-muted)]">Underwriting-Integration-Key</div>
                  </div>
                </div>
                <span className="text-[0.7rem] font-semibold text-cyan-400 font-mono">Active</span>
              </div>

              {/* Event 4 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">Multi-Factor Login</div>
                    <div className="text-[var(--text-muted)]">IP 197.210.64.12 &bull; Lagos</div>
                  </div>
                </div>
                <span className="text-[0.7rem] font-semibold text-[var(--text-muted)] font-mono">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Subscription & Infrastructure Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[0.7rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Subscription Plan
            </span>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {stats?.currentPlan || 'Professional Tier'}
            </div>
            <div className="text-xs text-emerald-500 font-semibold mt-1">
              Status: {stats?.subscriptionStatus.toUpperCase() || 'ACTIVE'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[0.7rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Subscription Renewal
            </span>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {stats?.subscriptionRenewal || '30 September 2026'}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Auto-renews via Invoice</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[0.7rem] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
              Network Status
            </span>
            <div className="text-lg font-bold text-emerald-500">
              Midnight Preprod
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">Zero-Knowledge Ledger Connected</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
