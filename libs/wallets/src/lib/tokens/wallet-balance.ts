import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const WALLET_BALANCE: InjectionToken<WalletBalance> =
  new InjectionToken<WalletBalance>('WALLET_BALANCE');

export interface WalletBalance {
  decreaseWalletBalance(walletId: string, value: number): Observable<void>;
  increaseWalletBalance(walletId: string, value: number): Observable<void>;
}
