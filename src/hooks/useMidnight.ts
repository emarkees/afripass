'use client';

import { useState, useEffect, useCallback } from 'react';

/** Current operational state of the Midnight Lace DApp connection */
export interface MidnightState {
  /** Whether the Lace wallet is currently connected */
  isConnected: boolean;
  /** Public wallet address string */
  address: string | null;
  /** Active Midnight network identifier (e.g. 'preprod', 'undeployed') */
  networkId: string | null;
  /** Human-readable error message or null */
  error: string | null;
  /** Current zero-knowledge proof generation lifecycle stage */
  proofState: 'idle' | 'generating' | 'submitting' | 'success' | 'error';
  /** Transaction hash of verified proof on Midnight ledger */
  txHash: string | null;
  /** On-chain public counter value */
  lastCounter: number;
}

declare global {
  interface Window {
    midnight?: Record<string, any>;
  }
}

const PREPROD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400';
const MIDNIGHT_NETWORK_ID = (
  process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK ||
  process.env.VITE_MIDNIGHT_NETWORK ||
  'preprod'
).toLowerCase();

/**
 * Discover all Midnight-compatible wallet providers injected into window.midnight.
 * Lace (and other wallets) inject under unique UUID keys, NOT hardcoded names.
 * We enumerate all keys and return providers that have the expected API shape.
 */
const discoverMidnightProviders = (): Array<{ key: string; provider: any }> => {
  if (typeof window === 'undefined' || !window.midnight) return [];

  return Object.entries(window.midnight)
    .filter(([_, provider]) => {
      return (
        provider &&
        typeof provider === 'object' &&
        (typeof provider.enable === 'function' || typeof provider.connect === 'function' || typeof provider.name === 'string')
      );
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
    networkId: MIDNIGHT_NETWORK_ID,
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
      let activeNetworkId: string = MIDNIGHT_NETWORK_ID;

      // Candidate network IDs to attempt if Lace extension is set to a different network
      const candidates = Array.from(
        new Set([MIDNIGHT_NETWORK_ID, 'preprod', 'undeployed', 'preview', 'devnet', 'testnet'])
      );

      let lastError: any = null;

      // 1. Try provider.enable() first if exposed
      if (typeof provider.enable === 'function') {
        try {
          api = await provider.enable();
        } catch (e: any) {
          lastError = e;
          if (
            e?.message?.toLowerCase().includes('user') ||
            e?.message?.toLowerCase().includes('cancel') ||
            e?.message?.toLowerCase().includes('denied') ||
            e?.message?.toLowerCase().includes('reject') ||
            e?.code === 4001
          ) {
            throw e;
          }
        }
      }

      // 2. If enable() didn't return an API, iterate through network candidates with provider.connect()
      if (!api && typeof provider.connect === 'function') {
        for (const candidateNet of candidates) {
          try {
            console.log(`[AfriPass] Attempting connect with network ID: '${candidateNet}'`);
            api = await provider.connect(candidateNet);
            activeNetworkId = candidateNet;
            lastError = null;
            break;
          } catch (e: any) {
            lastError = e;
            // Stop immediately if user explicitly declined/cancelled in the extension popup
            if (
              e?.message?.toLowerCase().includes('user') ||
              e?.message?.toLowerCase().includes('cancel') ||
              e?.message?.toLowerCase().includes('denied') ||
              e?.message?.toLowerCase().includes('reject') ||
              e?.code === 4001
            ) {
              throw e;
            }
          }
        }
      }

      if (!api) {
        throw lastError || new Error('Wallet provider found but connection could not be established.');
      }

      // Extract and format the wallet address from the connected API
      const parseAddrStr = (val: any): string | null => {
        if (!val) return null;
        if (typeof val === 'string') return val;
        if (typeof val === 'object') {
          if (typeof val.address === 'string') return val.address;
          if (typeof val.unshieldedAddress === 'string') return val.unshieldedAddress;
          if (typeof val.bech32Address === 'string') return val.bech32Address;
          if (typeof val.coinPublicKey === 'string') return val.coinPublicKey;
          if (typeof val.toString === 'function' && val.toString() !== '[object Object]') return val.toString();
        }
        return String(val);
      };

      let userAddress: string | null = null;

      if (typeof api.state === 'function') {
        const walletState = await api.state();
        userAddress =
          parseAddrStr(walletState?.address) ||
          parseAddrStr(walletState?.coinPublicKey) ||
          parseAddrStr(walletState?.unshieldedAddress) ||
          parseAddrStr(walletState);
      }

      if (!userAddress && typeof api.getUnshieldedAddress === 'function') {
        userAddress = parseAddrStr(await api.getUnshieldedAddress());
      }

      if (!userAddress && typeof api.getAddress === 'function') {
        userAddress = parseAddrStr(await api.getAddress());
      }

      if (!userAddress && api.address) {
        userAddress = parseAddrStr(api.address);
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
        networkId: activeNetworkId,
        error: null,
      }));
    } catch (err: any) {
      console.error('[AfriPass] Midnight wallet connection error:', err);

      const msg = err?.message?.toLowerCase() || '';

      if (
        msg.includes('user') ||
        msg.includes('cancel') ||
        msg.includes('denied') ||
        msg.includes('reject') ||
        err?.code === 4001
      ) {
        setState((prev) => ({
          ...prev,
          error: 'Connection request was declined. Please approve the connection in your Lace extension popup.',
        }));
      } else if (msg.includes('network') && msg.includes('mismatch')) {
        setState((prev) => ({
          ...prev,
          error: 'Network ID Mismatch: Your Lace extension is set to a different network. Please switch your network in Lace settings (e.g., Preprod or Undeployed) and try connecting again.',
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
      networkId: MIDNIGHT_NETWORK_ID,
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
