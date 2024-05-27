import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { WALLET_BALANCE_OPERATION_TYPE } from '../enums/wallet-balance-operation-type.enum';
import { WalletStateModel } from '../models/wallet-state.model';
import { CreateWalletModel, WalletModel } from '../models/wallet.model';
import { WalletsService } from '../services/wallets.service';
import { WalletBalance } from '../tokens/wallet-balance';

const initialState: WalletStateModel = {
  wallets: [],
};

@Injectable({ providedIn: 'root' })
export class WalletsState implements WalletBalance {
  private readonly _walletsStateSubject: BehaviorSubject<WalletStateModel> =
    new BehaviorSubject<WalletStateModel>(initialState);
  private readonly _walletsState$: Observable<WalletStateModel> =
    this._walletsStateSubject.asObservable();

  private readonly _isInitializedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isInitialized$: Observable<boolean> =
    this._isInitializedSubject.asObservable();

  constructor(
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    private readonly _walletsService: WalletsService
  ) {}

  loadWallets(): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._walletsState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, WalletStateModel]) =>
        this._walletsService.getAllUserWallets(userId).pipe(
          tap((wallets: WalletModel[]) =>
            this._walletsStateSubject.next({
              ...state,
              wallets,
            })
          )
        )
      ),
      tap(() => this._isInitializedSubject.next(true)),
      map(() => void 0)
    );
  }

  getAllWallets(): Observable<WalletModel[]> {
    return this._walletsState$.pipe(
      map((state: WalletStateModel) => state.wallets)
    );
  }

  create(wallet: CreateWalletModel): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._walletsState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, WalletStateModel]) => {
        const createdAt: Date = new Date();
        const newWallet: Omit<WalletModel, 'id'> = {
          ...wallet,
          ownerId: userId,
          createdAt,
          updatedAt: createdAt,
        };
        return this._walletsService.create(newWallet).pipe(
          tap((createdWallet: WalletModel) =>
            this._walletsStateSubject.next({
              ...state,
              wallets: [...state.wallets, createdWallet],
            })
          )
        );
      }),
      map(() => void 0)
    );
  }

  getWalletName(walletId: string): Observable<string | undefined> {
    return this._walletsState$.pipe(
      map(
        (state: WalletStateModel) =>
          state.wallets.find((wallet: WalletModel) => wallet.id === walletId)
            ?.name
      )
    );
  }

  increaseWalletBalance(walletId: string, value: number): Observable<void> {
    return this._updateWalletBalance(
      walletId,
      value,
      WALLET_BALANCE_OPERATION_TYPE.INCREASE
    );
  }

  decreaseWalletBalance(walletId: string, value: number): Observable<void> {
    return this._updateWalletBalance(
      walletId,
      value,
      WALLET_BALANCE_OPERATION_TYPE.DECREASE
    );
  }

  private _updateWalletBalance(
    walletId: string,
    value: number,
    operation: WALLET_BALANCE_OPERATION_TYPE
  ): Observable<void> {
    return this._walletsState$.pipe(
      take(1),
      switchMap((state: WalletStateModel) => {
        const selectedWallet: WalletModel | undefined = state.wallets.find(
          (wallet: WalletModel) => wallet.id === walletId
        );

        if (!selectedWallet) {
          return of(void 0);
        }

        const newBalance: number =
          operation === WALLET_BALANCE_OPERATION_TYPE.INCREASE
            ? selectedWallet.balance + value
            : selectedWallet.balance - value;

        return this._walletsService.updateBalance(walletId, newBalance).pipe(
          tap(() =>
            this._walletsStateSubject.next({
              ...state,
              wallets: state.wallets.map((wallet: WalletModel) =>
                wallet.id === walletId
                  ? { ...wallet, balance: newBalance }
                  : wallet
              ),
            })
          )
        );
      })
    );
  }
}
