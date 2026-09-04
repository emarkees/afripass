/** Supported financial credential categories */
export type CredentialType = 'income' | 'savings' | 'repayment';

/** Lifecycle status of a verified financial credential */
export type CredentialStatus = 'active' | 'pending' | 'expired' | 'revoked';

/** Verification standing of an attesting financial institution */
export type IssuerStatus = 'verified' | 'unverified';

/** Represents a financial institution authorized to issue credentials */
export interface Issuer {
  id: string;
  name: string;
  type: string; // e.g. 'Commercial Bank', 'Fintech', 'Microfinance Cooperative', 'Employer'
  status: IssuerStatus;
  isDemo: boolean; // Always true for demo issuers
  credentialsOffered: string[];
  description: string;
  logoIcon?: string;
}

/** Represents an attested financial credential stored privately on device */
export interface FinancialCredential {
  credentialId: string;
  type: CredentialType;
  claim: string; // e.g. 'Monthly income'
  value: number; // Private value, e.g. 2000000
  formattedValue: string; // Private value formatted, e.g. '₦2,000,000'
  displayThreshold: string; // e.g. '₦2M+'
  currency: string; // 'NGN'
  period: string; // e.g. '6 months'
  issuerId: string;
  issuerName: string;
  issuerStatus: IssuerStatus;
  issuedAt: string;
  expiresAt: string;
  status: CredentialStatus;
  isDemo: boolean;
  revocationReason?: string;
}

/** On-chain attestation issued by a verified financial institution */
export interface IssuerAttestation {
  attestationId: string;
  issuerId: string;
  credentialId: string;
  status: 'active' | 'revoked';
  issuedAt: string;
  attestationRef: string; // e.g. 'ATTEST-DEMO-BANK-2026-9812'
}

/** Parameters required to initiate local Zero-Knowledge proof generation */
export interface ProofRequest {
  credentialId: string;
  claimType: CredentialType;
  threshold: number;
  formattedThreshold: string;
  createdAt: string;
  source: 'attested' | 'synthetic';
}

/** Output result of a completed local ZK proof execution */
export interface ProofResult {
  proofId: string;
  claim: string;
  result: boolean;
  issuerName: string;
  issuerVerified: boolean;
  credentialStatus: CredentialStatus;
  midnightNetwork: string;
  txHash?: string | null;
  underlyingDataDisclosed: false;
  createdAt: string;
}

/** Verification payload submitted to lenders or verifiers */
export interface VerifierRequest {
  proofId: string;
  credentialId: string;
  commitment: string;
  verifiedAt?: string;
}

