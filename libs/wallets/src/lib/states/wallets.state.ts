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
import { WalletDepositModel } from '../models/wallet-deposit.model';
import { WalletStateModel } from '../models/wallet-state.model';
import { CreateWalletModel, WalletModel } from '../models/wallet.model';
import { WalletsService } from '../services/wallets.service';
import { WalletBalance } from '../tokens/wallet-balance';
import {
  DashboardFiltersState,
  DashboardFiltersStateModel,
  TransactionSummaryViewModel,
} from '@budget-app/shared';

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
    private readonly _walletsService: WalletsService,
    private readonly dashboardFiltersState: DashboardFiltersState
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

  createWallet(wallet: CreateWalletModel): Observable<void> {
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
          deposits: [
            {
              value: wallet.balance,
              createdAt: new Date(),
            },
          ],
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

  deleteWallet(walletId: string): Observable<void> {
    return this._walletsState$.pipe(
      take(1),
      switchMap((state: WalletStateModel) =>
        this._walletsService.delete(walletId).pipe(
          tap(() =>
            this._walletsStateSubject.next({
              ...state,
              wallets: state.wallets.filter(
                (wallet: WalletModel) => wallet.id !== walletId
              ),
            })
          )
        )
      )
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

  getDepositSummary(): Observable<TransactionSummaryViewModel> {
    return combineLatest([
      this._walletsState$,
      this.dashboardFiltersState.getFilters(),
    ]).pipe(
      map(
        ([state, filters]: [WalletStateModel, DashboardFiltersStateModel]) => {
          const total: number = state.wallets.reduce(
            (walletsTotal: number, wallet: WalletModel) => {
              if (wallet.id !== filters.walletId && !!filters.walletId) {
                return walletsTotal;
              }

              const walletDepositTotal: number = wallet.deposits.reduce(
                (depositsTotal: number, deposit: WalletDepositModel) => {
                  if (
                    deposit.createdAt >= filters.startDate &&
                    deposit.createdAt <= filters.endDate
                  ) {
                    return depositsTotal + deposit.value;
                  }

                  return depositsTotal;
                },
                0
              );

              return walletsTotal + walletDepositTotal;
            },
            0
          );

          return {
            total,
            currency: 'PLN',
            // TODO obsłużyć różnicę
            diffSinceLastRangeInPercentage: 0,
          };
        }
      )
    );
  }

  deposit(walletId: string, value: number): Observable<void> {
    // TODO Obsłużyć ręczny wybór daty
    return this._updateWalletBalance(
      walletId,
      value,
      WALLET_BALANCE_OPERATION_TYPE.DEPOSIT
    );
  }

  increaseWalletBalance(walletId: string, value: number): Observable<void> {
    return this._updateWalletBalance(
      walletId,
      value,
      WALLET_BALANCE_OPERATION_TYPE.RETURN
    );
  }

  decreaseWalletBalance(walletId: string, value: number): Observable<void> {
    return this._updateWalletBalance(
      walletId,
      value,
      WALLET_BALANCE_OPERATION_TYPE.EXPENSE
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

        const deposit: WalletDepositModel | undefined =
          operation === WALLET_BALANCE_OPERATION_TYPE.DEPOSIT
            ? {
                value,
                createdAt: new Date(),
              }
            : undefined;
        const newBalance: number =
          operation === WALLET_BALANCE_OPERATION_TYPE.RETURN || !!deposit
            ? selectedWallet.balance + value
            : selectedWallet.balance - value;

        return this._walletsService
          .updateBalance(walletId, newBalance, deposit)
          .pipe(
            tap(() =>
              this._walletsStateSubject.next({
                ...state,
                wallets: state.wallets.map((wallet: WalletModel) =>
                  wallet.id === walletId
                    ? {
                        ...wallet,
                        balance: newBalance,
                        deposits: !!deposit
                          ? [...wallet.deposits, deposit]
                          : wallet.deposits,
                      }
                    : wallet
                ),
              })
            )
          );
      })
    );
  }
}
