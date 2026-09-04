# AfriPass — Verified Financial Credentials & Privacy-Preserving Proofs

> A privacy-preserving financial credential and verification infrastructure network enabling trusted institutions to attest to financial credentials, then leveraging Midnight zero-knowledge technology to let users prove eligibility without exposing underlying bank records.

## Live Demo & Deployment

- **Live Web Application**: [https://afripass-three.vercel.app](https://afripass-three.vercel.app)
- **Go REST Backend Server**: `http://localhost:8080` (Dockerized Go 1.22+)

## Contract Address

| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400` |

---

## Architecture Overview

AfriPass connects **Users**, **Financial-Service Providers**, **Credential Issuers**, and **Verifiers** through a multi-tenant platform:

```text
Trusted Financial Provider
        ↓
Provider Attestation (HMAC-SHA256)
        ↓
AfriPass Credential
        ↓
User Financial Passport
        ↓
User Consent & Request Center
        ↓
Midnight ZK Proof (Compact Circuit)
        ↓
Verification Session / QR Code
        ↓
Verifier (Minimum Disclosure)
```

Core product principle: **VERIFY MORE. REVEAL LESS.**

---

## System Capabilities

### 1. Multi-Tenant Provider Network
- **Tenant Isolation**: Every financial service provider operates inside an isolated organization context.
- **Role-Based Access Control (RBAC)**: Support for `OWNER`, `ADMIN`, `ISSUER`, `VERIFIER`, `DEVELOPER`, and `AUDITOR` permissions.
- **Provider Roles**: Distinguishes between Credential Issuers, Proof Verifiers, and combined institutions.

### 2. Go Backend REST API (`backend/`)
- Built in Go 1.22+ featuring PostgreSQL schema, CORS security middleware, HMAC-SHA256 institutional attestations, and structured JSON responses.
- Endpoints for auth (`/api/v1/auth/login`), onboarding (`/api/v1/providers/register`), credentials (`/api/v1/credentials`), team management (`/api/v1/provider/members`), ZK verification (`/api/v1/proofs/verify`), API keys (`/api/v1/provider/api-keys`), audit logging (`/api/v1/provider/audit`), and SaaS subscriptions (`/api/v1/provider/subscription`).

### 3. User Consent & Verification Center
- Explicit consent modals preventing automatic disclosure of financial records.
- Verifier requests specify required threshold and purpose (e.g. Monthly Income ≥ ₦1,000,000 for Loan Application).

### 4. SaaS Subscription & API Platform
- Configurable API quotas (`Sandbox`, `Starter`, `Professional`, `Enterprise`).
- Scoped API key management and real-time developer webhooks (`credential.issued`, `credential.revoked`, `verification.completed`, `proof.verified`).

---

## Privacy Model

- **What is PUBLIC**: The verified on-chain claim counter (`counter`), contract address, transaction proof verification result, attesting institution status, and network metadata.
- **What is PRIVATE**: The private witness credential (`step` input representing monthly income/credit metric), underlying bank statements, account balances, and transaction logs, which stay encrypted in local device memory during proof construction.
- **What the user PROVES without revealing**: The user proves they possess a valid financial credential satisfying contract requirements (e.g. Monthly Income ≥ ₦1,000,000) and executed a valid state transition on the Midnight ledger without revealing their exact income, account balance, or transaction history.

## Privacy Claim

> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.

- **What an on-chain observer CAN see:** The public state transition (`counter`), contract address, block timestamp, issuer attestation status, and cryptographic proof verification validity.
- **What an on-chain observer CANNOT see:** The private witness (`step`), exact income amount, user identity, spending history, or private account balance.

---

## Tech Stack

- **Blockchain & ZK Layer**: Midnight Network, Compact Language, Midnight.js SDK, Lace Wallet
- **Frontend**: React 18, Next.js 14, TypeScript, TailwindCSS, Lucide Icons
- **Backend**: Golang 1.22+, PostgreSQL, OpenAPI 3.0, Docker & Docker Compose

---

## Run Locally

### 1. Start the Go Backend Server
```bash
cd backend
go run cmd/server/main.go
```
*The backend API will start on `http://localhost:8080`.*

### 2. Start the Frontend Application
```bash
# In the root repository
npm install
npm run dev
```
*Open `http://localhost:3000` in your web browser.*

### 3. Run Tests
```bash
# Backend unit tests
cd backend && go test ./...

# Frontend type check & production build
npm run build
```

---

## Demo Video

https://www.loom.com/share/09a7aac782a44145831c27e9f6796a99

---

## Verification Checklist

- [x] **Midnight ZK Foundation**: Preserved Lace wallet, Compact contract, and local witness proof pipeline.
- [x] **Multi-Tenant Provider Portal**: Provider onboarding, dashboard, staff role management, and organizational profile.
- [x] **Go REST API Backend**: Modular Go REST API handling institutional attestations, credential issuance, and ZK verification.
- [x] **SaaS Billing & Developer Tools**: Subscriptions, API key management, audit logs, and developer webhooks.
- [x] **User Consent Center**: Verification requests with explicit user consent and minimum disclosure verification.
