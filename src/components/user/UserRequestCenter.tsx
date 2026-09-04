'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, ShieldCheck, Clock, CheckCircle2, XCircle, ArrowRight, Lock, Building2 } from 'lucide-react';
import { verificationService } from '../../services/verificationService';
import { VerificationRequest } from '../../types/provider';

interface UserRequestCenterProps {
  onGenerateProofForRequest: (req: VerificationRequest) => void;
}

export const UserRequestCenter: React.FC<UserRequestCenterProps> = ({
  onGenerateProofForRequest,
}) => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    verificationService.getIncomingRequests().then((res) => {
      setRequests(res);
      setIsLoading(false);
    });
  }, []);

  const handleConsent = async (reqId: string, approved: boolean) => {
    try {
      await verificationService.submitUserConsent(reqId, approved);
      setRequests(
        requests.map((r) =>
          r.id === reqId ? { ...r, status: approved ? 'approved' : 'rejected' } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">User Consent & Verification Request Center</h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Review verification requests from approved financial institutions. Granting consent generates a Midnight Zero-Knowledge proof without revealing your underlying bank balances.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)] animate-pulse">
            Loading verification requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)]">
            No pending verification requests at this time.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[var(--text-primary)]">{req.providerName}</h3>
                      <p className="text-xs text-[var(--text-muted)]">Requested for: {req.purpose}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold py-1 px-3 rounded-full ${
                      req.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                        : req.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                    }`}
                  >
                    {req.status === 'pending' && '⏳ Consent Requested'}
                    {req.status === 'approved' && '✓ Consent Granted'}
                    {req.status === 'rejected' && '✕ Consent Rejected'}
                  </span>
                </div>

                <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Required Condition:</span>
                    <span className="font-bold text-[var(--primary-emerald)]">{req.claimRequired}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Threshold Amount:</span>
                    <span className="font-bold font-mono">{req.formattedThreshold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Request Expiration:</span>
                    <span className="font-mono text-[var(--text-muted)]">{req.expiresAt}</span>
                  </div>
                </div>

                <div className="bg-[var(--badge-bg)] border border-[var(--badge-border)] rounded-xl p-3 text-[0.75rem] text-[var(--badge-text)] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--primary-emerald)] shrink-0" />
                  <span>
                    <strong>Privacy Assurance:</strong> Approving this request generates a Midnight ZK proof proving you meet {req.formattedThreshold} without disclosing your exact bank statement or account number to {req.providerName}.
                  </span>
                </div>

                {req.status === 'pending' && (
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleConsent(req.id, false)}
                      className="py-2 px-4 rounded-xl font-bold text-xs bg-[var(--bg-card)] border border-[var(--border-color)] text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleConsent(req.id, true);
                        onGenerateProofForRequest(req);
                      }}
                      className="py-2.5 px-5 rounded-xl font-bold text-xs text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      Grant Consent & Generate Midnight Proof <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
