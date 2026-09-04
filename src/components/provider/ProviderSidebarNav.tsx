'use client';

import React from 'react';
import { LayoutDashboard, FilePlus, FileCheck, Search, Key, ShieldCheck, Building2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { Provider } from '../../types/provider';

export type ProviderTab =
  | 'dashboard'
  | 'issue'
  | 'verify'
  | 'requests'
  | 'team'
  | 'api'
  | 'webhooks'
  | 'billing'
  | 'audit'
  | 'organization';

interface ProviderSidebarNavProps {
  currentTab: ProviderTab;
  provider: Provider;
  onSelectTab: (tab: ProviderTab) => void;
  onLogout: () => void;
  onSwitchToUserMode: () => void;
}

export const ProviderSidebarNav: React.FC<ProviderSidebarNavProps> = ({
  currentTab,
  provider,
  onSelectTab,
  onLogout,
  onSwitchToUserMode,
}) => {
  const isApproved = provider.status === 'approved';

  return (
    <aside className="w-full lg:w-64 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-4 text-left shadow-md shrink-0 flex flex-col justify-between">
      <div>
        {/* Provider Profile Header Card */}
        <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-[var(--primary-emerald)]" />
            <h3 className="font-extrabold text-sm text-[var(--text-primary)] truncate">{provider.name}</h3>
          </div>

          <div className="flex items-center justify-between text-[0.7rem] mt-2">
            <span className="text-[var(--text-muted)] font-mono">{provider.type}</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full ${
                isApproved ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
              }`}
            >
              {isApproved ? '✓ Approved' : '⏳ Pending Review'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          {(provider.role === 'issuer' || provider.role === 'both') && (
            <button
              onClick={() => onSelectTab('issue')}
              className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                currentTab === 'issue'
                  ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FilePlus className="w-4 h-4" /> Issue Credential
            </button>
          )}

          {(provider.role === 'verifier' || provider.role === 'both') && (
            <button
              onClick={() => onSelectTab('verify')}
              className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                currentTab === 'verify'
                  ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Search className="w-4 h-4" /> Verify ZK Proof
            </button>
          )}

          <button
            onClick={() => onSelectTab('requests')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'requests'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Verification Requests
          </button>

          <button
            onClick={() => onSelectTab('team')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'team'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Building2 className="w-4 h-4" /> Team & Roles
          </button>

          <button
            onClick={() => onSelectTab('api')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'api'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Key className="w-4 h-4" /> API Keys & Access
          </button>

          <button
            onClick={() => onSelectTab('webhooks')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'webhooks'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Webhooks
          </button>

          <button
            onClick={() => onSelectTab('billing')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'billing'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Building2 className="w-4 h-4" /> Billing & SaaS Plans
          </button>

          <button
            onClick={() => onSelectTab('audit')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'audit'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Security & Audit Log
          </button>

          <button
            onClick={() => onSelectTab('organization')}
            className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 transition-all text-left cursor-pointer ${
              currentTab === 'organization'
                ? 'bg-[var(--primary-emerald)] text-white font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Building2 className="w-4 h-4" /> Organization Profile
          </button>
        </nav>
      </div>

      <div className="pt-4 mt-6 border-t border-[var(--border-color)] space-y-2">
        <button
          onClick={onSwitchToUserMode}
          className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer text-center block"
        >
          ↔ Switch to User View
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Log Out
        </button>
      </div>
    </aside>
  );
};
