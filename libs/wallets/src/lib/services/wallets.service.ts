import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ENV_CONFIG, EnvConfig } from '@budget-app/core';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { Observable, map } from 'rxjs';
import { WalletModel } from '../models/wallet.model';
import { WalletResponse } from '../responses/wallet.response';

@Injectable({ providedIn: 'root' })
export class WalletsService {
  constructor(
    private readonly _client: AngularFirestore,
    @Inject(ENV_CONFIG) private _envConfig: EnvConfig
  ) {}

  getAllUserWallets(userId: string): Observable<WalletModel[]> {
    return this._client
      .collection<WalletResponse>(this._envConfig.walletsUrl, (ref) =>
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

  create(wallet: Omit<WalletModel, 'id'>): Observable<WalletModel> {
    const id: string = this._client.createId();
    const newWallet: WalletModel = { ...wallet, id };
    return mapPromiseToVoidObservable(
      this._client.doc(`${this._envConfig.walletsUrl}/` + id).set(newWallet)
    ).pipe(map(() => newWallet));
  }

  updateBalance(walletId: string, newBalance: number): Observable<void> {
    return mapPromiseToVoidObservable(
      this._client
        .doc(`${this._envConfig.walletsUrl}/` + walletId)
        .update({ balance: newBalance, updatedAt: new Date() })
    );
  }
}
