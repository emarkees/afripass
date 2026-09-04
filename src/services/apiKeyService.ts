import { ApiKey, ApiPermissionScope } from '../types/provider';
import { MOCK_API_KEYS } from '../data/mockProviders';
import { apiFetch } from './apiConfig';

export const apiKeyService = {
  async getApiKeys(): Promise<ApiKey[]> {
    return MOCK_API_KEYS;
  },

  async createApiKey(name: string, permissions: ApiPermissionScope[]): Promise<{ key: ApiKey; rawSecret: string }> {
    try {
      const res = await apiFetch<{ key: ApiKey; rawSecret: string }>('/api/v1/provider/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name, permissions }),
      });
      return res;
    } catch {
      const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const rawSecret = `afp_live_${randomHex}`;
      const keyPrefix = rawSecret.slice(0, 12);
      const maskedKey = `${keyPrefix}••••••••••••••••••••${rawSecret.slice(-4)}`;

      const newKey: ApiKey = {
        id: `key-${Math.floor(100 + Math.random() * 900)}`,
        name,
        keyPrefix,
        maskedKey,
        permissions,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastUsedAt: 'Never',
      };

      MOCK_API_KEYS.unshift(newKey);
      return { key: newKey, rawSecret };
    }
  },

  async revokeApiKey(keyId: string): Promise<ApiKey> {
    const target = MOCK_API_KEYS.find((k) => k.id === keyId);
    if (target) {
      target.status = 'revoked';
      return target;
    }
    throw new Error('API key not found');
  },
};
