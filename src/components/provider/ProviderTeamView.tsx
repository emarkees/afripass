import React, { useState } from 'react';
import { Provider } from '../../types/provider';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'ISSUER' | 'VERIFIER' | 'DEVELOPER' | 'AUDITOR';
  status: 'active' | 'invited' | 'suspended';
  createdAt: string;
}

interface ProviderTeamViewProps {
  currentProvider: Provider;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'mem-001',
    name: 'Amina Bello',
    email: 'compliance@demobank.ng',
    role: 'OWNER',
    status: 'active',
    createdAt: '2026-03-01',
  },
  {
    id: 'mem-002',
    name: 'Tunde Afolayan',
    email: 'issuance@demobank.ng',
    role: 'ISSUER',
    status: 'active',
    createdAt: '2026-06-15',
  },
  {
    id: 'mem-003',
    name: 'Kofi Mensah',
    email: 'devs@demobank.ng',
    role: 'DEVELOPER',
    status: 'active',
    createdAt: '2026-08-01',
  },
  {
    id: 'mem-004',
    name: 'Sarah Akintola',
    email: 'audit@demobank.ng',
    role: 'AUDITOR',
    status: 'invited',
    createdAt: '2026-09-02',
  },
];

export const ProviderTeamView: React.FC<ProviderTeamViewProps> = ({ currentProvider }) => {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('ISSUER');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: `mem-${Math.floor(100 + Math.random() * 900)}`,
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMembers([...members, newMember]);
    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const getRoleBadge = (role: TeamMember['role']) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'ADMIN':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'ISSUER':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'VERIFIER':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'DEVELOPER':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'AUDITOR':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-100">Team & Role Management</h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Multi-Tenant Isolated
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Manage team members and role-based permissions for <span className="font-semibold text-slate-200">{currentProvider.name}</span>.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <span>+ Invite Staff Member</span>
        </button>
      </div>

      {/* Team Table */}
      <div className="bg-slate-900/60 dark:bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role / Scope</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{m.name}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{m.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(m.role)}`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        m.status === 'active'
                          ? 'text-emerald-400'
                          : m.status === 'invited'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          m.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{m.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-100">Invite Staff Member</h3>
            <p className="text-xs text-slate-400">
              Invited staff will receive access restricted strictly to your organization's tenant context.
            </p>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tunde Afolayan"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="staff@demobank.ng"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ADMIN">ADMIN (Manage team & org profile)</option>
                  <option value="ISSUER">ISSUER (Issue & revoke financial credentials)</option>
                  <option value="VERIFIER">VERIFIER (Create verification requests & verify proofs)</option>
                  <option value="DEVELOPER">DEVELOPER (API keys, webhooks & dev portal)</option>
                  <option value="AUDITOR">AUDITOR (Read-only access to audit logs)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold rounded-xl"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
