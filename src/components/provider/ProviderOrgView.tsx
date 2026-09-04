'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Users, ShieldCheck, Mail, Globe, CheckCircle2, UserPlus, Lock } from 'lucide-react';
import { Provider, ProviderMember, StaffRole } from '../../types/provider';
import { providerService } from '../../services/providerService';

interface ProviderOrgViewProps {
  provider: Provider;
}

export const ProviderOrgView: React.FC<ProviderOrgViewProps> = ({ provider }) => {
  const [members, setMembers] = useState<ProviderMember[]>([]);

  useEffect(() => {
    providerService.getTeamMembers(provider.id).then(setMembers);
  }, [provider.id]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left animate-fadeIn">
      {/* Organization Profile Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">{provider.name}</h2>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1">
                <span>{provider.type}</span> &bull; <span>{provider.country}</span> &bull;{' '}
                <span className="text-emerald-500 font-bold">✓ Approved Provider</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Business Email:</span>
              <span className="font-semibold text-[var(--text-primary)]">{provider.businessEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Official Website:</span>
              <span className="font-semibold text-[var(--primary-emerald)]">{provider.website}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Contact Person:</span>
              <span className="font-semibold text-[var(--text-primary)]">{provider.contactPerson}</span>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)] space-y-2">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Provider Roles:</span>
              <span className="font-bold text-indigo-500 uppercase">{provider.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Attestation Registry:</span>
              <span className="font-bold text-emerald-500">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Onboarded Date:</span>
              <span className="font-mono text-xs">{provider.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff & Role Management */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--primary-emerald)]" />
            <h3 className="font-bold text-lg text-[var(--text-primary)]">Staff Team & Role Management</h3>
          </div>
          <button className="py-2 px-4 rounded-xl font-bold text-xs text-white bg-[var(--primary-emerald)] hover:brightness-105 transition-all cursor-pointer flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" /> Invite Team Member
          </button>
        </div>

        <div className="space-y-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="font-bold text-sm text-[var(--text-primary)]">{m.name}</div>
                <div className="text-[var(--text-muted)]">{m.email}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-xs py-1 px-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--primary-emerald)] font-bold uppercase">
                  {m.role}
                </span>
                <span className="py-0.5 px-2 rounded-full bg-emerald-500/10 text-emerald-500 text-[0.65rem] font-bold">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
