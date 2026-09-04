import { Provider, ProviderMember } from '../types/provider';
import { MOCK_PROVIDERS, MOCK_PROVIDER_MEMBERS } from '../data/mockProviders';
import { apiFetch } from './apiConfig';

export interface DashboardStats {
  organizationName: string;
  organizationType: string;
  organizationRole: string;
  organizationStatus: string;
  credentialsIssued: number;
  activeCredentials: number;
  revokedCredentials: number;
  expiredCredentials: number;
  proofsVerified: number;
  verificationRequests: number;
  activeApiKeys: number;
  apiCalls: number;
  currentPlan: string;
  subscriptionStatus: string;
  subscriptionRenewal: string;
}

export const providerService = {
  async getProvidersDirectory(): Promise<Provider[]> {
    try {
      const providers = await apiFetch<Provider[]>('/api/v1/providers');
      return providers;
    } catch {
      return MOCK_PROVIDERS.filter((p) => p.status === 'approved');
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const stats = await apiFetch<DashboardStats>('/api/v1/provider/dashboard/stats');
      return stats;
    } catch {
      return {
        organizationName: 'Demo Bank Nigeria',
        organizationType: 'Bank',
        organizationRole: 'Issuer + Verifier',
        organizationStatus: 'approved',
        credentialsIssued: 1284,
        activeCredentials: 1201,
        revokedCredentials: 45,
        expiredCredentials: 38,
        proofsVerified: 486,
        verificationRequests: 742,
        activeApiKeys: 3,
        apiCalls: 18492,
        currentPlan: 'Professional',
        subscriptionStatus: 'active',
        subscriptionRenewal: '30 September 2026',
      };
    }
  },

  async getProviderById(id: string): Promise<Provider | null> {
    try {
      const org = await apiFetch<Provider>('/api/v1/provider/organization');
      return org;
    } catch {
      return MOCK_PROVIDERS.find((p) => p.id === id) || MOCK_PROVIDERS[0];
    }
  },

  async getTeamMembers(providerId: string): Promise<ProviderMember[]> {
    try {
      const members = await apiFetch<ProviderMember[]>('/api/v1/provider/members');
      return members;
    } catch {
      return MOCK_PROVIDER_MEMBERS;
    }
  },

  async updateOrganizationProfile(providerId: string, updates: Partial<Provider>): Promise<Provider> {
    try {
      const updated = await apiFetch<Provider>('/api/v1/provider/organization/update', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      return updated;
    } catch {
      const existing = MOCK_PROVIDERS.find((p) => p.id === providerId) || MOCK_PROVIDERS[0];
      return {
        ...existing,
        ...updates,
      };
    }
  },
};
