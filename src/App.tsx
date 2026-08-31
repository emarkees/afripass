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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo-group">
            <div className="logo-icon">
              <Shield style={{ width: '1.4rem', height: '1.4rem' }} />
            </div>
            <span className="logo-text">AfriPass</span>
            <span className="logo-tag">Midnight ZK</span>
          </a>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              About
            </a>
            <a href="#privacy-model" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              Privacy Model
            </a>
            <a href="#verify" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              Verify
            </a>
          </nav>

          <div className="header-actions">
            {/* Accessible Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b' }} />
              ) : (
                <Moon style={{ width: '1.25rem', height: '1.25rem', color: '#4f46e5' }} />
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
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="privacy-badge">
              <Lock style={{ width: '0.9rem', height: '0.9rem' }} /> 🔒 Privacy-first verification powered by Midnight
            </div>

            <h1 className="hero-title">
              Your Financial Identity.{' '}
              <span className="hero-title-gradient">Without Unnecessary Disclosure.</span>
            </h1>

            <p className="hero-subtitle">
              AfriPass lets you prove selected financial credentials using zero-knowledge technology without unnecessarily exposing the information behind them.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {!isConnected ? (
                <button onClick={connect} className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                  Connect Lace Wallet <ChevronRight style={{ width: '1.1rem', height: '1.1rem' }} />
                </button>
              ) : (
                <a href="#verify" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                  Verify Privately <ChevronRight style={{ width: '1.1rem', height: '1.1rem' }} />
                </a>
              )}
              <a href="#privacy-model" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                Explore Privacy Model
              </a>
            </div>

            {/* Financial Privacy Hero Image */}
            <div style={{
              maxWidth: '720px',
              margin: '0 auto 2rem auto',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
              border: '1px solid var(--border-color)'
            }}>
              <img
                src="/images/financial_privacy_hero.png"
                alt="AfriPass Financial Privacy Shield and Zero-Knowledge Proof Concept"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <HeroPrivacyFlow />
          </div>
        </section>

        {/* Privacy Feature Visual Cards */}
        <section id="privacy-model" className="container">
          <PrivacyCards />
        </section>

        {/* About Section */}
        <section id="about" className="container" style={{ margin: '4rem auto' }}>
          <div className="visual-section" style={{ textAlign: 'left', padding: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary-emerald)' }}>
              <Globe style={{ width: '1.75rem', height: '1.75rem' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>About AfriPass</h2>
            </div>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Across Africa, individuals and micro-enterprises face severe friction when applying for financial services. Lenders demand full bank statements, tax IDs, and sensitive transaction histories, creating privacy risks and centralized data targets.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '0.875rem', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  🌍 Purpose-Built for Africa
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Designed to work with synthetic financial credentials, mobile money metrics, and cross-border identity verification.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '0.875rem', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  🔐 Powered by Midnight
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Built on Midnight Network using Compact smart contracts to keep user credentials encrypted off-chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Public vs Private Visual Diagram */}
        <section className="container">
          <PublicVsPrivateVisual />
        </section>

        {/* Circuit Execution Form Section */}
        <section className="container">
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
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="logo-group">
              <div className="logo-icon" style={{ width: '1.8rem', height: '1.8rem' }}>
                <Shield style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <span className="logo-text" style={{ fontSize: '1.1rem' }}>AfriPass</span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Network: <strong>Midnight Preprod</strong></span>
              <span>Contract: <code style={{ color: 'var(--primary-emerald)' }}>{contractAddress.slice(0, 10)}...</code></span>
            </div>
          </div>

          <div style={{
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem'
          }}>
            <p>
              <strong>Privacy Claim:</strong> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Midnight Builder Challenge Level 2 Project &bull; Built with Next.js, TypeScript, and Midnight.js SDK.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
