import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { WalletModel } from '../models/wallet.model';

@Injectable({ providedIn: 'root' })
export class WalletsService {
  constructor(private readonly _client: AngularFirestore) {}

  getAllUserWallets(userId: string): Observable<WalletModel[]> {
    return this._client
      .collection<WalletModel>('wallets', (ref) =>
        ref.where('ownerId', '==', userId)
      )
      .valueChanges({ idField: 'id' });
  }
}
