import { ExistingProvider } from '@angular/core';
import { WalletsState } from '../states/wallets.state';
import { WALLET_BALANCE } from '@budget-app/shared';

export const walletBalanceProvider = (): ExistingProvider => ({
  provide: WALLET_BALANCE,
  useExisting: WalletsState,
});
