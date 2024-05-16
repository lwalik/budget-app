import { WalletStateModel } from '../models/wallet-state.model';
import { Inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import { WalletsService } from '../services/wallets.service';
import { WalletModel } from '../models/wallet.model';

const initialState: WalletStateModel = {
  wallets: [],
};

@Injectable({ providedIn: 'root' })
export class WalletsState {
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

  getWalletName(walletId: string): Observable<string | undefined> {
    return this._walletsState$.pipe(
      map(
        (state: WalletStateModel) =>
          state.wallets.find((wallet: WalletModel) => wallet.id === walletId)
            ?.name
      )
    );
  }

  // TODO handle others method from walletService
}
