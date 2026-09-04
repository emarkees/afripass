import { FinancialCredential, CredentialStatus } from '../types/credential';

/**
 * Checks whether a financial credential is valid and active.
 */
export function isCredentialValid(credential: FinancialCredential): boolean {
  if (credential.status !== 'active') return false;
  const now = new Date();
  const expires = new Date(credential.expiresAt);
  return expires > now;
}

/**
 * Returns Tailwind CSS badge styling based on credential status.
 */
export function getCredentialStatusBadgeClass(status: CredentialStatus): string {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'expired':
      return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    case 'revoked':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
  }
}

/**
 * Formats monetary amounts with African currency symbol support.
 */
export function formatAfricanCurrency(amount: number, currency: string = 'NGN'): string {
  const symbolMap: Record<string, string> = {
    NGN: '₦',
    KES: 'KSh',
    GHS: 'GH₵',
    ZAR: 'R',
    USD: '$',
  };
  const symbol = symbolMap[currency] || currency + ' ';
  return `${symbol}${amount.toLocaleString('en-US')}`;
}
