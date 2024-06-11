import { Inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ENV_CONFIG, EnvConfig } from '@budget-app/core';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { Timestamp } from 'firebase/firestore';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { WalletDepositModel } from '../models/wallet-deposit.model';
import { WalletModel } from '../models/wallet.model';
import {
  WalletDepositResponse,
  WalletResponse,
} from '../responses/wallet.response';

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
            deposits: wallet.deposits.map((deposit: WalletDepositResponse) => ({
              ...deposit,
              createdAt: deposit.createdAt.toDate(),
            })),
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

  delete(walletId: string): Observable<void> {
    return mapPromiseToVoidObservable(
      this._client.doc(`${this._envConfig.walletsUrl}/` + walletId).delete()
    );
  }

  updateBalance(
    walletId: string,
    newBalance: number,
    deposit?: WalletDepositModel
  ): Observable<void> {
    const doc: AngularFirestoreDocument<WalletResponse> = this._client.doc(
      `${this._envConfig.walletsUrl}/` + walletId
    );

    return doc.valueChanges({ idFields: 'id' }).pipe(
      take(1),
      switchMap((data: WalletResponse | undefined) => {
        if (!data) {
          return of(void 0);
        }

        return mapPromiseToVoidObservable(
          doc.update({
            balance: newBalance,
            updatedAt: Timestamp.fromDate(new Date()),
            deposits: !!deposit
              ? [
                  ...data.deposits,
                  {
                    ...deposit,
                    createdAt: Timestamp.fromDate(deposit.createdAt),
                  },
                ]
              : data.deposits,
          })
        );
      })
    );
  }
}
