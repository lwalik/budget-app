import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const DECREASE_WALLET_BALANCE: InjectionToken<DecreaseWalletBalance> =
  new InjectionToken<DecreaseWalletBalance>('DECREASE_WALLET_BALANCE');

export interface DecreaseWalletBalance {
  decreaseWalletBalance(walletId: string, value: number): Observable<void>;
}
