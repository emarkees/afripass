'use client';

import React from 'react';
import { Wallet, LogOut, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

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
  // Truncate wallet address for clean UI presentation
  const truncatedAddress = address
    ? `${address.slice(0, 10)}...${address.slice(-6)}`
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Header Button Mode / Card View */}
      {isConnected ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--badge-border)',
          borderRadius: '0.75rem',
          padding: '0.5rem 0.85rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--badge-text)',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            <CheckCircle2 style={{ width: '1.1rem', height: '1.1rem' }} />
            <span>Connected</span>
          </div>

          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            backgroundColor: 'var(--bg-card)',
            padding: '0.25rem 0.6rem',
            borderRadius: '0.4rem',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)'
          }}>
            {truncatedAddress}
          </div>

          <button
            onClick={onDisconnect}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', height: 'auto' }}
            title="Disconnect Lace Wallet"
          >
            <LogOut style={{ width: '0.9rem', height: '0.9rem' }} /> Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <Wallet style={{ width: '1.25rem', height: '1.25rem' }} /> Connect Lace
        </button>
      )}

      {/* Error Alert Displays */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '0.625rem',
          padding: '0.75rem 1rem',
          color: '#ef4444',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          maxWidth: '420px'
        }}>
          <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
          <div>
            <span>{error}</span>
            {!isLaceInstalled && (
              <a
                href="https://www.lace.io/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--accent-cyan)',
                  marginLeft: '0.5rem',
                  fontWeight: 600
                }}
              >
                Get Lace <ExternalLink style={{ width: '0.8rem', height: '0.8rem' }} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
