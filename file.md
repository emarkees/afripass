# AFRIPASS — MIDNIGHT BUILDER CHALLENGE

## Level 1: New Moon — Setup, Privacy Foundation & First Contract

You are helping me build **AfriPass**, a privacy-preserving financial passport for Africa, for the **Midnight Builder Challenge on Rise In**.

My existing GitHub repository is:

```text
[PASTE MY AFRIPASS PROJECT PATH HERE]
```

Work directly inside this existing AfriPass repository.

Do NOT create a second permanent project or GitHub repository.

The purpose of Level 1 is to establish the Midnight development foundation and produce a small but meaningful AfriPass-oriented Compact contract that demonstrates:

* Public ledger state
* Private witness/input
* Zero-knowledge circuit logic
* Deliberate use of `disclose()`
* Compilation
* Generated `managed/` artifacts
* Automated tests
* Preview or Preprod deployment
* A documented privacy model
* A clear AfriPass product idea

The Level 1 contract is a technical foundation for future AfriPass functionality. Do not attempt to build the complete financial passport in Level 1.

---

# IMPORTANT DEVELOPMENT RULES

1. Work incrementally.
2. Do not skip steps.
3. Do not invent Midnight APIs, Compact syntax, commands, package names, or deployment procedures.
4. Before using Midnight-specific syntax, verify it against the current official Midnight documentation.
5. Prefer the official Midnight documentation over old tutorials, blog posts, or outdated examples.
6. If the challenge instructions conflict with the current Midnight documentation, stop and explain the conflict before making a destructive change.
7. Do not replace existing AfriPass files without inspecting them first.
8. Do not overwrite an existing `package.json` unless necessary.
9. Do not commit secrets, private keys, wallet credentials, `.env` files, or generated sensitive credentials.
10. Never put real financial information into the Level 1 demo.
11. Use synthetic/demo financial data only.
12. Do not claim that a private value is hidden if the actual implementation exposes it.
13. Do not create fake contract addresses, test results, screenshots, or deployment results.
14. Never say a requirement is complete unless it has actually been verified.
15. After every major step, report what succeeded, what failed, and what remains.
16. When an operation requires my wallet funding or manual approval, STOP and wait for me.
17. Keep the Level 1 implementation small enough to understand and demonstrate.

---

# PROJECT VISION

## What is AfriPass?

AfriPass is a privacy-preserving financial passport designed to allow individuals and businesses to prove selected financial credentials without unnecessarily exposing their complete underlying financial information.

The long-term vision is to allow a user to prove claims such as:

```text
Income > ₦300,000
Savings history > 12 months
Repayment rate > 90%
Business activity verified
```

without requiring the verifier to receive the user's entire financial history.

The core principle is:

> VERIFY MORE. REVEAL LESS.

---

# THE PROBLEM AFRIPASS SOLVES

Financial institutions often require customers to provide extensive personal and financial information when applying for loans, credit, financial products, or other services.

This can result in:

* Excessive disclosure of personal financial information
* Fragmented financial identities
* Repeated submission of financial documents
* Privacy risks
* Increased consequences of data breaches
* Difficulty carrying financial credentials between institutions
* Barriers for individuals and small businesses with limited formal financial histories

AfriPass explores a privacy-first alternative:

Instead of:

```text
USER
   ↓
Complete bank statement
   ↓
LENDER
```

AfriPass aims toward:

```text
USER
   ↓
Private financial information
   ↓
Privacy-preserving proof
   ↓
LENDER
   ↓
"Requirement satisfied"
```

The lender should eventually be able to verify a claim without receiving unnecessary underlying information.

---

# LEVEL 1 PRODUCT OBJECTIVE

Do NOT attempt to build the complete AfriPass financial system.

Level 1 should demonstrate the technical foundation required for AfriPass.

Build a small **AfriPass Financial Eligibility Proof prototype**.

The contract should conceptually demonstrate:

```text
Private financial credential
        ↓
Circuit
        ↓
Verification condition
        ↓
Selective disclosure
        ↓
Public/verifiable result
```

Use synthetic data.

Example:

```text
Private income = 350000
Public eligibility result = true
```

The private value should not automatically become public simply because it was used by the circuit.

The exact implementation must follow the current Compact language and Midnight privacy model.

---

# ============================================================

# STEP 0 — INSPECT THE EXISTING AFRIPASS REPOSITORY

# ============================================================

Before installing or changing anything, inspect the repository.

Run:

```bash
pwd
git status
ls -la
find . -maxdepth 2 -type f | sort
```

Inspect:

```text
package.json
README.md
.gitignore
existing source files
existing contracts
existing tests
```

Do not delete existing AfriPass work.

Determine whether the repository already contains a Node project.

Report:

```text
Project path:
Existing package.json:
Existing Node project:
Existing Midnight files:
Existing tests:
Existing README:
Git status:
```

Then continue.

---

# ============================================================

# STEP 1 — TOOLCHAIN SETUP

# ============================================================

Verify Node.js:

```bash
node --version
```

Requirement:

```text
Node.js v22.x.x
```

If Node.js is not v22, STOP and tell me exactly how to install/use Node.js 22.

Verify npm:

```bash
npm --version
```

Verify Git:

```bash
git --version
```

Verify Docker:

```bash
docker --version
```

Verify Docker is actually running:

```bash
docker info
```

If Docker is not running, STOP and tell me to start Docker.

---

## Install Compact Compiler

Install:

```bash
npm install -g @midnight-ntwrk/compact-compiler
```

Then verify:

```bash
compact --version
```

Do not continue until a version number is returned.

IMPORTANT:

Before assuming the package name or command is still current, verify the current Midnight documentation.

If the current official documentation uses a different installation method, explain the difference and use the current documented method.

---

## Proof Server

Pull:

```bash
docker pull midnightnetwork/proof-server
```

Run:

```bash
docker run --name midnight-proof-server -p 6300:6300 midnightnetwork/proof-server
```

If the container already exists:

```bash
docker ps -a
```

Determine whether it can be started instead of creating another container.

Verify the proof server is running.

Do not create duplicate proof-server containers unnecessarily.

---

# ============================================================

# STEP 2 — MIDNIGHT DOCUMENTATION MCP

# ============================================================

The challenge instructions provide:

```bash
claude mcp add --transport http midnight-docs https://midnight.mcp.kapa.ai
```

If using Claude Code, this may be used.

If using Antigravity, do NOT blindly use the Claude command.

Use Antigravity's MCP configuration mechanism.

Expected conceptual configuration:

```json
{
  "mcpServers": {
    "midnight-docs": {
      "serverUrl": "https://midnight.mcp.kapa.ai"
    }
  }
}
```

If the server returns:

```text
Unauthorized
```

do not repeatedly retry.

Report the error and continue using the official Midnight documentation if available.

MCP failure must not prevent Level 1 development unless the challenge explicitly requires it.

---

# ============================================================

# STEP 3 — HELLO WORLD TOOLCHAIN VALIDATION

# ============================================================

The Hello World deployment is a toolchain validation exercise.

Because this repository is already AfriPass, create the Hello World scaffold as a temporary validation project.

Do not turn `mn-demo` into the AfriPass project.

From the appropriate parent directory:

```bash
npx -y create-mn-app mn-demo --template hello-world --use-npm
```

Enter it:

```bash
cd mn-demo
```

Inspect:

```bash
ls -la
find . -maxdepth 2 -type f | sort
```

Install dependencies if required:

```bash
npm install
```

Inspect available npm scripts:

```bash
npm run
```

Before deployment, verify the current Midnight deployment instructions.

Then attempt Preview deployment:

```bash
NODE_OPTIONS="--max-old-space-size=12288" npm run deploy -- --network preview
```

---

# WALLET FUNDING STOP CONDITION

When the wallet address appears:

STOP.

Do NOT continue deployment.

Show me:

```text
Wallet address:
<address>
```

Tell me that I need to fund the wallet using the appropriate official Midnight Preview faucet.

WAIT for my confirmation that the wallet has been funded.

Do not pretend that funding occurred.

---

# AFTER WALLET FUNDING

Continue the deployment only after I confirm funding.

Use the current documented deployment command.

After successful deployment, run the appropriate network command, if supported by the generated project:

```bash
npm run network preview
```

Capture the deployed Hello World contract address.

Clearly report:

```text
HELLO WORLD CONTRACT

Network: Preview
Address: <REAL ADDRESS>
```

Do not confuse this address with the AfriPass Level 1 contract address.

---

# ============================================================

# STEP 4 — RETURN TO AFRIPASS

# ============================================================

Return to the existing AfriPass repository.

Example:

```bash
cd /path/to/afripass
```

Confirm:

```bash
pwd
git status
```

The AfriPass repository should become the actual Level 1 submission.

---

# REQUIRED LEVEL 1 STRUCTURE

Create or preserve:

```text
afripass/
│
├── contracts/
│   └── counter.compact
│
├── managed/
│   └── generated by Compact compiler
│
├── src/
│   └── reserved for Level 2 frontend
│
├── tests/
│   └── counter.test.ts
│
├── .github/
│   └── workflows/
│       └── reserved for Level 3 CI/CD
│
├── README.md
│
├── package.json
│
└── .gitignore
```

Do not manually fabricate the `managed/` directory.

It must be generated by the Compact compiler.

---

# ============================================================

# STEP 5 — DESIGN THE LEVEL 1 AFRIPASS CONTRACT

# ============================================================

Before writing code, explain the contract design in plain English.

The contract should be a minimal demonstration of an AfriPass financial eligibility proof.

The contract must contain:

## A. PUBLIC LEDGER STATE

At least one public ledger value.

For example, an eligibility/result/status value.

Do not expose sensitive financial information as public state.

The public state should represent a result or intentionally public information.

---

## B. PRIVATE WITNESS

The circuit must accept at least one private input/witness.

Use synthetic data.

Example conceptual input:

```text
privateIncome
```

Do not use real user financial information.

---

## C. PRIVACY-PRESERVING LOGIC

The circuit should perform a meaningful verification condition.

Example concept:

```text
privateIncome >= requiredIncome
```

The implementation must follow valid current Compact syntax.

Do not invent syntax.

---

## D. DELIBERATE disclose()

Use `disclose()` deliberately.

The code must make it clear:

```text
PRIVATE INPUT
     ↓
CIRCUIT
     ↓
VERIFICATION
     ↓
DISCLOSE ONLY INTENDED RESULT
```

Do not disclose the private financial value unnecessarily.

The README must explain exactly what `disclose()` does in this implementation.

---

# CONTRACT COMMENT BLOCK

At the top of:

```text
contracts/counter.compact
```

include a clear comment explaining:

```text
PUBLIC:
- What ledger state is visible
- What result is intentionally public

PRIVATE:
- What witness/input remains private
- What financial information is synthetic/private

PROOF:
- What the user proves
- What is intentionally disclosed
```

Do not make false claims about privacy.

---

# IMPORTANT COMPACT VERSION RULE

Before writing the contract:

1. Inspect the installed Compact compiler version.
2. Check the current Compact syntax.
3. Check current examples from official Midnight documentation.
4. Confirm current ledger declaration syntax.
5. Confirm current witness syntax.
6. Confirm current circuit syntax.
7. Confirm current `disclose()` syntax.
8. Confirm current compile command.

Only then write:

```text
contracts/counter.compact
```

---

# ============================================================

# STEP 6 — COMPILE

# ============================================================

Compile:

```bash
compact compile
```

If the project requires a specific source/output configuration, use the current documented project command.

Compilation must succeed.

Verify:

```bash
ls -la managed
find managed -maxdepth 3 -type f | sort
```

Confirm that generated circuit/key artifacts exist.

Do not create fake files to satisfy the requirement.

Capture a screenshot of the successful compile output showing the generated circuits/artifacts.

---

# ============================================================

# STEP 7 — TESTS

# ============================================================

Create:

```text
tests/counter.test.ts
```

Write at least 3 meaningful tests.

## TEST 1 — Circuit Logic

Test that the financial eligibility logic works.

Example conceptual behavior:

```text
Income >= threshold → eligible
Income < threshold → not eligible
```

Use synthetic values.

---

## TEST 2 — State Transition

Test that the expected public ledger state changes correctly after a valid circuit invocation.

---

## TEST 3 — Privacy Behavior

Test the privacy boundary.

The test should demonstrate that:

* The private input is used by the circuit.
* The private value is not intentionally stored as public ledger state.
* Only the intended result/information is disclosed.

Do not write a meaningless test that simply checks a variable exists.

---

# TEST REQUIREMENT

Run the project's actual test command.

Determine it from:

```bash
npm run
```

and:

```text
package.json
```

Do not assume `npm test` if the generated project uses another command.

All tests must pass.

Report:

```text
Tests:
Passed: X
Failed: 0
```

---

# ============================================================

# STEP 8 — DEPLOY THE AFRIPASS LEVEL 1 CONTRACT

# ============================================================

This is NOT the Hello World deployment.

Deploy:

```text
contracts/counter.compact
```

to Preview or Preprod.

Use the current official Midnight deployment workflow.

If wallet funding is required:

STOP and ask me to fund it.

Do not fabricate deployment results.

After deployment succeeds, report:

```text
AFRIPASS LEVEL 1 CONTRACT

Network:
Preview / Preprod

Contract Address:
<REAL CONTRACT ADDRESS>
```

Save this address for the README.

---

# ============================================================

# STEP 9 — README

# ============================================================

Create/update:

```text
README.md
```

The README must be about AfriPass.

Use this structure:

# AfriPass

> A privacy-preserving financial passport that enables users to prove selected financial credentials without unnecessarily exposing their underlying financial data.

## Project Overview

Explain AfriPass in plain English.

Explain that Level 1 is the foundational privacy prototype.

---

## Problem

Explain:

* Financial data is sensitive.
* Users often disclose more information than necessary.
* Financial credentials are fragmented.
* Financial identity is difficult to carry between institutions.
* AfriPass explores privacy-preserving financial verification.

---

## Solution

Explain that AfriPass aims to allow users to prove selected financial claims without exposing complete underlying records.

Example:

```text
Income > ₦300,000 ✓
```

instead of exposing every transaction.

---

## Level 1 Objective

Explain that Level 1 demonstrates:

* Public ledger state
* Private witness
* Circuit logic
* Selective disclosure
* `disclose()`
* ZK compilation
* Generated circuits
* Testing
* Preview/Preprod deployment

---

## Contract Address

```markdown
| Network | Address |
|---|---|
| Preview | [REAL ADDRESS AFTER DEPLOYMENT] |
| Preprod | [REAL ADDRESS IF DEPLOYED] |
```

Never invent an address.

---

## What This Contract Does

Explain the actual Level 1 contract.

Do not describe functionality that has not been implemented.

---

## Privacy Model

### What is PUBLIC

Describe the actual public ledger state.

### What is PRIVATE

Describe the actual private witness.

### What the User PROVES

Describe exactly what the circuit proves.

### What `disclose()` Does

Explain the exact information deliberately disclosed.

---

## Why Midnight

Explain why AfriPass requires:

* Zero-knowledge proofs
* Private computation
* Selective disclosure
* Public verifiability

Use Midnight documentation to verify technical claims.

---

## Tech Stack

```text
Midnight Network
Compact
Node.js v22
npm
Docker
Midnight Proof Server
TypeScript
Git/GitHub
```

Only include technologies actually used.

---

## Prerequisites

List:

* Node.js v22
* npm
* Docker
* Git
* Compact compiler
* Midnight proof server
* Any additional dependencies actually required by the project

---

## Setup

Provide commands that actually work with the repository.

Do not include commands that have not been tested.

---

## Compile

Show the actual compile command.

---

## Run Tests

Show the actual test command.

---

## Deployment

Explain how to deploy to Preview/Preprod.

Do not expose wallet secrets.

---

## Initial Idea

Include:

> AfriPass is a privacy-preserving financial passport for Africa that enables individuals and businesses to prove selected financial credentials, such as income eligibility, savings history, or repayment performance, without unnecessarily exposing their complete underlying financial records. The project uses Midnight's privacy-preserving capabilities to explore a more user-controlled model of financial verification where users can prove what is necessary while revealing less sensitive information.

---

## Screenshots

Include placeholders for:

1. Successful Compact compilation
2. Generated circuits/managed directory
3. Passing tests
4. Deployed contract address

---

## Roadmap

### Level 1

* Toolchain
* Compact contract
* Private witness
* Public state
* `disclose()`
* Tests
* Deployment

### Level 2

* AfriPass financial passport
* Frontend
* Credential generation
* Proof generation
* Verifier interface

### Level 3

* CI/CD
* Security improvements
* Deployment automation
* Monitoring

### Future

* Financial institution integrations
* Cooperative credentials
* Credit eligibility proofs
* Business credentials
* Cross-border financial credentials

---

# ============================================================

# STEP 10 — SECURITY

# ============================================================

Check `.gitignore`.

Make sure the repository does NOT commit:

```text
.env
.env.*
private keys
wallet secrets
mnemonic phrases
credentials
API secrets
```

Check:

```bash
git status
```

Before committing, inspect staged files carefully.

---

# ============================================================

# STEP 11 — GIT COMMITS

# ============================================================

Create at least 5 meaningful commits.

Recommended progression:

```text
1. Initialize AfriPass Midnight project
2. Add Level 1 Compact privacy contract
3. Add contract tests
4. Add AfriPass privacy documentation
5. Deploy Level 1 contract and update README
```

Use meaningful commit messages.

Do not create five empty commits.

Verify:

```bash
git log --oneline --decorate -n 10
```

---

# ============================================================

# STEP 12 — FINAL VERIFICATION

# ============================================================

Before declaring Level 1 complete, independently verify every requirement.

Run:

```bash
compact --version
node --version
docker info
git status
```

Verify:

```text
contracts/counter.compact
managed/
tests/counter.test.ts
README.md
package.json
```

Verify:

```text
Contract compiles
managed/ exists
circuits generated
keys generated
3+ tests pass
AfriPass contract deployed
real contract address recorded
README complete
5+ meaningful commits
```

---

# FINAL RISE IN CHECKLIST

Print exactly this style of checklist:

```text
LEVEL 1 — AFRIPASS

[ ] Node.js v22 verified
[ ] Docker verified
[ ] Compact compiler installed
[ ] Proof server running
[ ] Midnight documentation access configured/verified
[ ] Hello World scaffolded
[ ] Hello World deployed
[ ] AfriPass Level 1 project structure created
[ ] Public ledger state implemented
[ ] Private witness implemented
[ ] Circuit implemented
[ ] disclose() deliberately used
[ ] Compact contract compiles
[ ] managed/ directory generated
[ ] Circuits generated
[ ] Keys/generated artifacts present
[ ] 3+ meaningful tests passing
[ ] AfriPass Level 1 contract deployed
[ ] Contract address recorded
[ ] README completed
[ ] Privacy model documented
[ ] Initial AfriPass idea documented
[ ] Compilation screenshot captured
[ ] Deployment screenshot captured
[ ] Public GitHub repository
[ ] 5+ meaningful commits
```

For each item, mark:

```text
✓ COMPLETE
✗ NOT COMPLETE
⚠ BLOCKED
```

Never mark something complete without evidence.

---

# FINAL OUTPUT

At the end, provide:

## 1. Project Status

```text
AfriPass Level 1:
COMPLETE / IN PROGRESS / BLOCKED
```

## 2. Contract

```text
Network:
Contract Address:
```

## 3. Tests

```text
Passed:
Failed:
```

## 4. Git

```text
Commit count:
Repository status:
```

## 5. Remaining Actions

List only actions that I personally need to perform, such as:

* Fund Preview wallet
* Add screenshots
* Push to GitHub
* Submit to Rise In

Do not tell me something is complete when it has not actually been completed.

---

# CORE PRINCIPLE

The Level 1 contract is deliberately small.

The objective is NOT to build the entire AfriPass financial platform.

The objective is to establish a technically correct Midnight privacy foundation that can evolve into AfriPass.

The architecture should communicate this:

```text
                 AFRIPASS
                    │
                    ▼
          Privacy-Preserving
          Financial Credentials
                    │
                    ▼
              Midnight
                    │
        ┌───────────┴───────────┐
        │                       │
   PRIVATE DATA            PUBLIC PROOF
        │                       │
        └───────────┬───────────┘
                    ▼
             SELECTIVE
             DISCLOSURE
                    │
                    ▼
              VERIFIER
```

Build Level 1 correctly, keep the implementation understandable, and leave the architecture extensible for Level 2.

Do not over-engineer Level 1.
Do not build the frontend yet.
Do not integrate real banks yet.
Do not use real financial information yet.
Do not build lending functionality yet.

The goal is:

> **Build the smallest technically correct Midnight privacy prototype that establishes the foundation for AfriPass.**
