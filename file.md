# AFRIPASS — LEVEL 2 MIDNIGHT BUILDER CHALLENGE

You are helping me complete **Level 2 of the Midnight Builder Challenge on Rise In**.

My repo from Level 1 is at:

```text
[PASTE REPO PATH]
```

My Preprod contract address is:

```text
[PASTE CONTRACT ADDRESS]
```

My project is called **AfriPass**.

AfriPass is a privacy-first financial identity/verification concept that uses Midnight's zero-knowledge technology to allow users to prove selected financial claims without unnecessarily revealing their underlying private information.

**Level 1 has already been completed and approved.**

Do NOT redo Level 1 unless a Level 1 artifact is genuinely required for Level 2.

The primary objective of Level 2 is to add a working frontend that connects to the existing Preprod AfriPass contract through Lace and demonstrates privacy-preserving circuit interaction.

---

════════════════════════════════════════
MIDNIGHT DOCS MCP — ADD THIS FIRST
════════════════════════════════════════

Before starting, make sure the Midnight documentation MCP is connected.

Run this command in your terminal:

```bash
claude mcp add --transport http midnight-docs https://midnight.mcp.kapa.ai
```

Or access the docs directly at:

```text
https://midnight.mcp.kapa.ai
```

This gives you live Midnight documentation inside every AI response.

IMPORTANT:

Before installing Midnight.js packages or implementing the wallet connection, verify the **current official Midnight documentation**.

Do not blindly use outdated Midnight tutorials or APIs.

If a package, API, or command in this prompt has changed, use the currently supported implementation while preserving the Level 2 requirements.

Do not invent Midnight APIs.

---

════════════════════════════════════════
STEP 1 — FILE STRUCTURE
════════════════════════════════════════

Extend the Level 1 structure by adding the frontend:

```text
my-project/
├── contracts/
│   └── counter.compact
├── managed/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── CircuitCall.tsx
│   │   └── PrivacyStatus.tsx
│   │
│   ├── hooks/
│   │   └── useMidnight.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
├── public/
├── .github/
├── README.md
├── package.json
└── vite.config.ts
```

If the existing AfriPass repository already contains a frontend, **extend the existing frontend instead of creating a duplicate application**.

Do not delete the Level 1 contract or generated `managed/` directory.

---

════════════════════════════════════════
STEP 2 — FRONTEND SETUP
════════════════════════════════════════

* Scaffold a React + Vite project, or use the existing React/Vite frontend if already present.
* Use TypeScript.
* Install the currently supported Midnight.js SDK and DApp connector packages.
* The original challenge prompt references:

```bash
npm install @midnight-ntwrk/midnight-js-network-provider
npm install @midnight-ntwrk/dapp-connector-api
```

Before installing, verify whether these are still the correct/current packages.

Use the current official Midnight documentation if package names or APIs have changed.

The frontend must communicate with the **existing Level 1 AfriPass Preprod contract**.

Do NOT create a fake contract or mock the blockchain interaction for the final implementation.

Confirm the project builds with no errors:

```bash
npm run build
```

If supported:

```bash
npx tsc --noEmit
```

Both should pass before continuing.

---

════════════════════════════════════════
STEP 2A — AFRIPASS UI DESIGN
════════════════════════════════════════

The frontend must look like a professional **privacy-first financial technology application**, not a generic blockchain demo.

The primary visual concepts are:

```text
AFRICA
+
FINANCE
+
PRIVACY
+
ZERO-KNOWLEDGE PROOFS
+
SECURE DIGITAL IDENTITY
```

The interface should immediately communicate that AfriPass is designed around privacy.

Use a clean, modern and professional design.

Avoid excessive animations, unnecessary Web3 jargon, or overly complicated dashboards.

---

### HERO SECTION

The homepage should contain a strong hero section.

Use messaging similar to:

```text
Your Financial Identity.
Without Unnecessary Disclosure.
```

Supporting text:

```text
AfriPass lets you prove selected financial credentials
using zero-knowledge technology without unnecessarily
exposing the information behind them.
```

Primary CTA:

```text
Connect Lace
```

After wallet connection, the primary action may become:

```text
Verify Privately
```

Include a visible privacy indicator:

```text
🔒 Privacy-first verification powered by Midnight
```

---

════════════════════════════════════════
STEP 2B — PRIVACY IMAGES / VISUALS
════════════════════════════════════════

The frontend MUST include visual elements/images that immediately communicate **privacy and secure financial information**.

Use appropriate high-quality visual assets.

The visual theme should include concepts such as:

* Digital privacy
* Shield
* Lock
* Encrypted financial information
* Zero-knowledge proofs
* Secure digital identity
* Private credentials
* Selective disclosure
* Financial data protection

A hero illustration should communicate this concept:

```text
PRIVATE FINANCIAL DATA
          ↓
       🔒 SHIELD
          ↓
 ZERO-KNOWLEDGE PROOF
          ↓
       ✓ VERIFIED
```

The image should be abstract or use synthetic information.

NEVER use:

* Real bank statements
* Real account numbers
* Real credit-card numbers
* Real personal financial information
* Real people's private documents

The images must support the privacy story rather than distract from the application.

---

### PRIVACY VISUAL CARDS

Add three visual information cards somewhere below the hero section.

#### Card 1

```text
🔒
KEEP DATA PRIVATE

Sensitive information remains
a private input during verification.
```

#### Card 2

```text
✓
PROVE WITHOUT REVEALING

Use zero-knowledge technology
to prove the required claim.
```

#### Card 3

```text
🛡
VERIFY ON MIDNIGHT

Submit the required proof to
the Midnight network.
```

Make sure the wording accurately reflects what the actual Level 1 contract does.

Do not make unsupported privacy claims.

---

### PUBLIC VS PRIVATE VISUAL

Add a simple visual explanation:

```text
             AFRIPASS
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
   PRIVATE INPUT     PUBLIC RESULT
       🔒                 ✓
       │                  │
       ▼                  ▼
  ZK CIRCUIT         MIDNIGHT LEDGER
       │
       ▼
    ZK PROOF
```

Include explanatory text:

```text
Private
Your private input is used to construct the proof.

Public
Only the information intentionally committed
to the Midnight ledger is public.
```

The exact wording must be consistent with the actual Compact contract.

---

════════════════════════════════════════
STEP 2C — LIGHT & DARK MODE
════════════════════════════════════════

The frontend MUST support:

```text
Light Mode
Dark Mode
```

Add a theme toggle to the application header.

Example:

```text
AfriPass                         ☀ / ☾    Connect Lace
```

Requirements:

* User can switch between light and dark mode.
* Theme applies to the entire application.
* Theme preference persists where practical.
* Respect system preference when no preference has been selected.
* Theme toggle has an accessible label.
* Both themes must have good contrast.
* Do not create separate applications for each theme.

If Tailwind CSS is used, use its supported dark-mode functionality.

---

### LIGHT MODE

Light mode should feel:

```text
Clean
Professional
Trustworthy
Financial
Privacy-focused
```

---

### DARK MODE

Dark mode should feel:

```text
Secure
Private
Modern
Technical
Premium
```

The privacy visuals should remain clearly visible in both modes.

Do not use excessive neon/glow effects.

---

════════════════════════════════════════
STEP 3 — WALLET CONNECTION
════════════════════════════════════════

Build:

```text
src/components/WalletConnect.tsx
```

Requirements:

* Connect button triggers Lace wallet connection.
* Disconnect button clears wallet state.
* Connected wallet address appears on screen.
* Clear disconnected state.
* Handle wallet errors.

The implementation MUST use the current supported Lace/Midnight DApp connector API.

Do not invent API methods.

---

### DISCONNECTED STATE

Display:

```text
Wallet not connected

[ Connect Lace ]
```

---

### CONNECTED STATE

Display:

```text
✓ Wallet Connected

addr_test1...xxxx

[ Disconnect ]
```

The address may be truncated visually.

---

### ERROR HANDLING

Handle:

#### Wallet not installed

```text
Lace wallet not detected.
Please install Lace to continue.
```

#### User rejects connection

```text
Wallet connection was cancelled.
```

#### Wrong network

```text
Wrong network detected.
Please switch to Midnight Preprod.
```

#### Connection error

Display a clear user-friendly error.

Do not expose technical secrets or private inputs.

---

════════════════════════════════════════
STEP 4 — MIDNIGHT HOOK
════════════════════════════════════════

Create:

```text
src/hooks/useMidnight.ts
```

This hook should centralize Midnight interaction.

Conceptually it should provide functionality such as:

```text
useMidnight()
│
├── wallet
├── isConnected
├── address
├── connect()
├── disconnect()
├── contract
├── callCircuit()
├── transaction state
└── error state
```

Use the actual current Midnight.js APIs.

Do not invent methods.

Do not spread raw Midnight SDK logic unnecessarily throughout the components.

---

════════════════════════════════════════
STEP 4A — PRIVACY STATUS COMPONENT
════════════════════════════════════════

Create:

```text
src/components/PrivacyStatus.tsx
```

It should communicate the current privacy state.

Before proof:

```text
🔒 Privacy Protected

Your private input is not displayed.
```

During proof generation:

```text
🔐 Generating Private Proof

Your private input is being used
to construct the proof.
```

After proof:

```text
✓ Proof Generated

Proved without revealing your input.
```

After transaction:

```text
✓ Verified on Midnight Preprod

Your proof was submitted successfully.
```

Do not display the actual private input.

---

════════════════════════════════════════
STEP 5 — CIRCUIT CALL
════════════════════════════════════════

Build:

```text
src/components/CircuitCall.tsx
```

The component must call a circuit from the **actual Level 1 AfriPass Preprod contract**.

First inspect:

```text
contracts/
managed/
```

Determine the actual:

* Contract name
* Circuit name
* Circuit arguments
* Public state
* Private witness
* Generated API

Do NOT assume the circuit is called `increment`.

Use the actual circuit from the Level 1 AfriPass contract.

---

### CIRCUIT UI

Display a privacy-focused interface:

```text
Privacy Verification

Prove your credential without
unnecessarily revealing your input.

[ Generate Private Proof ]

🔒 Proved without revealing your input
```

---

### PROOF GENERATION

When the user clicks the button:

```text
Generating zero-knowledge proof...

Your private input is not displayed.
```

Show a loading state.

Disable duplicate submissions.

---

### ON-CHAIN RESULT

After successful submission:

```text
✓ Proof Generated

✓ Submitted to Midnight Preprod

Proved without revealing your input.
```

Display the transaction identifier/hash if available.

Do not display the private input.

---

════════════════════════════════════════
STEP 5A — PRIVATE INPUT SECURITY
════════════════════════════════════════

Private inputs MUST NEVER be intentionally exposed in the UI.

The private input must NOT be:

* Displayed after submission.
* Logged using `console.log`.
* Added to URLs.
* Stored in localStorage.
* Stored in sessionStorage.
* Sent to an unnecessary backend.
* Sent to analytics.
* Included in error messages.
* Included in screenshots.
* Added to transaction metadata unnecessarily.

If an input field is required to demonstrate the circuit:

* Mask the value.
* Never display it after submission.
* Never log it.
* Never persist it.

Example:

```text
Private credential

[ •••••••••• ]

🔒 This information remains private.
```

After proof:

```text
✓ Proof generated

Private input:
Protected 🔒
```

Never show the actual value.

---

════════════════════════════════════════
STEP 5B — PRIVACY CLAIM
════════════════════════════════════════

The application must include a privacy explanation.

Use a technically accurate statement such as:

> AfriPass uses zero-knowledge technology to allow the required claim to be proven without directly revealing the private witness used to construct the proof.

Before adding this claim, verify it against the actual Compact contract.

Do NOT claim:

* Absolute anonymity.
* That all transaction information is private.
* That the blockchain cannot see anything.
* That AfriPass is a production KYC replacement.
* That AfriPass is a regulated financial service.

The claim must describe what the actual implementation demonstrates.

---

════════════════════════════════════════
STEP 6 — DEPLOY FRONTEND
════════════════════════════════════════

Deploy the frontend using Vercel unless another deployment platform is already configured.

Add:

```text
vercel.json
```

only if necessary.

Provide the exact CLI commands required.

For example, after verifying the current Vercel workflow:

```bash
npm install -g vercel
vercel
```

Production deployment:

```bash
vercel --prod
```

Do not claim deployment succeeded until the real deployment URL is returned.

---

### IMPORTANT

The live frontend MUST connect to:

```text
Midnight Preprod
```

and:

```text
[LEVEL 1 PREPROD CONTRACT ADDRESS]
```

Do not accidentally deploy the frontend configured for Preview.

Use environment variables where appropriate.

Provide:

```text
.env.example
```

and ensure secrets are not committed.

---

════════════════════════════════════════
STEP 7 — README.md
════════════════════════════════════════

Update the existing README.md.

Do NOT delete useful Level 1 documentation.

The README must contain ALL of these sections:

# AfriPass

> A privacy-preserving financial passport that enables users to prove selected financial credentials without unnecessarily exposing their underlying private information.

## Live Demo

```text
[PASTE LIVE URL AFTER DEPLOYING FRONTEND]
```

The real live URL must be added after deployment.

---

## Contract Address

| Network | Address                         |
| ------- | ------------------------------- |
| Preprod | [CONTRACT ADDRESS FROM LEVEL 1] |

The contract address is MANDATORY.

Do not leave it blank.

---

## What This Does

Explain in plain English what AfriPass does.

Explain that the application allows users to interact with the deployed Midnight contract and demonstrate privacy-preserving verification.

---

## Privacy Model

Explain:

### What is PUBLIC

What information is visible on-chain.

### What is PRIVATE

What remains a private witness/input.

### What the user PROVES without revealing

Explain the actual claim demonstrated by the Level 1 contract.

---

## Privacy Claim

Include a specific statement describing:

```text
What an on-chain observer can see
```

versus:

```text
What the observer cannot directly recover
```

The statement must be verified against the actual implementation.

---

## Tech Stack

Include technologies actually used:

```text
Midnight Network
Compact
Midnight.js SDK
React
Vite
TypeScript
Lace Wallet
Node.js v22
Docker
```

---

## Prerequisites

```text
Lace wallet installed
Node.js v22
npm
Midnight Preprod access
```

---

## Run Locally

Provide tested commands:

```bash
git clone <repository-url>
cd afripass
npm install
npm run dev
```

If environment configuration is required:

```bash
cp .env.example .env.local
```

Then explain the required variables.

---

## Build

```bash
npm run build
```

---

## Demo Video

```text
[PLACEHOLDER — I WILL ADD THE LINK AFTER RECORDING]
```

---

## Privacy Design

Document the visual privacy features:

* Privacy-first hero section.
* Private/public visual explanation.
* Privacy status component.
* Privacy-focused imagery.
* Light mode.
* Dark mode.
* Privacy messaging.

---

════════════════════════════════════════
STEP 8 — DEMO VIDEO CHECKLIST
════════════════════════════════════════

Tell me exactly what to record in a demo video under 2 minutes.

### 1. Connect Lace

Show:

```text
Connect Lace
```

Then show the wallet address appearing.

---

### 2. Call the Circuit

Show the privacy verification screen.

Click:

```text
Generate Private Proof
```

Show:

```text
Generating zero-knowledge proof...
```

Do NOT show the private input.

---

### 3. Show Result

Show:

```text
✓ Proof Generated
✓ Submitted to Midnight Preprod
```

Show the transaction result/ID if available.

---

### 4. Explain Privacy

Point to:

```text
Proved without revealing your input
```

Explain briefly that the proof demonstrates the required claim without exposing the underlying private witness.

---

### 5. Show Dark Mode

Briefly switch:

```text
Light Mode → Dark Mode
```

Show that the privacy-focused UI works in both themes.

---

════════════════════════════════════════
STEP 9 — FINAL CHECKLIST
════════════════════════════════════════

Print ✓ or ✗ for each requirement:

```text
[ ] Lace wallet connect working
[ ] Lace wallet disconnect working
[ ] Wallet address displayed
[ ] Wallet-not-installed error handled
[ ] User-rejected connection handled
[ ] Wrong-network error handled
[ ] Preprod network configured
[ ] Actual Level 1 Preprod contract connected
[ ] Circuit called from frontend
[ ] Proof generated locally
[ ] Loading state shown during proof generation
[ ] Transaction submitted on-chain
[ ] Transaction result displayed
[ ] Private input never intentionally displayed
[ ] Private input never logged
[ ] Private input not stored in localStorage
[ ] Private input not stored in sessionStorage
[ ] Private input not exposed through URL
[ ] Privacy Status component implemented
[ ] Privacy Claim section implemented
[ ] Privacy-focused images/visuals added
[ ] Public vs private explanation added
[ ] Light mode working
[ ] Dark mode working
[ ] Theme toggle working
[ ] Responsive design working
[ ] Frontend builds successfully
[ ] TypeScript passes
[ ] Live frontend deployed
[ ] Live URL connects to Preprod
[ ] Contract address in README.md
[ ] Live demo link in README.md
[ ] Privacy Claim section in README.md
[ ] File structure matches specification
[ ] Demo video recorded
```

Use:

```text
✓ COMPLETE
✗ NOT COMPLETE
⚠ BLOCKED
```

Never mark an item complete without actually testing it.

---

════════════════════════════════════════
FINAL REPORT
════════════════════════════════════════

At the end provide:

## Level 2 Status

```text
COMPLETE / IN PROGRESS / BLOCKED
```

## Preprod Contract

```text
Network:
Preprod

Contract:
<REAL CONTRACT ADDRESS>
```

## Frontend

```text
Local:
<LOCAL URL>

Production:
<REAL LIVE URL>
```

## Wallet

```text
Lace:
CONNECTED / NOT TESTED / BLOCKED
```

## Circuit

```text
Circuit:
<ACTUAL CIRCUIT NAME>

Proof:
LOCAL / NOT WORKING / BLOCKED
```

## Transaction

```text
Status:
SUCCESS / FAILED / NOT TESTED

Transaction:
<REAL TRANSACTION ID IF AVAILABLE>
```

## Build

```text
Build:
PASS / FAIL

TypeScript:
PASS / FAIL
```

## Git

```text
Changes committed:
YES / NO

Changes pushed:
YES / NO
```

## Remaining Actions

Only list actions I personally need to perform.

Examples:

```text
- Record demo video
- Add demo video URL
- Push final commit
- Submit Level 2 on Rise In
```

---

# MOST IMPORTANT LEVEL 2 PRINCIPLE

Do not turn AfriPass into a generic blockchain dashboard.

The purpose of Level 2 is to demonstrate:

```text
                 AFRIPASS
                    │
                    ▼
               LACE WALLET
                    │
                    ▼
            PRIVATE INPUT
                    │
                    ▼
             MIDNIGHT.JS
                    │
                    ▼
        LOCAL ZK PROOF GENERATION
                    │
                    ▼
           MIDNIGHT PREPROD
                    │
                    ▼
             VERIFIED RESULT
```

The user experience should communicate:

> **Prove what matters. Keep what matters private.**

The application should visually and technically demonstrate that principle.

Do not over-engineer Level 2.

Prioritize:

1. Working Lace connection.
2. Working Midnight.js integration.
3. Working circuit call.
4. Local proof generation.
5. Successful Preprod transaction.
6. Privacy-preserving UX.
7. Light/dark mode.
8. Privacy-focused imagery.
9. Professional AfriPass presentation.
10. Complete Rise In requirements.
