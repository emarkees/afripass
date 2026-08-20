import { createWallet } from '../src/wallet.js';
import { resolveNetwork, getOrCreateWallet } from '../src/network.js';

async function main() {
  const { network, config: networkConfig } = resolveNetwork({ argv: ['', '', '--network', 'preview'] });
  const WALLET = getOrCreateWallet(network);
  const walletCtx = await createWallet({ network, networkConfig, seed: WALLET.seed });
  console.log('coinPublicKey:', walletCtx.shieldedSecretKeys.coinPublicKey);
  console.log('encryptionPublicKey:', walletCtx.shieldedSecretKeys.encryptionPublicKey);
  console.log('unshieldedKeystore:', walletCtx.unshieldedKeystore.getPublicKey());
  await walletCtx.wallet.stop();
}

main().catch(console.error);
