-- AfriPass Production Schema v1.0
-- PostgreSQL Compatible Migration

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    country VARCHAR(64) NOT NULL,
    business_email VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(255),
    contact_person VARCHAR(255),
    role VARCHAR(32) NOT NULL DEFAULT 'both', -- 'issuer', 'verifier', 'both'
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'suspended', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provider_members (
    id VARCHAR(64) PRIMARY KEY,
    provider_id VARCHAR(64) REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'verifier', -- 'owner', 'admin', 'issuer', 'verifier', 'auditor', 'developer'
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credentials (
    id VARCHAR(64) PRIMARY KEY,
    credential_type VARCHAR(64) NOT NULL,
    issuer_id VARCHAR(64) REFERENCES organizations(id),
    subject_commitment VARCHAR(255) NOT NULL,
    claim VARCHAR(255) NOT NULL,
    value_amount NUMERIC(18, 2),
    currency VARCHAR(16) DEFAULT 'NGN',
    period VARCHAR(64) DEFAULT '6 months',
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'expired', 'revoked'
    revocation_reason TEXT,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attestations (
    id VARCHAR(64) PRIMARY KEY,
    credential_id VARCHAR(64) REFERENCES credentials(id) ON DELETE CASCADE,
    issuer_id VARCHAR(64) REFERENCES organizations(id),
    signature TEXT NOT NULL,
    signature_algorithm VARCHAR(64) NOT NULL DEFAULT 'HMAC-SHA256',
    key_id VARCHAR(64) NOT NULL DEFAULT 'key_001',
    status VARCHAR(32) NOT NULL DEFAULT 'valid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_requests (
    id VARCHAR(64) PRIMARY KEY,
    provider_id VARCHAR(64) REFERENCES organizations(id),
    provider_name VARCHAR(255) NOT NULL,
    credential_type VARCHAR(64) NOT NULL,
    claim_required VARCHAR(255) NOT NULL,
    threshold NUMERIC(18, 2) NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS consents (
    id VARCHAR(64) PRIMARY KEY,
    request_id VARCHAR(64) REFERENCES verification_requests(id),
    user_id VARCHAR(64) REFERENCES users(id),
    provider_id VARCHAR(64) REFERENCES organizations(id),
    claim_approved VARCHAR(255) NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    proof_id VARCHAR(64) NOT NULL,
    claim VARCHAR(255) NOT NULL,
    provider_name VARCHAR(255) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS proofs (
    id VARCHAR(64) PRIMARY KEY,
    credential_id VARCHAR(64) REFERENCES credentials(id),
    verification_request_id VARCHAR(64),
    proof_reference VARCHAR(255) NOT NULL,
    claim_type VARCHAR(64) NOT NULL,
    result BOOLEAN NOT NULL DEFAULT TRUE,
    issuer_id VARCHAR(64) REFERENCES organizations(id),
    midnight_network VARCHAR(64) DEFAULT 'Midnight Preprod Network',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    actor VARCHAR(255) NOT NULL,
    severity VARCHAR(32) NOT NULL DEFAULT 'info',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_keys (
    id VARCHAR(64) PRIMARY KEY,
    provider_id VARCHAR(64) REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(32) NOT NULL,
    hashed_secret VARCHAR(255) NOT NULL,
    permissions TEXT NOT NULL, -- comma separated scopes
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE
);
