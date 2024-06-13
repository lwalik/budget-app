import { ExistingProvider } from '@angular/core';
import { INCOMES_DATA } from '@budget-app/shared';
import { WalletsState } from '../states/wallets.state';

export const incomesDataProvider = (): ExistingProvider => ({
  provide: INCOMES_DATA,
  useExisting: WalletsState,
});
