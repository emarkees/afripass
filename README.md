# AfriPass

> A privacy-preserving financial passport that enables users to prove selected financial credentials without unnecessarily exposing their underlying private information.

## Live Demo

```text
https://afripass-midnight.vercel.app
```

---

## Contract Address

| Network | Address |
| ------- | ------- |
| Preprod | `2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400` |
| Preview | `2315129c322aba100c4c550157b64e94fd917547b73df1bc1bac867b88cd0400` |

---

## What This Does

AfriPass is a privacy-first financial technology concept that allows users to interact with a deployed Midnight smart contract to prove financial eligibility credentials without disclosing sensitive bank data or full transaction histories.

Through the Next.js frontend, users connect their Lace wallet, enter a masked synthetic financial credential (such as monthly income or credit score), generate a zero-knowledge proof locally on their device using Midnight.js, and submit the verification proof directly to the Midnight Preprod network.

---

## Privacy Model

### What is PUBLIC

The `counter` variable stored on the public Midnight ledger. It tracks the total count of verified financial eligibility claims recorded on-chain without revealing who conducted them or their private inputs.

### What is PRIVATE

The `step` input (synthetic monthly income credential). It remains a private witness processed exclusively inside the local WebAssembly ZK circuit and is never published or exposed across the network.

### What the User PROVES Without Revealing

The user proves they possess a valid financial credential satisfying contract requirements and executed a valid state transition (`counter + 1`) on the Midnight ledger without disclosing their exact income, account balance, or personal transaction logs.

### Selective Disclosure

Controlled usage of `disclose()` demonstrates how verified parameters can be selectively revealed to authorized verifiers when explicitly required by contract rules.

---

## Privacy Claim

> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.

- **What an on-chain observer CAN see:** The public state transition (`counter`), contract address, and cryptographic proof verification validity.
- **What an on-chain observer CANNOT directly recover:** The private witness (`step`), exact income amount, or private user balance.

---

## Tech Stack

- **Midnight Network:** Zero-Knowledge Smart Contract Platform (Preprod Network)
- **Compact:** Smart Contract Programming Language (`contracts/counter.compact`)
- **Midnight.js SDK:** `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/compact-runtime`
- **Next.js:** App Router with React 18 & TypeScript
- **Lace Wallet:** Web3 DApp Connector Integration
- **Lucide React:** Modern Iconography System
- **Node.js:** v22
- **Docker:** Midnight Proof Server Container (`midnightnetwork/proof-server`)

---

## Prerequisites

- Lace Wallet Chrome Extension installed and configured for Midnight Preprod
- Node.js v22.x or higher
- npm
- Funded Midnight Preprod Wallet (`tNight` tokens)

---

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
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.

---

## Build

Compile TypeScript and build the production bundle:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

---

## Demo Video

```text
[PLACEHOLDER — I WILL ADD THE LINK AFTER RECORDING]
```

---

## Privacy Design

The AfriPass user experience is designed around privacy principles:
- **Privacy-First Hero Section:** Direct messaging communicating identity verification without disclosure.
- **Private/Public Visual Diagram:** Interactive visual breaking down private local circuit witnesses vs public ledger state.
- **Privacy Status Component:** Real-time visual indicator tracking proof state (Idle 🔒 ➔ Generating 🔐 ➔ Verified ✓).
- **Masked Input Protection:** Private credential inputs are masked (`••••••••`) and never stored in `localStorage`, `sessionStorage`, URL parameters, or `console.log`.
- **Light & Dark Themes:** Accessible dark/light mode toggle with theme persistence.
- **Financial Privacy Visual Assets:** High-resolution 3D privacy shield and zero-knowledge proof illustrations.
