export type ProviderRole = 'issuer' | 'verifier' | 'both';

export type OrganizationType =
  | 'Bank'
  | 'Fintech'
  | 'Lender'
  | 'Microfinance'
  | 'Cooperative'
  | 'Employer'
  | 'Credit Provider'
  | 'Merchant Finance'
  | 'Other';

export type OrganizationStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'deactivated';

export type UserAccountStatus =
  | 'pending_verification'
  | 'active'
  | 'suspended'
  | 'deactivated';

export type StaffRole =
  | 'owner'
  | 'admin'
  | 'issuer'
  | 'verifier'
  | 'auditor'
  | 'developer';

export interface ProviderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  organizationId: string;
  role: StaffRole;
  accountStatus: UserAccountStatus;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface ProviderSession {
  id: string;
  userId: string;
  organizationId: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  createdAt: string;
  lastActive: string;
  expiresAt: string;
  isCurrent?: boolean;
}

export interface StaffInvitation {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface Provider {
  id: string;
  name: string;
  type: OrganizationType;
  country: string;
  businessEmail: string;
  website: string;
  contactPerson: string;
  phone?: string;
  registrationNumber?: string;
  description?: string;
  role: ProviderRole;
  status: OrganizationStatus;
  userAccountStatus?: UserAccountStatus;
  userRole?: StaffRole;
  currentUser?: ProviderUser;
  emailVerified?: boolean;
  credentialsIssuedCount: number;
  activeCredentialsCount: number;
  proofsVerifiedCount: number;
  createdAt: string;
  isDemo: boolean;
}

export interface ProviderMember {
  id: string;
  providerId: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'invited' | 'suspended';
  lastActive?: string;
}

export type VerificationRequestStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface VerificationRequest {
  id: string;
  providerId: string;
  providerName: string;
  credentialType: string;
  claimRequired: string;
  threshold: number;
  formattedThreshold: string;
  purpose: string;
  status: VerificationRequestStatus;
  requestedAt: string;
  expiresAt: string;
}

export interface VerificationSession {
  sessionId: string;
  proofId: string;
  claim: string;
  providerName: string;
  verifiedAt: string;
  expiresAt: string;
  isExpired: boolean;
  qrCodeUrl?: string;
}

export interface ConsentRecord {
  id: string;
  requestId: string;
  userId: string;
  providerId: string;
  providerName: string;
  claimApproved: string;
  grantedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  category: 'Credential' | 'Verification' | 'Security' | 'Organization' | 'API';
  action: string;
  details: string;
  actor: string;
  severity: 'info' | 'warning' | 'error';
}

export type ApiPermissionScope =
  | 'credential:issue'
  | 'credential:read'
  | 'credential:revoke'
  | 'proof:request'
  | 'proof:verify'
  | 'organization:read';

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  maskedKey: string;
  permissions: ApiPermissionScope[];
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsedAt: string | null;
}
