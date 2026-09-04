'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Mail,
  User,
  Lock,
  ArrowRight,
  Info,
  AlertTriangle,
  Phone,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { authService, AdminAccountForm, OrganizationForm } from '../../services/authService';
import { OrganizationType, ProviderRole, Provider } from '../../types/provider';

interface ProviderRegisterViewProps {
  onSuccess: (provider: Provider) => void;
  onNavigateToLogin: () => void;
  onNavigateToVerifyEmail?: (email: string) => void;
}

export const ProviderRegisterView: React.FC<ProviderRegisterViewProps> = ({
  onSuccess,
  onNavigateToLogin,
  onNavigateToVerifyEmail,
}) => {
  const [stage, setStage] = useState<1 | 2>(1);

  // Stage 1: Admin Account Form State
  const [adminForm, setAdminForm] = useState<AdminAccountForm>({
    firstName: '',
    lastName: '',
    workEmail: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  // Stage 2: Organization Form State
  const [orgForm, setOrgForm] = useState<OrganizationForm>({
    name: '',
    type: 'Bank',
    country: 'Nigeria',
    businessEmail: '',
    website: '',
    phone: '',
    registrationNumber: '',
    description: '',
    capability: 'both',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password validation checks
  const hasMinLength = adminForm.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(adminForm.password);
  const hasLowercase = /[a-z]/.test(adminForm.password);
  const hasNumber = /[0-9]/.test(adminForm.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(adminForm.password);
  const isPasswordMatch = adminForm.password === adminForm.confirmPassword && adminForm.confirmPassword !== '';

  const passwordScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const isDisposableEmail = (email: string): boolean => {
    const disposableDomains = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'trashmail.com'];
    const parts = email.split('@');
    if (parts.length < 2) return false;
    return disposableDomains.includes(parts[1].toLowerCase());
  };

  const handleStage1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!adminForm.firstName || !adminForm.lastName || !adminForm.workEmail || !adminForm.password) {
      setErrorMsg('Please fill in all required administrator fields.');
      return;
    }

    if (isDisposableEmail(adminForm.workEmail)) {
      setErrorMsg('Disposable or invalid work emails are not permitted.');
      return;
    }

    if (passwordScore < 4) {
      setErrorMsg('Please ensure password meets strength requirements (uppercase, lowercase, number, special char).');
      return;
    }

    if (!isPasswordMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    // Auto-fill business email if empty
    if (!orgForm.businessEmail) {
      setOrgForm((prev) => ({ ...prev, businessEmail: adminForm.workEmail }));
    }

    setStage(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!orgForm.name || !orgForm.businessEmail) {
      setErrorMsg('Organization name and business email are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newProvider = await authService.signupProvider({
        admin: adminForm,
        organization: orgForm,
      });

      if (onNavigateToVerifyEmail) {
        onNavigateToVerifyEmail(adminForm.workEmail);
      } else {
        onSuccess(newProvider);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 animate-fadeIn text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-10 shadow-xl">
        {/* Header Title Section per Spec #1 */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] flex items-center justify-center text-white mx-auto mb-4 shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-2">
            Create your AfriPass Provider Account
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Join the privacy-preserving financial verification network.
          </p>
        </div>

        {/* 2-Stage Progress Stepper Bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                stage === 1
                  ? 'bg-[var(--primary-emerald)] text-white'
                  : 'bg-[var(--primary-emerald)]/20 text-[var(--primary-emerald)]'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-semibold ${stage === 1 ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'}`}>
              Administrator Account
            </span>
          </div>
          <div className="w-12 h-[2px] bg-[var(--border-color)]" />
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                stage === 2
                  ? 'bg-[var(--primary-emerald)] text-white'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${stage === 2 ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-muted)]'}`}>
              Organization Details
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-xs text-red-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Stage 1 Form: Administrator Account */}
        {stage === 1 && (
          <form onSubmit={handleStage1Next} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={adminForm.firstName}
                  onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                  placeholder="e.g. Amina"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={adminForm.lastName}
                  onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                  placeholder="e.g. Bello"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  value={adminForm.workEmail}
                  onChange={(e) => setAdminForm({ ...adminForm, workEmail: e.target.value })}
                  placeholder="name@company.com"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={adminForm.phoneNumber}
                  onChange={(e) => setAdminForm({ ...adminForm, phoneNumber: e.target.value })}
                  placeholder="+234 801 234 5678"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={adminForm.confirmPassword}
                  onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>
            </div>

            {/* Password Strength Indicator Widget */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[var(--text-secondary)] font-semibold mb-1">
                <span>Password Strength Requirements:</span>
                <span className="font-bold text-[var(--primary-emerald)]">
                  {passwordScore === 5 ? 'Strong Password' : `${passwordScore}/5 met`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden flex gap-1">
                <div className={`h-full flex-1 transition-all ${passwordScore >= 1 ? 'bg-red-500' : 'bg-transparent'}`} />
                <div className={`h-full flex-1 transition-all ${passwordScore >= 3 ? 'bg-amber-500' : 'bg-transparent'}`} />
                <div className={`h-full flex-1 transition-all ${passwordScore >= 5 ? 'bg-emerald-500' : 'bg-transparent'}`} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[0.725rem]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-500 font-bold' : 'text-[var(--text-muted)]'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5" /> : '•'} 8+ Characters
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-500 font-bold' : 'text-[var(--text-muted)]'}`}>
                  {hasUppercase ? <Check className="w-3.5 h-3.5" /> : '•'} Uppercase Letter
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-500 font-bold' : 'text-[var(--text-muted)]'}`}>
                  {hasLowercase ? <Check className="w-3.5 h-3.5" /> : '•'} Lowercase Letter
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-500 font-bold' : 'text-[var(--text-muted)]'}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5" /> : '•'} Number
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-500 font-bold' : 'text-[var(--text-muted)]'}`}>
                  {hasSpecial ? <Check className="w-3.5 h-3.5" /> : '•'} Special Character
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-xs text-[var(--primary-emerald)] font-semibold hover:underline"
              >
                Already have an account? Sign In →
              </button>

              <button
                type="submit"
                className="py-3 px-8 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                Continue to Organization Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Stage 2 Form: Organization Details */}
        {stage === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  placeholder="e.g. ABC Finance & Micro-Lending"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Organization Type *
                </label>
                <select
                  value={orgForm.type}
                  onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value as OrganizationType })}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                >
                  <option value="Bank">Bank</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Lender">Lender</option>
                  <option value="Microfinance">Microfinance Institution</option>
                  <option value="Cooperative">Cooperative</option>
                  <option value="Credit Provider">Credit Provider</option>
                  <option value="Employer">Employer</option>
                  <option value="Merchant Finance">Merchant Finance Company</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Country *
                </label>
                <select
                  value={orgForm.country}
                  onChange={(e) => setOrgForm({ ...orgForm, country: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                >
                  <option value="Nigeria">Nigeria 🇳🇬</option>
                  <option value="Kenya">Kenya 🇰🇪</option>
                  <option value="Ghana">Ghana 🇬🇭</option>
                  <option value="South Africa">South Africa 🇿🇦</option>
                  <option value="Uganda">Uganda 🇺🇬</option>
                  <option value="Rwanda">Rwanda 🇷🇼</option>
                  <option value="Egypt">Egypt 🇪🇬</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  value={orgForm.businessEmail}
                  onChange={(e) => setOrgForm({ ...orgForm, businessEmail: e.target.value })}
                  placeholder="contact@abcfinance.com"
                  required
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={orgForm.website}
                  onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                  placeholder="https://abcfinance.com"
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Registration / Ref Number
                </label>
                <input
                  type="text"
                  value={orgForm.registrationNumber}
                  onChange={(e) => setOrgForm({ ...orgForm, registrationNumber: e.target.value })}
                  placeholder="RC-94029104"
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Provider Capabilities *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setOrgForm({ ...orgForm, capability: 'issuer' })}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    orgForm.capability === 'issuer'
                      ? 'bg-emerald-500/10 border-[var(--primary-emerald)] text-[var(--text-primary)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">Credential Issuer</div>
                  <p className="text-xs text-[var(--text-muted)]">Issue verified financial credentials to users.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrgForm({ ...orgForm, capability: 'verifier' })}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    orgForm.capability === 'verifier'
                      ? 'bg-indigo-500/10 border-indigo-500 text-[var(--text-primary)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">Proof Verifier</div>
                  <p className="text-xs text-[var(--text-muted)]">Verify privacy-preserving Midnight ZK proofs.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrgForm({ ...orgForm, capability: 'both' })}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    orgForm.capability === 'both'
                      ? 'bg-cyan-500/10 border-cyan-500 text-[var(--text-primary)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">Issuer + Verifier</div>
                  <p className="text-xs text-[var(--text-muted)]">Full access (Issue credentials & verify proofs).</p>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStage(1)}
                className="py-2.5 px-4 rounded-xl border border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-semibold flex items-center gap-1 hover:bg-[var(--bg-card-hover)]"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Administrator Step
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-8 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? 'Registering Provider...' : 'Complete Provider Registration'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
