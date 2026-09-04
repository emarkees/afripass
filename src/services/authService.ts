import {
  Provider,
  OrganizationType,
  ProviderRole,
  StaffRole,
  ProviderUser,
  ProviderSession,
  OrganizationStatus,
  UserAccountStatus,
} from '../types/provider';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { apiFetch } from './apiConfig';

const AUTH_STORAGE_KEY = 'afripass_provider_session';
const SESSIONS_STORAGE_KEY = 'afripass_provider_active_sessions';

export interface AdminAccountForm {
  firstName: string;
  lastName: string;
  workEmail: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface OrganizationForm {
  name: string;
  type: OrganizationType;
  country: string;
  businessEmail: string;
  website: string;
  phone: string;
  registrationNumber?: string;
  description?: string;
  capability: ProviderRole;
}

export interface StageSignupPayload {
  admin: AdminAccountForm;
  organization: OrganizationForm;
}

export interface AuthSessionResponse {
  provider: Provider;
  token: string;
  warning?: string;
}

export const authService = {
  getStoredSession(): Provider | null {
    if (typeof window === 'undefined') return MOCK_PROVIDERS[0];
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch {
      // Fallback
    }
    return MOCK_PROVIDERS[0];
  },

  getCurrentSession(): Provider | null {
    return this.getStoredSession();
  },

  setSession(provider: Provider): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(provider));
    }
  },

  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  // Complete Provider Login Flow
  async login(email: string, password: string, rememberMe: boolean = false): Promise<Provider> {
    try {
      const res = await apiFetch<AuthSessionResponse>('/api/v1/auth/provider/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const provider = res.provider || (res as any);
      this.setSession(provider);
      return provider;
    } catch {
      // Offline / fallback mock implementation
      const found =
        MOCK_PROVIDERS.find((p) => p.businessEmail.toLowerCase() === email.toLowerCase()) ||
        MOCK_PROVIDERS[0];
      const mockSession: Provider = {
        ...found,
        businessEmail: email,
        userRole: 'owner',
        userAccountStatus: 'active',
        emailVerified: true,
        status: found.status || 'approved',
      };
      this.setSession(mockSession);
      return mockSession;
    }
  },

  // Stage 1 + Stage 2 Provider Signup
  async signupProvider(payload: StageSignupPayload): Promise<Provider> {
    try {
      const res = await apiFetch<{ user: ProviderUser; organization: Provider; token: string }>(
        '/api/v1/auth/provider/signup',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );
      const newProvider: Provider = {
        ...res.organization,
        userAccountStatus: 'pending_verification',
        emailVerified: false,
        status: 'pending',
        userRole: 'owner',
      };
      this.setSession(newProvider);
      return newProvider;
    } catch {
      // Offline fallback creation
      const newProvider: Provider = {
        id: `prov-${Math.floor(1000 + Math.random() * 9000)}`,
        name: payload.organization.name,
        type: payload.organization.type,
        country: payload.organization.country,
        businessEmail: payload.organization.businessEmail,
        website: payload.organization.website,
        contactPerson: `${payload.admin.firstName} ${payload.admin.lastName}`,
        phone: payload.organization.phone,
        registrationNumber: payload.organization.registrationNumber,
        description: payload.organization.description,
        role: payload.organization.capability,
        status: 'pending', // Org status: Pending Review
        userAccountStatus: 'pending_verification',
        userRole: 'owner',
        emailVerified: false,
        credentialsIssuedCount: 0,
        activeCredentialsCount: 0,
        proofsVerifiedCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        isDemo: false,
      };
      this.setSession(newProvider);
      return newProvider;
    }
  },

  // Email Verification
  async verifyEmail(token: string): Promise<boolean> {
    try {
      await apiFetch('/api/v1/auth/provider/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    } catch {
      // Local fallback
    }
    const current = this.getCurrentSession();
    if (current) {
      const updated: Provider = {
        ...current,
        emailVerified: true,
        userAccountStatus: 'active',
      };
      this.setSession(updated);
    }
    return true;
  },

  async resendVerificationEmail(email: string): Promise<boolean> {
    try {
      await apiFetch('/api/v1/auth/provider/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      // Fallback
    }
    return true;
  },

  // Forgot Password & Reset Flow
  async forgotPassword(email: string): Promise<string> {
    try {
      await apiFetch('/api/v1/auth/provider/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      // Fallback
    }
    // Generic response per specification requirement #7
    return "If an account exists for this email, you'll receive a password reset link.";
  },

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      await apiFetch('/api/v1/auth/provider/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
    } catch {
      // Fallback
    }
    return true;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      await apiFetch('/api/v1/auth/provider/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    } catch {
      // Fallback
    }
    return true;
  },

  // Active Sessions Management
  getSessions(): ProviderSession[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    const current = this.getCurrentSession();
    return [
      {
        id: 'sess-curr-001',
        userId: current?.currentUser?.id || 'usr-owner-1',
        organizationId: current?.id || 'prov-demo-bank',
        device: 'MacBook Pro 16 (Apple M3)',
        browser: 'Chrome 122.0.6261 (macOS)',
        ip: '197.210.64.12',
        location: 'Lagos, Nigeria',
        createdAt: '2026-09-04 10:14:00',
        lastActive: 'Just now',
        expiresAt: '2026-09-05 10:14:00',
        isCurrent: true,
      },
      {
        id: 'sess-sec-002',
        userId: current?.currentUser?.id || 'usr-owner-1',
        organizationId: current?.id || 'prov-demo-bank',
        device: 'iPhone 15 Pro (iOS 17)',
        browser: 'Mobile Safari 17.2',
        ip: '102.89.23.44',
        location: 'Abuja, Nigeria',
        createdAt: '2026-09-03 18:30:00',
        lastActive: 'Yesterday at 19:42',
        expiresAt: '2026-09-04 18:30:00',
        isCurrent: false,
      },
    ];
  },

  async revokeSession(sessionId: string): Promise<void> {
    try {
      await apiFetch(`/api/v1/auth/provider/sessions/revoke`, {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Fallback
    }
  },

  async logoutEverywhere(): Promise<void> {
    try {
      await apiFetch('/api/v1/auth/provider/logout', { method: 'POST' });
    } catch {
      // Fallback
    }
    this.clearSession();
  },

  logout(): void {
    this.logoutEverywhere();
  },

  // Role-Based Authorization Helper
  hasRolePermission(userRole: StaffRole | undefined, requiredRole: StaffRole | StaffRole[]): boolean {
    if (!userRole) return false;
    if (userRole === 'owner') return true; // Owner has all access
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    return userRole === requiredRole;
  },
};
