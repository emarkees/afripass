'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

interface ProviderForgotPasswordViewProps {
  onBackToLogin: () => void;
}

export const ProviderForgotPasswordView: React.FC<ProviderForgotPasswordViewProps> = ({
  onBackToLogin,
}) => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const msg = await authService.forgotPassword(email);
      // Requirement #7: Generic response ("If an account exists for this email, you'll receive a password reset link.")
      setNoticeMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 animate-fadeIn text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">Reset Password</h2>
          <p className="text-xs text-[var(--text-secondary)]">Enter your registered work email to receive password reset instructions.</p>
        </div>

        {noticeMsg ? (
          <div className="text-center space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-400 flex items-start gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{noticeMsg}</span>
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full py-3 rounded-xl font-bold text-xs text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </button>
          </div>
        ) : (
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
                  className="w-full py-3 pl-10 pr-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-emerald)]"
                  placeholder="compliance@institution.com"
                />
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Password Reset Link'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer border-0 bg-transparent inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
