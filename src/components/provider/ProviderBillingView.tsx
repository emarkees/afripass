import React, { useState } from 'react';
import { Provider } from '../../types/provider';

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'sandbox' | 'starter' | 'professional' | 'enterprise';
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  isPopular?: boolean;
}

interface Invoice {
  id: string;
  planName: string;
  amount: number;
  status: 'paid' | 'open' | 'failed';
  issuedAt: string;
  paidAt?: string;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-sandbox',
    name: 'Sandbox / Free',
    tier: 'sandbox',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      'Test/sandbox API access',
      'Synthetic credential issuance',
      'Test proof verification',
      '1 team member',
      '100 API requests/day',
    ],
  },
  {
    id: 'plan-starter',
    name: 'Starter',
    tier: 'starter',
    priceMonthly: 49,
    priceAnnual: 470,
    features: [
      'Production API access',
      'Credential issuance',
      'Proof verification',
      '5 team members',
      '10,000 API requests/month',
      'Basic audit logs',
    ],
  },
  {
    id: 'plan-professional',
    name: 'Professional',
    tier: 'professional',
    priceMonthly: 199,
    priceAnnual: 1910,
    features: [
      'Higher API limits',
      'Advanced verification',
      '20 team members',
      '100,000 API requests/month',
      'Webhooks & alerts',
      'Advanced audit logs',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    priceMonthly: 599,
    priceAnnual: 5750,
    features: [
      'Custom API limits',
      'Large-scale verification',
      'Unlimited team members',
      'Dedicated KMS / HSM signing',
      'Custom integrations',
      'SLA & 24/7 priority support',
    ],
  },
];

const INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    planName: 'Professional Plan',
    amount: 199.0,
    status: 'paid',
    issuedAt: '2026-08-01',
    paidAt: '2026-08-01',
  },
  {
    id: 'INV-2026-002',
    planName: 'Professional Plan',
    amount: 199.0,
    status: 'paid',
    issuedAt: '2026-09-01',
    paidAt: '2026-09-01',
  },
];

interface ProviderBillingViewProps {
  currentProvider: Provider;
}

export const ProviderBillingView: React.FC<ProviderBillingViewProps> = ({ currentProvider }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="space-y-8">
      {/* Current Active Plan Status */}
      <div className="bg-slate-900/60 dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-100">Current Subscription</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ✓ Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Organization: <span className="text-slate-200 font-medium">{currentProvider.name}</span> • Plan: Professional Tier
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              $199 / mo
            </div>
            <p className="text-xs text-slate-400">Renews on Oct 1, 2026</p>
          </div>
        </div>

        {/* API Usage Quota Progress */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span>API Request Quota (18,492 / 100,000 used)</span>
            <span className="text-cyan-400">18.5%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: '18.5%' }} />
          </div>
        </div>
      </div>

      {/* Plan Selection Cards */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Subscription Plans</h3>
            <p className="text-xs text-slate-400">Scale your institutional credential issuance and ZK verification limits.</p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                billingCycle === 'annual' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              Annual (2 Months Free)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-slate-900/60 dark:bg-slate-900/80 rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                plan.tier === 'professional'
                  ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div>
                <h4 className="text-base font-bold text-slate-100">{plan.name}</h4>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-black text-slate-100">
                    ${billingCycle === 'monthly' ? plan.priceMonthly : Math.floor(plan.priceAnnual / 12)}
                  </span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <ul className="space-y-2 mb-6 text-xs text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={plan.tier === 'professional'}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  plan.tier === 'professional'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                }`}
              >
                {plan.tier === 'professional' ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-slate-900/60 dark:bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Invoice History</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Invoice Ref</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-200">{inv.id}</td>
                  <td className="px-4 py-3 text-slate-300">{inv.planName}</td>
                  <td className="px-4 py-3 text-slate-200 font-semibold">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ✓ Paid
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{inv.issuedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
