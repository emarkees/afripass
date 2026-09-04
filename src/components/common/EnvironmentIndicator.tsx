'use client';

import React from 'react';
import { ShieldCheck, Server, Lock } from 'lucide-react';

export const EnvironmentIndicator: React.FC = () => {
  return (
    <div className="w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] py-1.5 px-4 text-[0.7rem] font-mono flex flex-wrap items-center justify-between gap-2 text-[var(--text-muted)]">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-[var(--primary-emerald)] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[var(--primary-emerald)] animate-pulse"></span>
          Ledger: Midnight Preprod ZK Network
        </span>
        <span className="hidden sm:inline-block text-[var(--border-color)]">|</span>
        <span className="hidden sm:flex items-center gap-1.5 text-cyan-500 font-semibold">
          <Server className="w-3 h-3" />
          Backend API: Go v1.22 REST (Healthy)
        </span>
      </div>

      <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold">
        <Lock className="w-3 h-3 text-[var(--primary-emerald)]" />
        <span>Strict Privacy: Off-Chain Financial Witnesses</span>
      </div>
    </div>
  );
};
