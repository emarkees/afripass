'use client';

import React from 'react';
import { ShieldCheck, Server, Lock, Globe } from 'lucide-react';

interface EnvironmentIndicatorProps {
  networkId?: string | null;
  onSwitchNetwork?: (network: 'preprod' | 'preview') => void;
}

export const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({
  networkId = 'preprod',
  onSwitchNetwork,
}) => {
  const isPreview = networkId === 'preview';
  const activeNetworkName = isPreview ? 'Midnight Preview' : 'Midnight Preprod';

  return (
    <div className="w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] py-1.5 px-4 text-[0.7rem] font-mono flex flex-wrap items-center justify-between gap-2 text-[var(--text-muted)]">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
          <span className={`w-2 h-2 rounded-full animate-pulse ${isPreview ? 'bg-cyan-500' : 'bg-[var(--primary-emerald)]'}`}></span>
          Ledger: <strong className={isPreview ? 'text-cyan-500' : 'text-[var(--primary-emerald)]'}>{activeNetworkName} ZK Network</strong>
        </span>

        {onSwitchNetwork && (
          <div className="inline-flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded-md border border-[var(--border-color)] text-[0.65rem]">
            <button
              onClick={() => onSwitchNetwork('preprod')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                !isPreview ? 'bg-[var(--primary-emerald)] text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Preprod
            </button>
            <button
              onClick={() => onSwitchNetwork('preview')}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                isPreview ? 'bg-cyan-600 text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Preview
            </button>
          </div>
        )}

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

