import { AuditEvent } from '../types/provider';
import { MOCK_AUDIT_LOGS } from '../data/mockProviders';
import { apiFetch } from './apiConfig';

export const auditService = {
  async getAuditLogs(): Promise<AuditEvent[]> {
    try {
      const logs = await apiFetch<AuditEvent[]>('/api/v1/provider/audit');
      return logs;
    } catch {
      return MOCK_AUDIT_LOGS;
    }
  },

  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    const newLog: AuditEvent = {
      id: `AUD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ...event,
    };
    MOCK_AUDIT_LOGS.unshift(newLog);
    return newLog;
  },
};
