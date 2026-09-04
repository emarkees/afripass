import React, { useState } from 'react';
import { Provider } from '../../types/provider';

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'disabled';
  secretKey: string;
  createdAt: string;
}

interface ProviderWebhookViewProps {
  currentProvider: Provider;
}

const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh-001',
    url: 'https://api.demobank.ng/webhooks/afripass',
    events: ['credential.issued', 'credential.revoked', 'proof.verified'],
    status: 'active',
    secretKey: 'whsec_9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c',
    createdAt: '2026-08-10',
  },
];

export const ProviderWebhookView: React.FC<ProviderWebhookViewProps> = ({ currentProvider }) => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(INITIAL_WEBHOOKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'credential.issued',
    'proof.verified',
  ]);

  const toggleEvent = (evt: string) => {
    if (selectedEvents.includes(evt)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== evt));
    } else {
      setSelectedEvents([...selectedEvents, evt]);
    }
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    const newEndpoint: WebhookEndpoint = {
      id: `wh-${Math.floor(100 + Math.random() * 900)}`,
      url: targetUrl,
      events: selectedEvents,
      status: 'active',
      secretKey: `whsec_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setWebhooks([...webhooks, newEndpoint]);
    setTargetUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Webhook Integration</h1>
          <p className="text-sm text-slate-400">
            Receive real-time signed HTTP POST callbacks when credential or verification events occur for{' '}
            <span className="text-slate-200 font-medium">{currentProvider.name}</span>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <span>+ Add Webhook Endpoint</span>
        </button>
      </div>

      {/* Webhook List */}
      <div className="space-y-4">
        {webhooks.map((wh) => (
          <div key={wh.id} className="bg-slate-900/60 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-200">{wh.url}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ✓ {wh.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Configured on {wh.createdAt}</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl">
                  Test Payload
                </button>
              </div>
            </div>

            {/* Secret & Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block font-semibold text-slate-400 mb-1">Signing Secret Key (HMAC-SHA256)</span>
                <code className="block bg-slate-950 border border-slate-800 p-2 rounded-lg font-mono text-cyan-400 truncate">
                  {wh.secretKey}
                </code>
              </div>

              <div>
                <span className="block font-semibold text-slate-400 mb-1">Subscribed Event Triggers</span>
                <div className="flex flex-wrap gap-1.5">
                  {wh.events.map((evt) => (
                    <span key={evt} className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {evt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Webhook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-100">Add Webhook Endpoint</h3>

            <form onSubmit={handleAddWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">HTTPS Payload URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.yourcompany.com/webhooks/afripass"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Subscribe to Events</label>
                <div className="space-y-2 text-xs">
                  {['credential.issued', 'credential.revoked', 'verification.requested', 'proof.verified'].map((evt) => (
                    <label key={evt} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(evt)}
                        onChange={() => toggleEvent(evt)}
                        className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                      />
                      <span className="font-mono">{evt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-xl"
                >
                  Save Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
