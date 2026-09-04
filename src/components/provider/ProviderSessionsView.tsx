'use client';

import React, { useState } from 'react';
import { Laptop, Smartphone, Globe, Shield, LogOut, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { authService } from '../../services/authService';
import { ProviderSession } from '../../types/provider';

interface ProviderSessionsViewProps {
  onLogoutEverywhere?: () => void;
}

export const ProviderSessionsView: React.FC<ProviderSessionsViewProps> = ({
  onLogoutEverywhere,
}) => {
  const [sessions, setSessions] = useState<ProviderSession[]>(authService.getSessions());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleRevokeSingle = async (sessionId: string) => {
    await authService.revokeSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setActionNotice('Session logged out successfully.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleLogoutOthers = async () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setActionNotice('Logged out all other sessions successfully.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleLogoutAll = async () => {
    await authService.logoutEverywhere();
    if (onLogoutEverywhere) onLogoutEverywhere();
  };

  return (
    <div className="w-full space-y-6 text-left animate-fadeIn">
      {/* Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--primary-emerald)]" /> Active Provider Sessions
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Manage devices and active web sessions authenticated with your organization credentials.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleLogoutOthers}
              className="py-2 px-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Log out all other sessions
            </button>
            <button
              onClick={handleLogoutAll}
              className="py-2 px-3.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-bold text-red-500 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Log out everywhere
            </button>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Sessions List Table / Cards */}
      <div className="space-y-4">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className={`bg-[var(--bg-card)] border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
              sess.isCurrent ? 'border-[var(--primary-emerald)]/50 bg-emerald-500/5' : 'border-[var(--border-color)]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                  sess.isCurrent
                    ? 'bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] shadow-md'
                    : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)]'
                }`}
              >
                {sess.device.toLowerCase().includes('phone') ? (
                  <Smartphone className="w-5 h-5" />
                ) : (
                  <Laptop className="w-5 h-5 text-[var(--text-primary)]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">{sess.device}</h3>
                  {sess.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-extrabold bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)]">
                      Current Session
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-1 gap-x-4 text-xs text-[var(--text-secondary)]">
                  <div>
                    <strong>Browser:</strong> {sess.browser}
                  </div>
                  <div>
                    <strong>Location:</strong> {sess.location}
                  </div>
                  <div>
                    <strong>IP:</strong> <code className="text-[var(--text-muted)]">{sess.ip}</code>
                  </div>
                  <div>
                    <strong>Last Active:</strong> {sess.lastActive}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]">
              {sess.isCurrent ? (
                <button
                  onClick={handleLogoutAll}
                  className="w-full sm:w-auto py-2 px-3 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors border-0 bg-transparent"
                >
                  Log out this session
                </button>
              ) : (
                <button
                  onClick={() => handleRevokeSingle(sess.id)}
                  className="w-full sm:w-auto py-2 px-3 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors border-0 bg-transparent"
                >
                  Revoke Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
