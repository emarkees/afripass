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
  const zswapLocalState = emptyZswapLocalState();
  const constructorCtx = createConstructorContext(zswapLocalState);
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
    'increment_counter',
    dummyContractAddress(),
    zswapLocalState.coinPublicKey,
    state.data,
    privateState,
  );
}

// ───────────────────────────────────────────────────────────
// Test suite — Counter Contract
// ───────────────────────────────────────────────────────────
describe('Counter Contract', () => {
  // ── Test 1: Circuit logic — initial state is zero ──────
  it('should initialize the counter ledger state to zero', async () => {
    const { state } = await deployLocal();
    const ledgerState = ledger(state.data);
    expect(ledgerState.counter).toBe(0n);
  });

  // ── Test 2: State transitions — increment updates ledger ─
  it('should increment the counter after calling increment_counter', async () => {
    const { contract, state, privateState, zswapLocalState } =
      await deployLocal();

    // First increment (step = 5n — but contract always adds 1 to counter)
    const ctx1 = makeCircuitContext(state, privateState, zswapLocalState);
    const result1 = await contract.circuits.increment_counter(ctx1, 5n);

    // Update state from the circuit result
    state.data = new ChargedState(
      (result1.context.currentQueryContext ?? result1.context.callContext?.currentQueryContext).state.state,
    );
    expect(ledger(state.data).counter).toBe(1n);

    // Second increment — counter should be 2
    const ctx2 = makeCircuitContext(
      state,
      result1.context.currentPrivateState ?? result1.context.callContext?.currentPrivateState,
      result1.context.currentZswapLocalState ?? result1.context.callContext?.currentZswapLocalState,
    );
    const result2 = await contract.circuits.increment_counter(ctx2, 10n);

    state.data = new ChargedState(
      (result2.context.currentQueryContext ?? result2.context.callContext?.currentQueryContext).state.state,
    );
    expect(ledger(state.data).counter).toBe(2n);
  });

  // ── Test 3: Privacy — private inputs never exposed in results ─
  it('should not expose the private step value in the circuit results', async () => {
    const { contract, state, privateState, zswapLocalState } =
      await deployLocal();

    const stepValue = 42n;
    const ctx = makeCircuitContext(state, privateState, zswapLocalState);
    const result = await contract.circuits.increment_counter(ctx, stepValue);

    // Circuit returns an empty tuple — private witness is not in outputs
    expect(result.result).toEqual([]);

    // The counter changed (state transition happened), proving the
    // circuit ran, but the step value itself is not in the result.
    state.data = new ChargedState(
      (result.context.currentQueryContext ?? result.context.callContext?.currentQueryContext).state.state,
    );
    expect(ledger(state.data).counter).toBe(1n);

    // Private state is preserved and not leaked into public data
    expect(result.context.currentPrivateState ?? result.context.callContext?.currentPrivateState).toBeDefined();
  });

  // ── Test 4: Boundary — step must be within Uint<32> range ──
  it('should reject a step value exceeding Uint<32> range', async () => {
    const { contract, state, privateState, zswapLocalState } =
      await deployLocal();

    const ctx = makeCircuitContext(state, privateState, zswapLocalState);

    // Uint<32> max is 2^32 - 1 = 4294967295; passing 2^32 should throw
    await expect(
      contract.circuits.increment_counter(ctx, 2n ** 32n),
    ).rejects.toThrow();
  });

  // ── Test 5: Accumulation — multiple increments accumulate ─
  it('should accumulate counter value over multiple increments', async () => {
    const { contract, state, privateState, zswapLocalState } =
      await deployLocal();

    let currentPrivateState = privateState;
    let currentZswap = zswapLocalState;

    const NUM_INCREMENTS = 5;

    for (let i = 0; i < NUM_INCREMENTS; i++) {
      const ctx = makeCircuitContext(state, currentPrivateState, currentZswap);
      const result = await contract.circuits.increment_counter(
        ctx,
        BigInt(i + 1),
      );
      state.data = new ChargedState(
        (result.context.currentQueryContext ?? result.context.callContext?.currentQueryContext).state.state,
      );
      currentPrivateState = result.context.currentPrivateState ?? result.context.callContext?.currentPrivateState;
      currentZswap = result.context.currentZswapLocalState ?? result.context.callContext?.currentZswapLocalState;
    }

    const finalLedger = ledger(state.data);
    expect(finalLedger.counter).toBe(BigInt(NUM_INCREMENTS));
  });
});
