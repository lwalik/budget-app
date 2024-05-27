import { ExistingProvider } from '@angular/core';
import { WalletsState } from '../states/wallets.state';
import { DECREASE_WALLET_BALANCE } from '../tokens/decrease-wallet-balance';

export const decreaseWalletBalanceProvider = (): ExistingProvider => ({
  provide: DECREASE_WALLET_BALANCE,
  useExisting: WalletsState,
});
