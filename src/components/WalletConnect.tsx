'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, LogOut, CheckCircle2, AlertTriangle, ExternalLink, X, ChevronDown, Network, ShieldCheck } from 'lucide-react';
import { MidnightWalletInfo } from '../hooks/useMidnight';

interface WalletConnectProps {
  isConnected: boolean;
  address: string | null;
  networkId: string | null;
  walletName?: string | null;
  availableWallets?: MidnightWalletInfo[];
  error: string | null;
  isLaceInstalled: boolean;
  onConnect: (walletKey?: string, network?: 'preprod' | 'preview') => void;
  onDisconnect: () => void;
  onSwitchNetwork?: (network: 'preprod' | 'preview') => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  address,
  networkId,
  walletName,
  availableWallets = [],
  error,
  isLaceInstalled,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
}) => {
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'preprod' | 'preview'>(
    networkId === 'preview' ? 'preview' : 'preprod'
  );

  useEffect(() => {
    if (networkId === 'preview' || networkId === 'preprod') {
      setSelectedNetwork(networkId);
    }
  }, [networkId]);

  // Auto-dismiss error alert after 10 seconds
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

  const handleNetworkSelect = (net: 'preprod' | 'preview') => {
    setSelectedNetwork(net);
    if (onSwitchNetwork) {
      onSwitchNetwork(net);
    }
  };

  const handleConnectWallet = (walletKey?: string) => {
    setIsModalOpen(false);
    onConnect(walletKey, selectedNetwork);
  };

  // Truncate wallet address safely
  const addressStr = address ? (typeof address === 'string' ? address : String((address as any)?.address || (address as any)?.unshieldedAddress || address)) : null;

  const truncatedAddress = addressStr
    ? addressStr.length > 16
      ? `${addressStr.slice(0, 10)}...${addressStr.slice(-6)}`
      : addressStr
    : null;

  const activeNetworkLabel = selectedNetwork === 'preview' ? 'Preview' : 'Preprod';

  return (
    <div className="relative">
      {/* Header Button / Connected State */}
      {isConnected ? (
        <div className="flex items-center gap-2 sm:gap-3 bg-[var(--bg-surface)] border border-[var(--badge-border)] rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2">
          {/* Active Network Tag */}
          <div className="flex items-center gap-1 text-[0.7rem] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--primary-emerald)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-emerald)] animate-pulse"></span>
            <span>{activeNetworkLabel}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--badge-text)] text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary-emerald)]" />
            <span className="hidden md:inline text-xs font-mono">{walletName || 'Midnight Wallet'}</span>
          </div>

          <div className="font-mono text-xs bg-[var(--bg-card)] px-2 py-1 rounded-md border border-[var(--border-color)] text-[var(--text-primary)]">
            {truncatedAddress}
          </div>

          <button
            onClick={onDisconnect}
            className="inline-flex items-center justify-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg font-bold text-xs cursor-pointer border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-sm"
            title="Disconnect Midnight Wallet"
            aria-label="Disconnect Midnight Wallet"
          >
            <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Quick Network Selector Pill */}
          <div className="hidden sm:flex items-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-0.5 text-xs font-bold">
            <button
              onClick={() => handleNetworkSelect('preprod')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedNetwork === 'preprod'
                  ? 'bg-[var(--primary-emerald)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Midnight Preprod Network"
            >
              Preprod
            </button>
            <button
              onClick={() => handleNetworkSelect('preview')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                selectedNetwork === 'preview'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Midnight Preview Network"
            >
              Preview
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all shadow-sm shrink-0"
            aria-label="Connect Midnight Wallet"
          >
            <Wallet className="w-4 h-4" /> Connect Wallet
          </button>
        </div>
      )}

      {/* Wallet Selection & Network Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl relative text-[var(--text-primary)]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg cursor-pointer transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] flex items-center justify-center text-white shadow-md">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Connect Midnight Wallet</h3>
                <p className="text-xs text-[var(--text-muted)]">Select your wallet extension & target network</p>
              </div>
            </div>

            {/* Network Selector Tab inside Modal */}
            <div className="mb-5 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-color)]">
              <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-[var(--primary-emerald)]" /> Midnight Network
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('preprod')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedNetwork === 'preprod'
                      ? 'bg-[var(--primary-emerald)] text-white border-[var(--primary-emerald)] shadow-sm'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Midnight Preprod
                </button>
                <button
                  type="button"
                  onClick={() => handleNetworkSelect('preview')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedNetwork === 'preview'
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-slate-400'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" /> Midnight Preview
                </button>
              </div>
            </div>

            {/* Detected Wallets List */}
            <div className="space-y-2 mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Available Midnight Wallets ({availableWallets.length})
              </div>

              {availableWallets.length > 0 ? (
                availableWallets.map((w) => (
                  <button
                    key={w.key}
                    onClick={() => handleConnectWallet(w.key)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--primary-emerald)] transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--primary-emerald)]/10 text-[var(--primary-emerald)] flex items-center justify-center font-bold text-sm">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--primary-emerald)] transition-colors">
                          {w.name}
                        </div>
                        <div className="text-[0.7rem] text-[var(--text-muted)] font-mono">
                          Ready for {selectedNetwork}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold py-1 px-2.5 rounded-lg bg-[var(--badge-bg)] text-[var(--primary-emerald)] border border-[var(--badge-border)]">
                      Connect
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4" /> No Midnight Wallet Extension Detected
                  </div>
                  <p>
                    Please install a browser extension that supports Midnight (e.g. Lace Wallet) to interact with AfriPass zero-knowledge contracts.
                  </p>
                </div>
              )}
            </div>

            {/* Download Links */}
            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Need a Midnight Wallet?</span>
              <a
                href="https://www.lace.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--primary-emerald)] font-bold hover:underline"
              >
                Get Lace Extension <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Error Alert Dropdown */}
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

