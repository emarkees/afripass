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
function deployLocal() {
  const contract = new Contract({});
  const coinPk = dummyContractAddress();
  const zswapLocalState = emptyZswapLocalState(coinPk);
  const constructorCtx = createConstructorContext({}, coinPk);
  const initResult = contract.initialState(constructorCtx);

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
  it('should initialize the total_verified ledger state to zero', () => {
    const { state } = deployLocal();
    const ledgerState = ledger(state.data);
    expect(ledgerState.total_verified).toBe(0n);
  });

  // ── Test 2: State transitions — successful eligibility verification ─
  it('should increment total_verified after calling verify_eligibility with sufficient income', () => {
    let { contract, state, privateState, zswapLocalState } =
      deployLocal();

    const ctx1 = makeCircuitContext(state, privateState, zswapLocalState);
    const pubkey = new Uint8Array(32); // mock public key

    // First verification (income = 400000n, which is >= 350000n)
    const result1 = contract.circuits.verify_eligibility(ctx1, pubkey, 400000n);

    // Update state from the circuit result
    const queryCtx1 = result1.context.currentQueryContext ?? (result1.context as any).callContext?.currentQueryContext;
    state.data = queryCtx1.state;
    expect(ledger(state.data).total_verified).toBe(1n);
  });

  // ── Test 3: Rejection — insufficient income ─
  it('should reject verification if income is below minimum', () => {
    let { contract, state, privateState, zswapLocalState } =
      deployLocal();

    const ctx = makeCircuitContext(state, privateState, zswapLocalState);
    const pubkey = new Uint8Array(32);

    // Income is below 350000 — circuit throws synchronously
    expect(() => contract.circuits.verify_eligibility(ctx, pubkey, 300000n)).toThrow(
      'Income does not meet the minimum eligibility requirement'
    );
  });

  // ── Test 4: Multiple verifications increment counter correctly ─
  it('should increment total_verified for each successful verification', () => {
    let { contract, state, privateState, zswapLocalState } =
      deployLocal();

    const pubkey1 = new Uint8Array(32);
    pubkey1[0] = 1;
    const pubkey2 = new Uint8Array(32);
    pubkey2[0] = 2;

    // First verification
    let ctx = makeCircuitContext(state, privateState, zswapLocalState);
    const result1 = contract.circuits.verify_eligibility(ctx, pubkey1, 350000n);

    // Update state for next call
    const queryCtx1 = result1.context.currentQueryContext ?? (result1.context as any).callContext?.currentQueryContext;
    state.data = queryCtx1.state;
    privateState = result1.context.currentPrivateState ?? (result1.context as any).callContext?.currentPrivateState;
    zswapLocalState = result1.context.currentZswapLocalState ?? (result1.context as any).callContext?.currentZswapLocalState;
    expect(ledger(state.data).total_verified).toBe(1n);

    // Second verification with different pubkey
    ctx = makeCircuitContext(state, privateState, zswapLocalState);
    const result2 = contract.circuits.verify_eligibility(ctx, pubkey2, 500000n);

    const queryCtx2 = result2.context.currentQueryContext ?? (result2.context as any).callContext?.currentQueryContext;
    state.data = queryCtx2.state;
    expect(ledger(state.data).total_verified).toBe(2n);
  });
});

