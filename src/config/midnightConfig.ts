/** Midnight Network Configuration Constants */

export const MIDNIGHT_CONFIG = {
  PREPROD_CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    '2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400',

  DEFAULT_NETWORK_ID: (
    process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK ||
    process.env.VITE_MIDNIGHT_NETWORK ||
    'preprod'
  ).toLowerCase(),

  CANDIDATE_NETWORKS: ['preprod', 'undeployed', 'preview', 'testnet', 'devnet'] as const,

  DAPP_METADATA: {
    name: 'AfriPass Financial Passport',
    iconUrl: 'https://afripass.vercel.app/favicon.ico',
    description: 'Verified Financial Credentials with Zero-Knowledge Proofs',
  },
} as const;

export type MidnightNetworkId = (typeof MIDNIGHT_CONFIG.CANDIDATE_NETWORKS)[number];
