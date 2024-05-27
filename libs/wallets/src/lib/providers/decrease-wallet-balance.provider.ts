import { ExistingProvider } from '@angular/core';
import { WalletsState } from '../states/wallets.state';
import { WALLET_BALANCE } from '../tokens/wallet-balance';

export const decreaseWalletBalanceProvider = (): ExistingProvider => ({
  provide: WALLET_BALANCE,
  useExisting: WalletsState,
});
