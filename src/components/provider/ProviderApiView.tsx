'use client';

import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Check, ShieldCheck, AlertCircle, Trash2, Eye, EyeOff, Radio } from 'lucide-react';
import { apiKeyService } from '../../services/apiKeyService';
import { ApiKey, ApiPermissionScope } from '../../types/provider';

export const ProviderApiView: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [selectedScopes, setSelectedScopes] = useState<ApiPermissionScope[]>([
    'credential:read',
    'proof:verify',
  ]);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    apiKeyService.getApiKeys().then(setApiKeys);
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await apiKeyService.createApiKey(newKeyName.trim(), selectedScopes);
      setApiKeys([res.key, ...apiKeys]);
      setCreatedSecret(res.rawSecret);
      setNewKeyName('');
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      await apiKeyService.revokeApiKey(keyId);
      setApiKeys(apiKeys.map((k) => (k.id === keyId ? { ...k, status: 'revoked' } : k)));
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleScope = (scope: ApiPermissionScope) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">API Keys & Webhooks</h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Manage production credentials for server-to-server attestation and ZK verification integration.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create API Key
          </button>
        </div>

        {/* Newly Created Secret Key Alert */}
        {createdSecret && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-6 animate-fadeIn">
            <h3 className="font-bold text-sm text-amber-500 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Save Your Production API Secret Key
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              This secret key will <strong>never be shown again</strong>. Store it securely in your environment secrets manager.
            </p>
            <div className="flex items-center gap-2 bg-[var(--bg-input)] p-3 rounded-xl border border-[var(--border-color)] font-mono text-xs text-[var(--primary-emerald)] font-bold">
              <span className="flex-1 truncate">{createdSecret}</span>
              <button
                onClick={() => copyToClipboard(createdSecret)}
                className="py-1 px-3 rounded-lg bg-[var(--primary-emerald)] text-white hover:brightness-105 transition-all cursor-pointer flex items-center gap-1 text-[0.75rem]"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Create Key Form Modal / Card */}
        {isCreating && (
          <form onSubmit={handleCreateKey} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 mb-6 space-y-4">
            <h3 className="font-bold text-base text-[var(--text-primary)] mb-2">Create New API Key</h3>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Key Label / Application Name *
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Underwriting-Service-Production"
                required
                className="w-full py-2.5 px-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Permission Scopes (Least Privilege)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {(
                  [
                    'credential:issue',
                    'credential:read',
                    'credential:revoke',
                    'proof:request',
                    'proof:verify',
                    'organization:read',
                  ] as ApiPermissionScope[]
                ).map((scope) => (
                  <label
                    key={scope}
                    onClick={() => toggleScope(scope)}
                    className={`p-2.5 rounded-lg border cursor-pointer font-mono text-[0.75rem] transition-all ${
                      selectedScopes.includes(scope)
                        ? 'bg-emerald-500/10 border-[var(--primary-emerald)] text-[var(--primary-emerald)] font-bold'
                        : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}
                  >
                    ✓ {scope}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-[var(--primary-emerald)] hover:brightness-105"
              >
                Generate API Key
              </button>
            </div>
          </form>
        )}

        {/* Existing Keys Table */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm uppercase text-[var(--text-muted)] tracking-wider">Active API Keys</h3>
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[var(--text-primary)]">{key.name}</span>
                  <span
                    className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${
                      key.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                    }`}
                  >
                    {key.status.toUpperCase()}
                  </span>
                </div>
                <div className="font-mono text-xs text-[var(--primary-emerald)] font-semibold mb-2">
                  {key.maskedKey}
                </div>
                <div className="flex flex-wrap gap-1">
                  {key.permissions.map((p) => (
                    <span
                      key={p}
                      className="text-[0.65rem] font-mono py-0.5 px-2 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <div>Created: {key.createdAt}</div>
                {key.status === 'active' && (
                  <button
                    onClick={() => handleRevokeKey(key.id)}
                    className="py-1.5 px-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Webhooks Section */}
        <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-base text-[var(--text-primary)]">Webhook Integration Listeners</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            Receive automated real-time event notifications for `credential.issued`, `credential.revoked`, and `proof.verified`.
          </p>
          <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-color)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)] font-mono">https://api.demobank.ng/webhooks/afripass</span>
            <span className="font-bold text-emerald-500 py-0.5 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              ● Listening
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
