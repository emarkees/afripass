'use client';

import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, CheckCircle2, ExternalLink, Globe, Search, Lock } from 'lucide-react';
import { providerService } from '../../services/providerService';
import { Provider } from '../../types/provider';

export const ProviderDirectoryView: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    providerService.getProvidersDirectory().then(setProviders);
  }, []);

  const filtered = providers.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || p.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4" /> AfriPass Network Governance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">Approved Provider Registry</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Trusted financial institutions, banks, fintechs, and lenders authorized to attest credentials and verify ZK proofs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="py-2 px-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Provider Types</option>
              <option value="bank">Banks</option>
              <option value="fintech">Fintechs</option>
              <option value="lender">Lenders</option>
              <option value="cooperative">Cooperatives</option>
            </select>
          </div>
        </div>

        {/* Provider Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider by institution name or country (e.g. Nigeria, Kenya, Demo Bank)..."
            className="w-full py-3 pl-10 pr-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-emerald)]"
          />
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:border-[var(--primary-emerald)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] text-white flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[0.65rem] font-bold py-0.5 px-2.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Approved
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[var(--text-primary)] mb-1">{p.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-mono mb-3">
                  {p.type} &bull; {p.country}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] space-y-2 text-xs">
                <div className="flex justify-between text-[0.75rem]">
                  <span className="text-[var(--text-muted)]">Capabilities:</span>
                  <span className="font-bold text-indigo-500 uppercase">{p.role}</span>
                </div>
                <div className="flex justify-between text-[0.75rem]">
                  <span className="text-[var(--text-muted)]">Credentials Issued:</span>
                  <span className="font-bold font-mono">{p.credentialsIssuedCount.toLocaleString()}</span>
                </div>
                <a
                  href={p.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.75rem] text-[var(--primary-emerald)] font-bold flex items-center gap-1 hover:underline pt-1"
                >
                  Visit Institutional Website <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
