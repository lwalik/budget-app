import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { WalletModel } from '../models/wallet.model';
import { WalletResponse } from '../responses/wallet.response';
import { mapPromiseToVoidObservable } from '@budget-app/shared';

@Injectable({ providedIn: 'root' })
export class WalletsService {
  constructor(private readonly _client: AngularFirestore) {}

  getAllUserWallets(userId: string): Observable<WalletModel[]> {
    return this._client
      .collection<WalletResponse>('wallets', (ref) =>
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
      this._client.doc('wallets/' + id).set(wallet)
    );
  }

  updateBalance(walletId: string, newBalance: number): Observable<void> {
    return mapPromiseToVoidObservable(
      this._client.doc('wallets/' + walletId).update({ balance: newBalance })
    );
  }
}
