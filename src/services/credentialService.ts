import { FinancialCredential, CredentialType } from '../types/credential';
import { MOCK_CREDENTIALS } from '../data/mockCredentials';
import { apiFetch } from './apiConfig';

export interface IssueCredentialParams {
  type: CredentialType;
  claim: string;
  value: number;
  currency: string;
  period: string;
  issuerId: string;
  issuerName: string;
  expiresAt: string;
}

export const credentialService = {
  async getUserCredentials(): Promise<FinancialCredential[]> {
    try {
      const creds = await apiFetch<FinancialCredential[]>('/api/v1/credentials');
      return creds;
    } catch {
      return MOCK_CREDENTIALS;
    }
  },

  async issueCredential(params: IssueCredentialParams): Promise<FinancialCredential> {
    try {
      const newCred = await apiFetch<FinancialCredential>('/api/v1/providers/credentials', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return newCred;
    } catch {
      const symbolMap: Record<string, string> = { NGN: '₦', KES: 'KSh', GHS: 'GH₵', USD: '$' };
      const symbol = symbolMap[params.currency] || params.currency;
      const formattedVal = `${symbol}${params.value.toLocaleString()}`;

      const fallbackCred: FinancialCredential = {
        credentialId: `AFP-CRED-${Math.floor(100 + Math.random() * 900)}`,
        type: params.type,
        claim: params.claim,
        value: params.value,
        formattedValue: formattedVal,
        displayThreshold: `${formattedVal}+`,
        currency: params.currency,
        period: params.period,
        issuerId: params.issuerId,
        issuerName: params.issuerName,
        issuerStatus: 'verified',
        issuedAt: new Date().toISOString().split('T')[0],
        expiresAt: params.expiresAt,
        status: 'active',
        isDemo: false,
      };
      MOCK_CREDENTIALS.unshift(fallbackCred);
      return fallbackCred;
    }
  },

  async revokeCredential(credentialId: string, reason: string): Promise<FinancialCredential> {
    try {
      const revoked = await apiFetch<FinancialCredential>(`/api/v1/credentials/revoke/${credentialId}`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return revoked;
    } catch {
      const target = MOCK_CREDENTIALS.find((c: FinancialCredential) => c.credentialId === credentialId);
      if (target) {
        target.status = 'revoked';
        target.revocationReason = reason;
        return target;
      }
      throw new Error('Credential not found');
    }
  },
};
