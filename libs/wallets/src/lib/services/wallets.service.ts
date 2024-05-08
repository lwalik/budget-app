import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { WalletModel } from '../models/wallet.model';
import { WalletResponse } from '../responses/wallet.response';

@Injectable({ providedIn: 'root' })
export class WalletsService {
  constructor(private readonly _client: AngularFirestore) {}

  getAllUserWallets(userId: string): Observable<WalletModel[]> {
    return this._client
      .collection<WalletResponse>('wallets', (ref) =>
        ref.where('ownerId', '==', userId)
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

  create(userId: string): Observable<void> {
    return new Observable((observer) => {
      const id: string = this._client.createId();
      this._client
        .doc('wallets/' + id)
        .set({
          id,
          ownerId: userId,
          name: 'ING',
          balance: 600,
          currency: 'PLN',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .then(() => {
          observer.next(void 0);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
