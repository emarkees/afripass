'use client';

import React, { useState } from 'react';
import { Shield, Key, Lock, CheckCircle2, AlertCircle, Smartphone, Globe, Clock, History, AlertTriangle } from 'lucide-react';
import { Provider } from '../../types/provider';
import { authService } from '../../services/authService';
import { ProviderSessionsView } from './ProviderSessionsView';

interface ProviderSecurityViewProps {
  currentProvider: Provider;
}

export const ProviderSecurityView: React.FC<ProviderSecurityViewProps> = ({
  currentProvider,
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'auth' | 'sessions' | 'activity' | 'events'>('password');

  // Change Password state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdNotice, setPwdNotice] = useState<string | null>(null);
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setPwdNotice('New passwords do not match.');
      return;
    }
    setIsUpdatingPwd(true);
    try {
      await authService.changePassword(currentPwd, newPwd);
      setPwdNotice('Password changed successfully.');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } finally {
      setIsUpdatingPwd(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-left animate-fadeIn">
      {/* Security Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] flex items-center justify-center text-white shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">Security Center</h1>
            <p className="text-xs text-[var(--text-secondary)]">Manage organization authentication, active sessions, and security events.</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[var(--border-color)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('password')}
            className={`py-2 px-4 rounded-xl cursor-pointer transition-all ${
              activeTab === 'password'
                ? 'bg-[var(--primary-emerald)] text-white font-bold'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Password & Credentials
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`py-2 px-4 rounded-xl cursor-pointer transition-all ${
              activeTab === 'auth'
                ? 'bg-[var(--primary-emerald)] text-white font-bold'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Multi-Factor & Identity
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-4 rounded-xl cursor-pointer transition-all ${
              activeTab === 'sessions'
                ? 'bg-[var(--primary-emerald)] text-white font-bold'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Active Sessions
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-4 rounded-xl cursor-pointer transition-all ${
              activeTab === 'events'
                ? 'bg-[var(--primary-emerald)] text-white font-bold'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Security Events & Audit Log
          </button>
        </div>
      </div>

      {/* Tab: Password */}
      {activeTab === 'password' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-sm max-w-xl">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-[var(--primary-emerald)]" /> Change Account Password
          </h2>

          {pwdNotice && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4 text-xs text-emerald-400">
              {pwdNotice}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
                className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPwd}
              className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isUpdatingPwd ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* Tab: Multi-Factor & Identity */}
      {activeTab === 'auth' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[var(--primary-emerald)]" /> Multi-Factor & MFA Architecture
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Enhanced authentication security and identity provider integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--text-primary)]">Email Verification</span>
                <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Verified ✓
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Work email address confirmed for identity recovery and security alerts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--text-primary)]">TOTP Authenticator (MFA)</span>
                <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  MFA Ready
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Architecture support for 6-digit TOTP apps (Google Authenticator, Authy).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--text-primary)]">FIDO2 / Passkeys</span>
                <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Passkey Ready
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Hardware WebAuthn security keys and biometric sign-in.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--text-primary)]">Enterprise SSO / Okta</span>
                <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  SAML / OIDC Ready
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                SAML2 and OpenID Connect identity provider federation for enterprise teams.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sessions */}
      {activeTab === 'sessions' && <ProviderSessionsView />}

      {/* Tab: Security Events */}
      {activeTab === 'events' && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--primary-emerald)]" /> Security Events & Audit Trail
          </h2>

          <div className="divide-y divide-[var(--border-color)]">
            <div className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[var(--text-primary)]">User Login</span> &bull; Successful administrator authentication
                <div className="text-[0.7rem] text-[var(--text-muted)]">IP: 197.210.64.12 &bull; Lagos, NG</div>
              </div>
              <span className="text-[var(--text-muted)] font-mono">Today at 10:14</span>
            </div>

            <div className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[var(--text-primary)]">Organization Capabilities Updated</span> &bull; Configured Issuer + Verifier mode
                <div className="text-[0.7rem] text-[var(--text-muted)]">Actor: Owner</div>
              </div>
              <span className="text-[var(--text-muted)] font-mono">Yesterday at 16:30</span>
            </div>

            <div className="py-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[var(--text-primary)]">Password Changed</span> &bull; User password updated successfully
                <div className="text-[0.7rem] text-[var(--text-muted)]">Actor: Administrator</div>
              </div>
              <span className="text-[var(--text-muted)] font-mono">3 days ago</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
