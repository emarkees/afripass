'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Shield, Lock, CheckCircle2, ChevronRight, Github, ExternalLink, Globe, Cpu } from 'lucide-react';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';
import { HeroPrivacyFlow, PrivacyCards, PublicVsPrivateVisual } from './components/PrivacyVisuals';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

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

  return (
    <div className="min-h-screen flex flex-col w-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-primary)]/90 border-b border-[var(--border-color)]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[4.5rem]">
          <a href="#" className="flex items-center gap-3 no-underline shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] rounded-[10px] flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <Shield className="w-[1.4rem] h-[1.4rem]" />
            </div>
            <span className="text-[1.35rem] font-extrabold tracking-tight text-[var(--text-primary)]">AfriPass</span>
            <span className="text-[0.7rem] font-bold py-0.5 px-2 rounded-full bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">Midnight ZK</span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#about" className="text-[var(--text-secondary)] no-underline font-semibold text-[0.9rem] hover:text-[var(--text-primary)] transition-colors">
              About
            </a>
            <a href="#privacy-model" className="text-[var(--text-secondary)] no-underline font-semibold text-[0.9rem] hover:text-[var(--text-primary)] transition-colors">
              Privacy Model
            </a>
            <a href="#verify" className="text-[var(--text-secondary)] no-underline font-semibold text-[0.9rem] hover:text-[var(--text-primary)] transition-colors">
              Verify
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Accessible Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer shadow-sm hover:bg-[var(--bg-card-hover)] hover:border-[var(--primary-emerald)] transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>

            {/* Lace Wallet Connect */}
            <WalletConnect
              isConnected={isConnected}
              address={address}
              networkId={networkId}
              error={error}
              isLaceInstalled={isLaceInstalled}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="pt-10 sm:pt-16 pb-12 text-center w-full">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-[var(--badge-text)] text-xs sm:text-sm font-semibold mb-6">
              <Lock className="w-3.5 h-3.5" /> 🔒 Privacy-first verification powered by Midnight
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.15] tracking-tight mb-5 max-w-4xl mx-auto text-[var(--text-primary)]">
              Your Financial Identity.{' '}
              <span className="bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--accent-cyan)] bg-clip-text text-transparent">Without Unnecessary Disclosure.</span>
            </h1>

            <p className="text-base sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              AfriPass lets you prove selected financial credentials using zero-knowledge technology without unnecessarily exposing the information behind them.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {!isConnected ? (
                <button onClick={connect} className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-[1.05rem] cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm">
                  Connect Midnight Wallet <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <a href="#verify" className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-[1.05rem] cursor-pointer border-0 text-white bg-gradient-to-br from-[var(--primary-emerald)] to-[var(--emerald-hover)] hover:brightness-105 transition-all shadow-sm">
                  Verify Privately <ChevronRight className="w-4 h-4" />
                </a>
              )}
              <a href="#privacy-model" className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-bold text-[1.05rem] cursor-pointer border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-sm">
                Explore Privacy Model
              </a>
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

        {/* Privacy Feature Visual Cards */}
        <section id="privacy-model" className="w-full max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
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
                    Designed to work with synthetic financial credentials, mobile money metrics, and cross-border identity verification.
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

        {/* Circuit Execution Form Section */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
          <CircuitCall
            isConnected={isConnected}
            proofState={proofState}
            txHash={txHash}
            lastCounter={lastCounter}
            contractAddress={contractAddress}
            error={error}
            onCallCircuit={callCircuit}
            onConnect={connect}
          />
        </section>
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
              <strong>Privacy Claim:</strong> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.
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
