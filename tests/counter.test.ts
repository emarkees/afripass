import { describe, it, expect } from 'vitest';
import {
  Contract,
  ledger,
} from '../managed/counter/contract/index.js';
import {
  createConstructorContext,
  emptyZswapLocalState,
  dummyContractAddress,
  createCircuitContext,
  ChargedState,
} from '@midnight-ntwrk/compact-runtime';

/**
 * Helper: create a fresh contract instance and initialize its state.
 * Returns the contract, its initial state data, and associated contexts.
 */
async function deployLocal() {
  const contract = new Contract({});
  const coinPk = dummyContractAddress();
  const zswapLocalState = emptyZswapLocalState(coinPk);
  const constructorCtx = createConstructorContext({}, coinPk);
  const initResult = await contract.initialState(constructorCtx);

  return {
    contract,
    state: initResult.currentContractState,
    privateState: initResult.currentPrivateState,
    zswapLocalState: initResult.currentZswapLocalState,
  };
}

/**
 * Helper: build a CircuitContext for running increment_counter.
 */
function makeCircuitContext(
  state: any,
  privateState: any,
  zswapLocalState: any,
) {
  return createCircuitContext(
    dummyContractAddress(),
    zswapLocalState.coinPublicKey,
    state.data,
    privateState,
  );
}

// ───────────────────────────────────────────────────────────
// Test suite — Counter Contract (AfriPass)
// ───────────────────────────────────────────────────────────
describe('AfriPass Financial Eligibility Contract', () => {
  // ── Test 1: Circuit logic — initial state is zero ──────
  it('should initialize the total_verified ledger state to zero', async () => {
    const { state } = await deployLocal();
    const ledgerState = ledger(state.data);
    expect(ledgerState.total_verified).toBe(0n);
  });

  // ── Test 2: State transitions — successful eligibility verification ─
  it('should increment total_verified after calling verify_eligibility with sufficient income', async () => {
    let { contract, state, privateState, zswapLocalState } =
      await deployLocal();

    const ctx1 = makeCircuitContext(state, privateState, zswapLocalState);
    const pubkey = new Uint8Array(32); // mock public key

    // First verification (income = 400000n, which is >= 350000n)
    const result1 = await contract.circuits.verify_eligibility(ctx1, pubkey, 400000n);

    // Update state from the circuit result
    const queryCtx1 = result1.context.currentQueryContext ?? (result1.context as any).callContext?.currentQueryContext;
    state.data = queryCtx1.state;
    expect(ledger(state.data).total_verified).toBe(1n);
  });

  // ── Test 3: Rejection — insufficient income ─
  it('should reject verification if income is below minimum', async () => {
    let { contract, state, privateState, zswapLocalState } =
      await deployLocal();

    const ctx = makeCircuitContext(state, privateState, zswapLocalState);
    const pubkey = new Uint8Array(32);

    // Income is below 350000
    await expect(contract.circuits.verify_eligibility(ctx, pubkey, 300000n)).rejects.toThrow();
  });

  // ── Test 4: Rejection — already verified ─
  it('should reject if the same user tries to verify twice', async () => {
    let { contract, state, privateState, zswapLocalState } =
      await deployLocal();

    const pubkey = new Uint8Array(32);
    pubkey[0] = 1;

    let ctx = makeCircuitContext(state, privateState, zswapLocalState);
    const result1 = await contract.circuits.verify_eligibility(ctx, pubkey, 350000n);
    
    // Update state for next call
    const queryCtx1 = result1.context.currentQueryContext ?? (result1.context as any).callContext?.currentQueryContext;
    state.data = queryCtx1.state;
    privateState = result1.context.currentPrivateState ?? (result1.context as any).callContext?.currentPrivateState;
    zswapLocalState = result1.context.currentZswapLocalState ?? (result1.context as any).callContext?.currentZswapLocalState;

    ctx = makeCircuitContext(state, privateState, zswapLocalState);

    // Second verification with same pubkey should fail
    await expect(contract.circuits.verify_eligibility(ctx, pubkey, 400000n)).rejects.toThrow();
  });
});

