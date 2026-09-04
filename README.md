# AfriPass — Verified Financial Credentials & Privacy-Preserving Proofs

> A privacy-preserving financial passport enabling trusted institutions to attest to financial credentials, then leveraging Midnight zero-knowledge technology to let users prove eligibility without exposing underlying bank records.

## Live Demo

https://afripass.vercel.app

## Contract Address

| Network  | Address                          |
|----------|----------------------------------|
| Preprod  | `2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400` |

## What This Does

AfriPass is a privacy-first financial passport dApp built on the Midnight Network. Across Africa, individuals and micro-enterprises face severe friction when applying for financial services because lenders demand raw bank statements, tax IDs, and sensitive transaction logs.

AfriPass bridges financial institutions and lenders through a 4-layer trust stack:
`Trusted Issuer ➔ Attested Credential ➔ Midnight ZK Proof ➔ Verifier`

Users connect their Lace wallet, select an attested financial credential (such as monthly income or credit score) issued by a verified institution, execute a local zero-knowledge circuit, generate a ZK proof locally on their device, and submit the verification proof directly to the Midnight Preprod network without ever exposing their raw financial data or bank statements.

## Privacy Model

- What is PUBLIC: The verified on-chain claim counter (`counter`), contract address, transaction proof verification result, attesting institution status, and network metadata.
- What is PRIVATE: The private witness credential (`step` input representing monthly income/credit metric), underlying bank statements, account balances, and transaction logs, which stay encrypted in local device memory during proof construction.
- What the user PROVES without revealing: The user proves they possess a valid financial credential satisfying contract requirements (e.g. Monthly Income ≥ ₦1,000,000) and executed a valid state transition on the Midnight ledger without revealing their exact income, account balance, or transaction history.

## Privacy Claim

> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.

- **What an on-chain observer CAN see:** The public state transition (`counter`), contract address, block timestamp, issuer attestation status, and cryptographic proof verification validity.
- **What an on-chain observer CANNOT see:** The private witness (`step`), exact income amount, user identity, spending history, or private account balance.

## Tech Stack

Midnight network, Compact, Midnight.js SDK, React/Next.js, Lace wallet

## Prerequisites

- Lace wallet installed
- Node.js v22

## Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/emarkees/afripass.git
   cd afripass
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Start local development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your web browser.

## Demo Video

https://www.loom.com/share/09a7aac782a44145831c27e9f6796a99
