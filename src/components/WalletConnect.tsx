'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, LogOut, CheckCircle2, AlertTriangle, ExternalLink, X } from 'lucide-react';

interface WalletConnectProps {
  isConnected: boolean;
  address: string | null;
  networkId: string | null;
  error: string | null;
  isLaceInstalled: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  address,
  networkId,
  error,
  isLaceInstalled,
  onConnect,
  onDisconnect,
}) => {
  const [displayError, setDisplayError] = useState<string | null>(null);

  // Auto-dismiss error alert after 10 seconds (10,000ms)
  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout(() => {
        setDisplayError(null);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setDisplayError(null);
    }
  }, [error]);

  const handleDismissError = () => {
    setDisplayError(null);
  };

  // Truncate wallet address safely for clean UI presentation
  const addressStr = address ? (typeof address === 'string' ? address : String((address as any)?.address || (address as any)?.unshieldedAddress || address)) : null;

  const truncatedAddress = addressStr
    ? addressStr.length > 16
      ? `${addressStr.slice(0, 10)}...${addressStr.slice(-6)}`
      : addressStr
    : null;

  return (
    <div className="relative">
      {/* Header Button Mode / Card View */}
      {isConnected ? (
        <div className="flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--badge-border)] rounded-xl px-3.5 py-2">
          <div className="flex items-center gap-2 text-[var(--badge-text)] text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Connected</span>
          </div>

          <div className="font-mono text-xs bg-[var(--bg-card)] px-2.5 py-1 rounded-md border border-[var(--border-color)] text-[var(--text-primary)]">
            {truncatedAddress}
          </div>

          <button
            onClick={onDisconnect}
            className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 h-auto rounded-lg font-bold text-xs cursor-pointer border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-sm"
            title="Disconnect Midnight Wallet"
            aria-label="Disconnect Midnight Lace Wallet"
          >
            <LogOut className="w-3.5 h-3.5" /> Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all shadow-sm shrink-0"
          aria-label="Connect Midnight Lace Wallet"
        >
          <Wallet className="w-4 h-4" /> Connect Wallet
        </button>
      )}

      {/* Floating Error Alert Dropdown (Auto-dismisses in 10s) */}
      {displayError && (
        <div
          className="absolute top-full right-0 mt-2.5 z-50 w-72 sm:w-96 bg-[var(--bg-card)] border border-red-500/40 rounded-xl p-3.5 text-red-500 text-xs sm:text-sm flex items-start gap-3 shadow-2xl backdrop-blur-lg"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 pr-1">
            <span>{displayError}</span>
            {!isLaceInstalled && (
              <div className="mt-1.5">
                <a
                  href="https://www.lace.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent-cyan)] font-semibold hover:underline"
                  aria-label="Download Midnight Lace Wallet extension"
                >
                  Get Midnight Lace Wallet <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
          <button
            onClick={handleDismissError}
            className="text-[var(--text-muted)] hover:text-red-500 p-0.5 rounded-md cursor-pointer transition-colors shrink-0"
            title="Dismiss notification"
            aria-label="Dismiss error message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
