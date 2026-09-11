/** Midnight Network Configuration Constants */

export interface NetworkMetadata {
  id: 'preprod' | 'preview' | 'undeployed';
  name: string;
  contractAddress: string;
  indexerUrl: string;
  indexerWsUrl: string;
  nodeUrl: string;
  faucetUrl: string | null;
}

export const MIDNIGHT_NETWORKS: Record<'preprod' | 'preview', NetworkMetadata> = {
  preprod: {
    id: 'preprod',
    name: 'Midnight Preprod',
    contractAddress:
      process.env.NEXT_PUBLIC_PREPROD_CONTRACT_ADDRESS ||
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
      '2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400',
    indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    nodeUrl: 'https://rpc.preprod.midnight.network',
    faucetUrl: 'https://midnight-tmnight-preprod.nethermind.dev',
  },
  preview: {
    id: 'preview',
    name: 'Midnight Preview',
    contractAddress:
      process.env.NEXT_PUBLIC_PREVIEW_CONTRACT_ADDRESS ||
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
      '040088b767ac1bc1b7df73b747e964b7570155c4c010ba2a32c129c31523',
    indexerUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    nodeUrl: 'https://rpc.preview.midnight.network',
    faucetUrl: 'https://midnight-tmnight-preview.nethermind.dev',
  },
};

export const MIDNIGHT_CONFIG = {
  PREPROD_CONTRACT_ADDRESS: MIDNIGHT_NETWORKS.preprod.contractAddress,
  PREVIEW_CONTRACT_ADDRESS: MIDNIGHT_NETWORKS.preview.contractAddress,

  DEFAULT_NETWORK_ID: (
    process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK ||
    process.env.VITE_MIDNIGHT_NETWORK ||
    'preprod'
  ).toLowerCase() as 'preprod' | 'preview',

  CANDIDATE_NETWORKS: ['preprod', 'preview', 'undeployed', 'testnet', 'devnet'] as const,

  DAPP_METADATA: {
    name: 'AfriPass Financial Passport',
    iconUrl: 'https://afripass.vercel.app/favicon.ico',
    description: 'Verified Financial Credentials with Zero-Knowledge Proofs',
  },

  getNetworkMetadata(networkId: string): NetworkMetadata {
    if (networkId === 'preview') return MIDNIGHT_NETWORKS.preview;
    return MIDNIGHT_NETWORKS.preprod;
  },
} as const;

export type MidnightNetworkId = (typeof MIDNIGHT_CONFIG.CANDIDATE_NETWORKS)[number];

