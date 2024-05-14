import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { WalletModel } from '../models/wallet.model';
import { WalletResponse } from '../responses/wallet.response';
import { mapPromiseToVoidObservable } from '@budget-app/shared';

@Injectable({ providedIn: 'root' })
export class WalletsService {
  private readonly _baseUrl: string = 'wallets';
  constructor(private readonly _client: AngularFirestore) {}

  getAllUserWallets(userId: string): Observable<WalletModel[]> {
    return this._client
      .collection<WalletResponse>(this._baseUrl, (ref) =>
        ref.where('ownerId', '==', userId).orderBy('createdAt', 'asc')
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map((wallets: WalletResponse[]) =>
          wallets.map((wallet: WalletResponse) => ({
            ...wallet,
            createdAt: wallet.createdAt.toDate(),
            updatedAt: wallet.updatedAt.toDate(),
          }))
        )
      );
  }

  create(wallet: Omit<WalletModel, 'id'>): Observable<void> {
    const id: string = this._client.createId();
    return mapPromiseToVoidObservable(
      this._client.doc(`${this._baseUrl}/` + id).set(wallet)
    );
  }

  updateBalance(walletId: string, newBalance: number): Observable<void> {
    return mapPromiseToVoidObservable(
      this._client
        .doc(`${this._baseUrl}/` + walletId)
        .update({ balance: newBalance, updatedAt: new Date() })
    );
  }
}
