import { isCredentialValid, getCredentialStatusBadgeClass, formatAfricanCurrency } from './credentialUtils';
import { FinancialCredential } from '../types/credential';

describe('credentialUtils', () => {
  const sampleCredential: FinancialCredential = {
    credentialId: 'CRED-TEST-1',
    type: 'income',
    claim: 'Monthly income',
    value: 1500000,
    formattedValue: '₦1,500,000',
    displayThreshold: '₦1.5M+',
    currency: 'NGN',
    period: '6 months',
    issuerId: 'ISS-1',
    issuerName: 'First Bank of Nigeria',
    issuerStatus: 'verified',
    issuedAt: '2026-01-01',
    expiresAt: '2027-01-01',
    status: 'active',
    isDemo: true,
  };

  test('isCredentialValid returns true for active future-dated credentials', () => {
    expect(isCredentialValid(sampleCredential)).toBe(true);
  });

  test('isCredentialValid returns false for revoked credentials', () => {
    const revoked = { ...sampleCredential, status: 'revoked' as const };
    expect(isCredentialValid(revoked)).toBe(false);
  });

  test('formatAfricanCurrency formats NGN currency properly', () => {
    expect(formatAfricanCurrency(2000000, 'NGN')).toBe('₦2,000,000');
  });

  test('getCredentialStatusBadgeClass returns correct styling classes', () => {
    expect(getCredentialStatusBadgeClass('active')).toContain('bg-emerald-500/10');
    expect(getCredentialStatusBadgeClass('revoked')).toContain('bg-rose-500/10');
  });
});
