'use client';

import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';
import { authService } from '../../services/authService';
import { Provider } from '../../types/provider';

interface ProviderLoginViewProps {
  onSuccess: (provider: Provider) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword?: () => void;
  onNavigateToVerifyEmail?: (email: string) => void;
}

export const ProviderLoginView: React.FC<ProviderLoginViewProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToVerifyEmail,
}) => {
  const [email, setEmail] = useState<string>('compliance@demobank.ng');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{ type: 'review' | 'suspended' | 'unverified' | 'deactivated'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setStatusBanner(null);

    try {
      const provider = await authService.login(email, password, rememberMe);

      // Check Email Verification & Organization Statuses per Spec #6
      if (provider.emailVerified === false || provider.userAccountStatus === 'pending_verification') {
        setStatusBanner({
          type: 'unverified',
          message: 'Please verify your email before continuing.',
        });
        if (onNavigateToVerifyEmail) {
          setTimeout(() => onNavigateToVerifyEmail(email), 1500);
        }
        return;
      }

      if (provider.status === 'pending' || provider.status === 'under_review') {
        setStatusBanner({
          type: 'review',
          message: 'Your organization is currently under review.',
        });
        onSuccess(provider);
        return;
      }

      if (provider.status === 'suspended') {
        setStatusBanner({
          type: 'suspended',
          message: 'Your organization has been suspended. Contact AfriPass support.',
        });
        return;
      }

      if (provider.status === 'deactivated' || provider.userAccountStatus === 'deactivated') {
        setErrorMsg('You do not have permission to access this area.');
        return;
      }

      onSuccess(provider);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid work email or password. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-10 animate-fadeIn text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] flex items-center justify-center text-white mx-auto mb-4 shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">Sign in to AfriPass</h2>
          <p className="text-xs text-[var(--text-secondary)]">Join the privacy-preserving financial verification network.</p>
        </div>

        {/* Status Notification Banners for Requirement #6 */}
        {statusBanner?.type === 'review' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 mb-5 text-xs text-amber-500 flex items-start gap-2.5">
            <Clock className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Under Review:</strong> {statusBanner.message} Administrator access is active, but production credentials issuance will remain restricted until full approval.
            </div>
          </div>
        )}

        {statusBanner?.type === 'suspended' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 mb-5 text-xs text-red-500 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Suspended:</strong> {statusBanner.message}
            </div>
          </div>
        )}

        {statusBanner?.type === 'unverified' && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3.5 mb-5 text-xs text-blue-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Email Verification Required:</strong> {statusBanner.message}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 mb-5 text-xs text-red-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              Work Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-colors"
                placeholder="compliance@institution.com"
              />
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-[0.75rem] text-[var(--primary-emerald)] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)] transition-colors"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Remember this device checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[var(--border-color)] text-[var(--primary-emerald)] focus:ring-[var(--primary-emerald)]"
              />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
          Need a Provider Account?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-[var(--primary-emerald)] font-bold hover:underline bg-transparent border-0 cursor-pointer"
          >
            Create Provider Account
          </button>
        </div>
      </div>
    </div>
  );
};
