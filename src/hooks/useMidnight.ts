'use client';

import { useState, useEffect, useCallback } from 'react';

export interface MidnightState {
  isConnected: boolean;
  address: string | null;
  networkId: string | null;
  error: string | null;
  proofState: 'idle' | 'generating' | 'submitting' | 'success' | 'error';
  txHash: string | null;
  lastCounter: number;
}

declare global {
  interface Window {
    midnight?: Record<string, any>;
  }
}

const PREPROD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400';
const MIDNIGHT_NETWORK_ID = 'Undeployed';

/**
 * Discover all Midnight-compatible wallet providers injected into window.midnight.
 * Lace (and other wallets) inject under unique UUID keys, NOT hardcoded names.
 * We enumerate all keys and return providers that have the expected API shape.
 */
const discoverMidnightProviders = (): Array<{ key: string; provider: any }> => {
  if (typeof window === 'undefined' || !window.midnight) return [];

  return Object.entries(window.midnight)
    .filter(([_, provider]) => {
      return provider && typeof provider === 'object' && typeof provider.name === 'string';
    })
    .map(([key, provider]) => ({ key, provider }));
};

/**
 * Get the first available Midnight wallet provider.
 */
const getFirstProvider = (): any | null => {
  const providers = discoverMidnightProviders();
  return providers.length > 0 ? providers[0].provider : null;
};

export function useMidnight() {
  const [state, setState] = useState<MidnightState>({
    isConnected: false,
    address: null,
    networkId: 'preprod',
    error: null,
    proofState: 'idle',
    txHash: null,
    lastCounter: 1,
  });

  const [isWalletDetected, setIsWalletDetected] = useState<boolean>(false);

  // Poll for Midnight wallet extension injection (extensions load asynchronously)
  useEffect(() => {
    const checkWallet = () => {
      const provider = getFirstProvider();
      setIsWalletDetected(Boolean(provider));
    };

    checkWallet();
    const interval = setInterval(checkWallet, 500);
    window.addEventListener('focus', checkWallet);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkWallet);
    };
  }, []);

  /**
   * Connect to the Midnight account on the Lace extension.
   * Calls provider.enable() or provider.connect() which triggers the Lace
   * extension popup asking the user to approve the dApp connection.
   */
  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, error: null }));

    const provider = getFirstProvider();

    if (!provider) {
      // Debug: log what's actually in window.midnight
      const midnightKeys = typeof window !== 'undefined' && window.midnight
        ? Object.keys(window.midnight)
        : [];

      console.warn('[AfriPass] window.midnight keys:', midnightKeys);

      setState((prev) => ({
        ...prev,
        error: `Midnight wallet not found. Please ensure you have the Lace extension installed with a Midnight account enabled, then refresh the page. (Detected providers: ${midnightKeys.length})`,
      }));
      return;
    }

    console.log('[AfriPass] Connecting to Midnight provider:', provider.name || 'unknown');

    try {
      let api: any;

      // The Midnight DApp Connector API uses .enable() to prompt the extension
      if (typeof provider.enable === 'function') {
        api = await provider.enable();
      } else if (typeof provider.connect === 'function') {
        api = await provider.connect(MIDNIGHT_NETWORK_ID);
      } else {
        setState((prev) => ({
          ...prev,
          error: 'Wallet provider found but does not expose enable() or connect(). Please update your Lace extension.',
        }));
        return;
      }

      // Extract the wallet address from the connected API
      let userAddress: string | null = null;

      if (typeof api.state === 'function') {
        const walletState = await api.state();
        userAddress =
          walletState?.address ||
          walletState?.coinPublicKey ||
          walletState?.unshieldedAddress ||
          null;
      }

      if (!userAddress && typeof api.getUnshieldedAddress === 'function') {
        userAddress = await api.getUnshieldedAddress();
      }

      if (!userAddress && typeof api.getAddress === 'function') {
        userAddress = await api.getAddress();
      }

      if (!userAddress && api.address) {
        userAddress = api.address;
      }

      if (!userAddress) {
        setState((prev) => ({
          ...prev,
          error: 'Connected to Lace but could not retrieve your Midnight address. Please ensure you have a Midnight account configured.',
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        address: userAddress,
        networkId: 'preprod',
        error: null,
      }));
    } catch (err: any) {
      console.error('[AfriPass] Midnight wallet connection error:', err);

      if (
        err?.message?.includes('user') ||
        err?.message?.includes('cancel') ||
        err?.message?.includes('denied') ||
        err?.message?.includes('reject') ||
        err?.code === 4001
      ) {
        setState((prev) => ({
          ...prev,
          error: 'Connection request was declined. Please approve the connection in your Lace extension.',
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: err?.message || 'Failed to connect to Midnight wallet via Lace.',
        }));
      }
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      networkId: 'preprod',
      error: null,
      proofState: 'idle',
      txHash: null,
      lastCounter: state.lastCounter,
    });
  }, [state.lastCounter]);

  // Execute circuit call increment_counter(step)
  const callCircuit = useCallback(async (stepAmount: number) => {
    if (!state.isConnected) {
      setState((prev) => ({ ...prev, error: 'Please connect your Midnight wallet first.' }));
      return;
    }

    setState((prev) => ({
      ...prev,
      proofState: 'generating',
      error: null,
      txHash: null,
    }));

    try {
      // Simulate local ZK proof generation time (1.8s)
      await new Promise((resolve) => setTimeout(resolve, 1800));

      setState((prev) => ({ ...prev, proofState: 'submitting' }));

      // Simulate ledger transaction submission to Preprod contract (1.5s)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const randomTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      setState((prev) => ({
        ...prev,
        proofState: 'success',
        txHash: randomTxHash,
        lastCounter: prev.lastCounter + 1,
        error: null,
      }));
    } catch (err: any) {
      console.error('Circuit call error:', err?.message || 'Proof generation failed');
      setState((prev) => ({
        ...prev,
        proofState: 'error',
        error: 'Failed to generate zero-knowledge proof or submit to Midnight Preprod.',
      }));
    }
  }, [state.isConnected]);

  return {
    ...state,
    isLaceInstalled: isWalletDetected,
    connect,
    disconnect,
    callCircuit,
    contractAddress: PREPROD_CONTRACT_ADDRESS,
  };
}
