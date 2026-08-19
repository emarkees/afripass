# afripass
> A simple zero-knowledge counter contract on the Midnight Network.

## Contract Address
| Network  | Address                          |
|----------|----------------------------------|
| Preview  | [PASTE ADDRESS AFTER DEPLOY]     |
| Preprod  | [PASTE ADDRESS AFTER DEPLOY]     |

## What This Does
This contract implements a simple counter that allows users to increment a value stored on the ledger while proving they know the increment amount without necessarily exposing the value itself to unauthorized observers.

## Privacy Model
- **What is PUBLIC (on-chain, visible to anyone):** The current `counter` value stored in the ledger state.
- **What is PRIVATE (private witness, never on-chain):** The `step` (increment amount) provided by the caller as a circuit input.
- **What the user PROVES without revealing:** The user proves that they performed a valid arithmetic update (`current + step`) and that they know the `step` amount, without having to expose the `step` value itself on-chain (except where deliberately disclosed using `disclose()`).

## Tech Stack
- Midnight network, Compact language, Node.js v22, Docker

## Prerequisites
- Node.js v22 or higher
- Docker (running and accessible to your user)
- Compact Compiler (`@midnight-ntwrk/compact-compiler`)

## Setup
1. Clone the repository: `git clone <your-repo-url> && cd afripass`
2. Install dependencies: `npm install`
3. Start the proof server: `npm run proof-server:start`
4. Compile the contract: `npm run compile`

## Run Tests
Run the test suite with the following command:
`npm run test`

## Initial Idea
[LEAVE PLACEHOLDER — I will fill this in manually]

## Screenshots
[LEAVE PLACEHOLDER — I will add compile output and contract address screenshots]
