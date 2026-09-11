'use client';

import { useState, useEffect, useCallback } from 'react';
import { MIDNIGHT_CONFIG, MIDNIGHT_NETWORKS, NetworkMetadata } from '../config/midnightConfig';

export interface MidnightWalletInfo {
  key: string;
  name: string;
  icon?: string;
  apiVersion?: string;
  provider: any;
}

/** Current operational state of the Midnight DApp connection */
export interface MidnightState {
  /** Whether a Midnight wallet is currently connected */
  isConnected: boolean;
  /** Public wallet address string */
  address: string | null;
  /** Active Midnight network identifier ('preprod' | 'preview' | string) */
  networkId: 'preprod' | 'preview' | string;
  /** Key of the selected injected wallet provider */
  selectedWalletKey: string | null;
  /** Name of the connected wallet provider */
  walletName: string | null;
  /** Available Midnight wallets discovered in window.midnight */
  availableWallets: MidnightWalletInfo[];
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

/**
 * Discover all Midnight-compatible wallet providers injected into window.midnight.
 * Supports Lace, Nightly, Mesh, and any generic Midnight CIP-30 adapter.
 */
export const discoverMidnightProviders = (): MidnightWalletInfo[] => {
  if (typeof window === 'undefined' || !window.midnight) return [];

  return Object.entries(window.midnight)
    .filter(([_, provider]) => {
      return (
        provider &&
        typeof provider === 'object' &&
        (typeof provider.enable === 'function' ||
          typeof provider.connect === 'function' ||
          typeof provider.name === 'string' ||
          provider.isLace ||
          provider.apiVersion)
      );
    })
    .map(([key, provider]) => {
      let name = provider.name || key;
      if (key.toLowerCase().includes('lace') || provider.isLace) {
        name = 'Lace (Midnight)';
      } else if (key.toLowerCase().includes('nightly')) {
        name = 'Nightly Wallet';
      } else if (key.toLowerCase().includes('mesh')) {
        name = 'Mesh Wallet';
      } else if (name === key) {
        name = key.charAt(0).toUpperCase() + key.slice(1);
      }

      return {
        key,
        name,
        icon: provider.icon || provider.iconUrl,
        apiVersion: provider.apiVersion,
        provider,
      };
    });
};

export function useMidnight() {
  const getInitialNetwork = (): 'preprod' | 'preview' => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('afripass_midnight_network');
      if (saved === 'preview' || saved === 'preprod') return saved;
    }
    return MIDNIGHT_CONFIG.DEFAULT_NETWORK_ID;
  };

  const [state, setState] = useState<MidnightState>({
    isConnected: false,
    address: null,
    networkId: getInitialNetwork(),
    selectedWalletKey: null,
    walletName: null,
    availableWallets: [],
    error: null,
    proofState: 'idle',
    txHash: null,
    lastCounter: 1,
  });

  const [isWalletDetected, setIsWalletDetected] = useState<boolean>(false);

  // Poll for Midnight wallet extension injection (extensions load asynchronously)
  useEffect(() => {
    const checkWallets = () => {
      const wallets = discoverMidnightProviders();
      setIsWalletDetected(wallets.length > 0);
      setState((prev) => {
        if (JSON.stringify(prev.availableWallets.map((w) => w.key)) !== JSON.stringify(wallets.map((w) => w.key))) {
          return { ...prev, availableWallets: wallets };
        }
        return prev;
      });
    };

    checkWallets();
    const interval = setInterval(checkWallets, 500);
    window.addEventListener('focus', checkWallets);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkWallets);
    };
  }, []);

  /**
   * Switch the active network between 'preprod' and 'preview'.
   */
  const switchNetwork = useCallback((targetNetwork: 'preprod' | 'preview') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('afripass_midnight_network', targetNetwork);
    }
    setState((prev) => ({
      ...prev,
      networkId: targetNetwork,
      error: null,
    }));
  }, []);

  /**
   * Connect to a specific or default Midnight wallet provider.
   */
  const connect = useCallback(async (requestedWalletKey?: string, targetNetwork?: 'preprod' | 'preview') => {
    setState((prev) => ({ ...prev, error: null }));

    const activeNet = targetNetwork || (state.networkId as 'preprod' | 'preview') || MIDNIGHT_CONFIG.DEFAULT_NETWORK_ID;

    const wallets = discoverMidnightProviders();
    if (wallets.length === 0) {
      const midnightKeys = typeof window !== 'undefined' && window.midnight
        ? Object.keys(window.midnight)
        : [];

      console.warn('[AfriPass] window.midnight keys:', midnightKeys);

      setState((prev) => ({
        ...prev,
        error: `No Midnight-compatible wallet found. Please install Lace, Nightly, or any Midnight wallet extension and refresh the page.`,
      }));
      return;
    }

    // Pick requested wallet, or previously selected, or first available
    const chosenWallet = requestedWalletKey
      ? wallets.find((w) => w.key === requestedWalletKey) || wallets[0]
      : wallets.find((w) => w.key === state.selectedWalletKey) || wallets[0];

    const provider = chosenWallet.provider;
    console.log(`[AfriPass] Connecting to ${chosenWallet.name} on network: ${activeNet}`);

    try {
      let api: any;
      let connectedNetworkId: string = activeNet;

      const candidates = Array.from(
        new Set([activeNet, activeNet === 'preview' ? 'preprod' : 'preview', 'undeployed', 'devnet', 'testnet'])
      );

      let lastError: any = null;

      // 1. Try provider.enable(activeNet) first if exposed
      if (typeof provider.enable === 'function') {
        try {
          api = await provider.enable(activeNet);
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
            connectedNetworkId = candidateNet;
            lastError = null;
            break;
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
      }

      if (!api) {
        throw lastError || new Error(`Could not establish connection with ${chosenWallet.name}.`);
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
          error: `Connected to ${chosenWallet.name} but could not retrieve your Midnight wallet address.`,
        }));
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('afripass_midnight_wallet', chosenWallet.key);
        localStorage.setItem('afripass_midnight_network', connectedNetworkId);
      }

      setState((prev) => ({
        ...prev,
        isConnected: true,
        address: userAddress,
        networkId: connectedNetworkId,
        selectedWalletKey: chosenWallet.key,
        walletName: chosenWallet.name,
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
          error: `Connection request was declined. Please approve the prompt in ${chosenWallet.name}.`,
        }));
      } else if (msg.includes('network') && msg.includes('mismatch')) {
        setState((prev) => ({
          ...prev,
          error: `Network ID Mismatch: Your wallet is configured for a different network. Switch your wallet settings to ${activeNet} and try again.`,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: err?.message || `Failed to connect to ${chosenWallet.name}.`,
        }));
      }
    }
  }, [state.networkId, state.selectedWalletKey]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      address: null,
      error: null,
      proofState: 'idle',
      txHash: null,
    }));
  }, []);

  // Execute circuit call verify_eligibility(income)
  const callCircuit = useCallback(async (income: number) => {
    if (!state.isConnected) {
      setState((prev) => ({ ...prev, error: 'Please connect your Midnight wallet first.' }));
      return;
    }

    if (income < 350000) {
      setState((prev) => ({ ...prev, error: 'Income does not meet the minimum eligibility requirement (350,000 NGN).' }));
      return;
    }

    const netName = state.networkId === 'preview' ? 'Midnight Preview' : 'Midnight Preprod';

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

      // Simulate ledger transaction submission to active network contract (1.5s)
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
        error: `Failed to generate zero-knowledge proof or submit to ${netName}.`,
      }));
    }
  }, [state.isConnected, state.networkId]);

  const activeNetworkMetadata: NetworkMetadata = MIDNIGHT_CONFIG.getNetworkMetadata(state.networkId || 'preprod');

  return {
    ...state,
    isLaceInstalled: isWalletDetected,
    availableWallets: state.availableWallets,
    connect,
    disconnect,
    switchNetwork,
    callCircuit,
    contractAddress: activeNetworkMetadata.contractAddress,
    networkMetadata: activeNetworkMetadata,
  };
}

