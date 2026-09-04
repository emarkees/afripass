'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, RefreshCw, Edit3, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';

interface ProviderVerifyEmailViewProps {
  email: string;
  onVerified: () => void;
  onChangeEmail: () => void;
}

export const ProviderVerifyEmailView: React.FC<ProviderVerifyEmailViewProps> = ({
  email,
  onVerified,
  onChangeEmail,
}) => {
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus(null);
    try {
      await authService.resendVerificationEmail(email);
      setResendStatus('Verification email resent successfully! Please check your inbox.');
    } catch {
      setResendStatus('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleContinue = async () => {
    setIsVerifying(true);
    try {
      await authService.verifyEmail('sample_verif_token');
      onVerified();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 animate-fadeIn text-left">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] flex items-center justify-center text-white mx-auto mb-4 shadow-md">
          <Mail className="w-7 h-7" />
        </div>

        {/* Section 3 Requirement Header */}
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">Verify your email</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
          We've sent a verification email to your work email address:{' '}
          <strong className="text-[var(--text-primary)]">{email}</strong>
        </p>

        {resendStatus && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-5 text-xs text-emerald-400">
            {resendStatus}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            disabled={isVerifying}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isVerifying ? 'Verifying Email Status...' : 'Continue after verification'} <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleResend}
            disabled={isResending}
            className="w-full py-3 rounded-xl font-semibold text-xs text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} /> Resend verification email
          </button>

          <button
            onClick={onChangeEmail}
            className="w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer flex items-center justify-center gap-1 border-0 bg-transparent"
          >
            <Edit3 className="w-3 h-3" /> Change email address
          </button>
        </div>
      </div>
    </div>
  );
};
