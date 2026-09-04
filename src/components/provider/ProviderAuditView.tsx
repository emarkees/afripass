'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertCircle, Info, Clock, User } from 'lucide-react';
import { auditService } from '../../services/auditService';
import { AuditEvent } from '../../types/provider';

export const ProviderAuditView: React.FC = () => {
  const [logs, setLogs] = useState<AuditEvent[]>([]);

  useEffect(() => {
    auditService.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Security & Audit Log</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Immutable security record of credential attestations, ZK proof verifications, and staff access events.
            </p>
          </div>
        </div>

        {/* Audit Privacy Note */}
        <div className="bg-[var(--badge-bg)] border border-[var(--badge-border)] rounded-xl p-4 mb-6 text-xs text-[var(--badge-text)] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[var(--primary-emerald)] shrink-0" />
          <span>
            <strong>Zero-Knowledge Audit Standard:</strong> Audit logs record cryptographic commitments and metadata. Sensitive financial values are never recorded in audit streams.
          </span>
        </div>

        {/* Audit Log Table / Cards */}
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.7rem] py-0.5 px-2 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]">
                    {log.category}
                  </span>
                  <span className="font-bold text-[var(--text-primary)]">{log.action}</span>
                  {log.severity === 'warning' && (
                    <span className="text-[0.65rem] font-bold py-0.5 px-2 rounded bg-amber-500/20 text-amber-500">
                      WARNING
                    </span>
                  )}
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{log.details}</p>
                <div className="text-[0.7rem] text-[var(--text-muted)] flex items-center gap-3 pt-1">
                  <span>Actor: <strong>{log.actor}</strong></span>
                </div>
              </div>

              <div className="text-[0.7rem] text-[var(--text-muted)] font-mono shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
