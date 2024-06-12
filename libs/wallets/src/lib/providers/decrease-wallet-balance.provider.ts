import { ExistingProvider } from '@angular/core';
import { WalletsState } from '../states/wallets.state';
import { WALLET_BALANCE } from '@budget-app/shared';

export const decreaseWalletBalanceProvider = (): ExistingProvider => ({
  provide: WALLET_BALANCE,
  useExisting: WalletsState,
});
