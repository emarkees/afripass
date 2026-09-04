'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Shield, Lock, CheckCircle2, ChevronRight, Github, ExternalLink, Globe, Cpu, Menu, X, Sparkles, Building2, FileCheck } from 'lucide-react';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';
import { HeroPrivacyFlow, PrivacyCards, PublicVsPrivateVisual } from './components/PrivacyVisuals';
import { PassportDashboard } from './components/PassportDashboard';
import { FinancialCredentials } from './components/FinancialCredentials';
import { ProveFlow } from './components/ProveFlow';
import { VerifierPanel } from './components/VerifierPanel';
import { TrustModel } from './components/TrustModel';
import { IssuerRegistry } from './components/IssuerRegistry';
import { PrivacyModelUpgrade } from './components/PrivacyModelUpgrade';
import { FinancialCredential, CredentialType } from './types/credential';
import { MOCK_CREDENTIALS } from './data/mockCredentials';

import { EnvironmentIndicator } from './components/common/EnvironmentIndicator';
import { UserRequestCenter } from './components/user/UserRequestCenter';
import { ProviderDirectoryView } from './components/user/ProviderDirectoryView';
import { ProviderRegisterView } from './components/provider/ProviderRegisterView';
import { ProviderLoginView } from './components/provider/ProviderLoginView';
import { ProviderDashboardView } from './components/provider/ProviderDashboardView';
import { IssueCredentialView } from './components/provider/IssueCredentialView';
import { ProviderVerifyView } from './components/provider/ProviderVerifyView';
import { ProviderApiView } from './components/provider/ProviderApiView';
import { ProviderAuditView } from './components/provider/ProviderAuditView';
import { ProviderOrgView } from './components/provider/ProviderOrgView';
import { ProviderTeamView } from './components/provider/ProviderTeamView';
import { ProviderBillingView } from './components/provider/ProviderBillingView';
import { ProviderWebhookView } from './components/provider/ProviderWebhookView';
import { ProviderSidebarNav, ProviderTab } from './components/provider/ProviderSidebarNav';
import { Provider, VerificationRequest } from './types/provider';
import { authService } from './services/authService';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedCredentialForProof, setSelectedCredentialForProof] = useState<FinancialCredential | null>(MOCK_CREDENTIALS[0]);
  const [verifierProofId, setVerifierProofId] = useState<string | null>('PROOF-AFP-849201');

  // Application View Modes
  const [activeMainView, setActiveMainView] = useState<'user' | 'requests' | 'directory' | 'provider'>('user');
  const [providerSubTab, setProviderSubTab] = useState<ProviderTab>('dashboard');
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(authService.getCurrentSession());
  const [providerAuthMode, setProviderAuthMode] = useState<'login' | 'register'>('login');

  const {
    isConnected,
    address,
    networkId,
    error,
    isLaceInstalled,
    connect,
    disconnect,
    callCircuit,
    proofState,
    txHash,
    lastCounter,
    contractAddress,
  } = useMidnight();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('afripass_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.className = 'light';
    } else {
      setTheme('dark');
      document.documentElement.className = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('afripass_theme', nextTheme);
    document.documentElement.className = nextTheme;
  };

  const handleSelectClaimFromProveFlow = (claimType: CredentialType, threshold: number) => {
    const matchingCred = MOCK_CREDENTIALS.find((c) => c.type === claimType && c.status === 'active') || MOCK_CREDENTIALS[0];
    setSelectedCredentialForProof(matchingCred);
    setActiveMainView('user');
    setTimeout(() => {
      const verifyElem = document.getElementById('prove');
      if (verifyElem) verifyElem.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigateToVerify = (proofId: string) => {
    setVerifierProofId(proofId);
    setActiveMainView('user');
    setTimeout(() => {
      const verifyPanelElem = document.getElementById('verify-panel');
      if (verifyPanelElem) verifyPanelElem.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGenerateProofForRequest = (req: VerificationRequest) => {
    const matchingCred = MOCK_CREDENTIALS.find((c) => c.status === 'active') || MOCK_CREDENTIALS[0];
    setSelectedCredentialForProof(matchingCred);
    setActiveMainView('user');
    setTimeout(() => {
      const proveElem = document.getElementById('prove');
      if (proveElem) proveElem.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top Status & Environment Bar */}
      <EnvironmentIndicator />

      {/* Header Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-primary)]/90 border-b border-[var(--border-color)]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[4.5rem]">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveMainView('user');
            }}
            className="flex items-center gap-2 sm:gap-3 no-underline shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] rounded-[10px] flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-[1.35rem] font-extrabold tracking-tight text-[var(--text-primary)]">AfriPass</span>
            <span className="hidden xs:inline-block text-[0.65rem] sm:text-[0.7rem] font-bold py-0.5 px-2 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">Level 2 ZK</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold">
            <button
              onClick={() => setActiveMainView('user')}
              className={`transition-colors cursor-pointer ${
                activeMainView === 'user' ? 'text-[var(--primary-emerald)] font-extrabold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              User Passport
            </button>
            <button
              onClick={() => setActiveMainView('requests')}
              className={`transition-colors cursor-pointer flex items-center gap-1 ${
                activeMainView === 'requests' ? 'text-[var(--primary-emerald)] font-extrabold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" /> Request Center
            </button>
            <button
              onClick={() => setActiveMainView('directory')}
              className={`transition-colors cursor-pointer flex items-center gap-1 ${
                activeMainView === 'directory' ? 'text-[var(--primary-emerald)] font-extrabold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Approved Providers
            </button>
            <button
              onClick={() => setActiveMainView('provider')}
              className={`py-1.5 px-3 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMainView === 'provider'
                  ? 'bg-[var(--primary-emerald)] text-white border-[var(--primary-emerald)] font-bold'
                  : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-emerald)]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Provider Portal
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Accessible Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center cursor-pointer shadow-sm hover:bg-[var(--bg-card-hover)] hover:border-[var(--primary-emerald)] transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>

            {/* Lace Wallet Connect Button - Stays on Nav */}
            <WalletConnect
              isConnected={isConnected}
              address={address}
              networkId={networkId}
              error={error}
              isLaceInstalled={isLaceInstalled}
              onConnect={connect}
              onDisconnect={disconnect}
            />

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[var(--bg-card-hover)] transition-colors ml-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <nav className="lg:hidden w-full bg-[var(--bg-card)] border-b border-[var(--border-color)] px-6 py-4 flex flex-col gap-3 shadow-xl text-left text-sm font-bold">
            <button
              onClick={() => {
                setActiveMainView('user');
                setMobileMenuOpen(false);
              }}
              className="py-1.5 text-left border-b border-[var(--border-color)]/50"
            >
              User Financial Passport
            </button>
            <button
              onClick={() => {
                setActiveMainView('requests');
                setMobileMenuOpen(false);
              }}
              className="py-1.5 text-left border-b border-[var(--border-color)]/50 flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4 text-[var(--primary-emerald)]" /> Request & Consent Center
            </button>
            <button
              onClick={() => {
                setActiveMainView('directory');
                setMobileMenuOpen(false);
              }}
              className="py-1.5 text-left border-b border-[var(--border-color)]/50 flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-[var(--primary-emerald)]" /> Approved Providers Directory
            </button>
            <button
              onClick={() => {
                setActiveMainView('provider');
                setMobileMenuOpen(false);
              }}
              className="py-1.5 text-left flex items-center gap-2 text-[var(--primary-emerald)]"
            >
              <Building2 className="w-4 h-4" /> Provider Portal
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full py-6">
        {activeMainView === 'requests' && (
          <div className="px-4 sm:px-6">
            <UserRequestCenter onGenerateProofForRequest={handleGenerateProofForRequest} />
          </div>
        )}

        {activeMainView === 'directory' && (
          <div className="px-4 sm:px-6">
            <ProviderDirectoryView />
          </div>
        )}

        {activeMainView === 'provider' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
            {!currentProvider ? (
              <div>
                {providerAuthMode === 'register' ? (
                  <ProviderRegisterView
                    onSuccess={(p) => {
                      setCurrentProvider(p);
                      setProviderSubTab('dashboard');
                    }}
                    onNavigateToLogin={() => setProviderAuthMode('login')}
                  />
                ) : (
                  <ProviderLoginView
                    onSuccess={(p) => {
                      setCurrentProvider(p);
                      setProviderSubTab('dashboard');
                    }}
                    onNavigateToRegister={() => setProviderAuthMode('register')}
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <ProviderSidebarNav
                  currentTab={providerSubTab}
                  provider={currentProvider}
                  onSelectTab={setProviderSubTab}
                  onLogout={() => {
                    authService.logout();
                    setCurrentProvider(null);
                  }}
                  onSwitchToUserMode={() => setActiveMainView('user')}
                />
                <div className="flex-1 w-full min-w-0">
                  {providerSubTab === 'dashboard' && (
                    <ProviderDashboardView provider={currentProvider} onNavigateTab={setProviderSubTab} />
                  )}
                  {providerSubTab === 'issue' && (
                    <IssueCredentialView provider={currentProvider} onSuccess={() => setProviderSubTab('dashboard')} />
                  )}
                  {providerSubTab === 'verify' && <ProviderVerifyView />}
                  {providerSubTab === 'requests' && (
                    <UserRequestCenter onGenerateProofForRequest={handleGenerateProofForRequest} />
                  )}
                  {providerSubTab === 'team' && <ProviderTeamView currentProvider={currentProvider} />}
                  {providerSubTab === 'api' && <ProviderApiView />}
                  {providerSubTab === 'webhooks' && <ProviderWebhookView currentProvider={currentProvider} />}
                  {providerSubTab === 'billing' && <ProviderBillingView currentProvider={currentProvider} />}
                  {providerSubTab === 'audit' && <ProviderAuditView />}
                  {providerSubTab === 'organization' && <ProviderOrgView provider={currentProvider} />}
                </div>
              </div>
            )}
          </div>
        )}

        {activeMainView === 'user' && (
          <>
            {/* Upgraded Hero Section */}
            <section className="pt-10 sm:pt-16 pb-12 text-center w-full">
              <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs sm:text-sm font-semibold mb-6">
                  <Lock className="w-3.5 h-3.5" /> 🔒 Verified Financial Credentials &bull; Privacy-Preserving Proofs
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.15] tracking-tight mb-5 max-w-4xl mx-auto text-[var(--text-primary)]">
                  Your Financial Identity.{' '}
                  <span className="bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] bg-clip-text text-transparent">
                    Without Unnecessary Disclosure.
                  </span>
                </h1>

                <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
                  Verified financial credentials. Privacy-preserving proofs. AfriPass enables trusted institutions to attest to financial credentials, then uses Midnight zero-knowledge technology to let you prove eligibility without exposing the financial information behind the credential.
                </p>

                <div className="flex flex-wrap gap-4 justify-center mb-12">
                  {!isConnected ? (
                    <button
                      onClick={connect}
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-[1.05rem] cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm"
                    >
                      Connect Midnight Wallet <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <a
                      href="#passport"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-[1.05rem] cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm"
                    >
                      Open Financial Passport <ChevronRight className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href="#prove"
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-[1.05rem] cursor-pointer border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-sm"
                  >
                    Prove Eligibility
                  </a>
                </div>

                {/* Visual Architecture Banner */}
                <div className="w-full max-w-4xl mx-auto mb-10 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-md">
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                    AFRIPASS ARCHITECTURE STACK
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[var(--text-primary)] text-center">
                    <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      Trusted Issuer
                    </div>
                    <span className="text-[var(--primary-emerald)]">➔</span>
                    <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      Verified Credential
                    </div>
                    <span className="text-[var(--primary-emerald)]">➔</span>
                    <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      Midnight ZK Proof
                    </div>
                    <span className="text-[var(--primary-emerald)]">➔</span>
                    <div className="flex-1 min-w-[120px] p-3 rounded-xl bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)]">
                      Financial Verification
                    </div>
                  </div>
                </div>

                {/* Financial Privacy Hero Image */}
                <div className="w-full max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:shadow-[0_0_25px_rgba(16,185,129,0.25)] border border-[var(--border-color)]">
                  <img
                    src="/images/financial_privacy_hero.png"
                    alt="AfriPass Financial Privacy Shield and Zero-Knowledge Proof Concept"
                    className="w-full h-auto block"
                  />
                </div>

                <HeroPrivacyFlow />
              </div>
            </section>

            {/* Passport Dashboard */}
            <PassportDashboard
              isConnected={isConnected}
              address={address}
              networkId={networkId}
              activeCredentialsCount={MOCK_CREDENTIALS.filter((c) => c.status === 'active').length}
              onNavigateToProve={() => {
                const elem = document.getElementById('prove');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              onNavigateToCredentials={() => {
                const elem = document.getElementById('credentials');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Financial Credentials Section */}
            <FinancialCredentials
              onSelectCredentialForProof={(cred) => {
                setSelectedCredentialForProof(cred);
                const elem = document.getElementById('verify');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Prove Flow Selection Section */}
            <ProveFlow onSelectClaim={handleSelectClaimFromProveFlow} />

            {/* Midnight ZK Circuit Execution Form Section */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
              <CircuitCall
                isConnected={isConnected}
                proofState={proofState}
                txHash={txHash}
                lastCounter={lastCounter}
                contractAddress={contractAddress}
                error={error}
                selectedCredentialForProof={selectedCredentialForProof}
                onCallCircuit={callCircuit}
                onConnect={connect}
                onNavigateToVerify={handleNavigateToVerify}
              />
            </section>

            {/* Lender / Verifier Panel */}
            <VerifierPanel initialProofId={verifierProofId} />

            {/* Trust Model Architecture Section */}
            <TrustModel />

            {/* Trusted Issuers Registry Section */}
            <IssuerRegistry />

            {/* Privacy Model Upgrade Section */}
            <PrivacyModelUpgrade />

            {/* Privacy Feature Visual Cards */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
              <PrivacyCards />
            </section>

            {/* About Section */}
            <section id="about" className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-12 sm:my-16 scroll-mt-24">
              <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[1.25rem] p-6 sm:p-12 text-left shadow-md">
                <div className="flex items-center gap-3 mb-4 text-[var(--primary-emerald)]">
                  <Globe className="w-7 h-7 shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">About AfriPass</h2>
                </div>

                <p className="text-base sm:text-[1.1rem] text-[var(--text-secondary)] leading-relaxed mb-6">
                  Across Africa, individuals and micro-enterprises face severe friction when applying for financial services. Lenders demand full bank statements, tax IDs, and sensitive transaction histories, creating privacy risks and centralized data targets.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full items-stretch">
                  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[1.1rem] font-bold mb-2 text-[var(--text-primary)]">
                        🌍 Purpose-Built for Africa
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Designed to work with attested financial credentials, mobile money metrics, and cross-border identity verification.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[1.1rem] font-bold mb-2 text-[var(--text-primary)]">
                        🔐 Powered by Midnight
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Built on Midnight Network using Compact smart contracts to keep user credentials encrypted off-chain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Public vs Private Visual Diagram */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
              <PublicVsPrivateVisual />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border-color)] py-12 mt-16 text-center text-[var(--text-muted)] text-[0.9rem]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-3 no-underline">
              <div className="w-7 h-7 bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] rounded-lg flex items-center justify-center text-white shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-[1.1rem] font-extrabold text-[var(--text-primary)]">AfriPass</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
              <span>Network: <strong>Midnight Preprod</strong></span>
              <span>Contract: <code className="font-mono text-[var(--primary-emerald)]">{contractAddress.slice(0, 10)}...</code></span>
            </div>
          </div>

          <div className="text-[0.825rem] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-color)] pt-6">
            <p>
              <strong>Privacy & Attestation Claim:</strong> AfriPass lets trusted institutions attest to financial credentials, then uses Midnight zero-knowledge technology to let users prove eligibility without exposing underlying bank records.
            </p>
            <p className="mt-2">
              Midnight Builder Challenge Level 2 Project &bull; Built with Next.js, TypeScript, and Midnight.js SDK.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
