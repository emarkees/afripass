import { VerificationRequest, VerificationSession, ConsentRecord } from '../types/provider';
import { MOCK_VERIFICATION_REQUESTS } from '../data/mockProviders';
import { ProofResult } from '../types/credential';
import { apiFetch } from './apiConfig';

export const verificationService = {
  async getIncomingRequests(): Promise<VerificationRequest[]> {
    return MOCK_VERIFICATION_REQUESTS;
  },

  async getVerificationRequests(): Promise<VerificationRequest[]> {
    return MOCK_VERIFICATION_REQUESTS;
  },

  async submitUserConsent(requestId: string, approved: boolean): Promise<ConsentRecord> {
    const req = MOCK_VERIFICATION_REQUESTS.find((r) => r.id === requestId);
    if (req) {
      req.status = approved ? 'approved' : 'rejected';
    }

    return {
      id: `CONSENT-${Math.floor(1000 + Math.random() * 9000)}`,
      requestId,
      userId: 'user-self-witness',
      providerId: req?.providerId || 'prov-demo-bank',
      providerName: req?.providerName || 'Demo Bank Nigeria',
      claimApproved: req?.claimRequired || 'Monthly Income ≥ ₦1,000,000',
      grantedAt: new Date().toISOString(),
    };
  },

  async createVerificationRequest(params: {
    providerId: string;
    providerName: string;
    credentialType: string;
    claimRequired: string;
    threshold: number;
    formattedThreshold: string;
    purpose: string;
  }): Promise<VerificationRequest> {
    const newReq: VerificationRequest = {
      id: `REQ-AFP-${Math.floor(100 + Math.random() * 900)}`,
      providerId: params.providerId,
      providerName: params.providerName,
      credentialType: params.credentialType,
      claimRequired: params.claimRequired,
      threshold: params.threshold,
      formattedThreshold: params.formattedThreshold,
      purpose: params.purpose,
      status: 'pending',
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    MOCK_VERIFICATION_REQUESTS.unshift(newReq);
    return newReq;
  },

  async approveVerificationRequest(requestId: string): Promise<ConsentRecord> {
    return this.submitUserConsent(requestId, true);
  },

  async createVerificationSession(proofId: string, claim: string, providerName: string): Promise<VerificationSession> {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    return {
      sessionId: `SESS-${Math.floor(10000 + Math.random() * 90000)}`,
      proofId,
      claim,
      providerName,
      verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      expiresAt,
      isExpired: false,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://afripass.network/verify?proof=${proofId}`,
    };
  },

  async verifyProofPayload(proofId: string): Promise<ProofResult> {
    try {
      const res = await apiFetch<ProofResult>('/api/v1/proofs/verify', {
        method: 'POST',
        body: JSON.stringify({ proofId }),
      });
      return res;
    } catch {
      return {
        proofId: proofId || `PROOF-AFP-${Math.floor(100000 + Math.random() * 900000)}`,
        claim: 'Monthly Income ≥ ₦1,000,000',
        result: true,
        issuerName: 'Demo Bank Nigeria',
        issuerVerified: true,
        credentialStatus: 'active',
        midnightNetwork: 'Midnight Preprod Network',
        txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        underlyingDataDisclosed: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
    }
  },
};
