import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
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
import {
  compareDatesWithoutTime,
  DashboardFiltersState,
  DashboardFiltersStateModel,
  getDayWithMonthAsString,
  IncomesData,
  IncomesDataViewModel,
  isAfterDate,
  isBeforeDate,
  TransactionSummaryViewModel,
  WalletBalance,
} from '@budget-app/shared';
import { CurrentBalanceViewModel } from '../view-models/current-balance.view-model';
import { DepositsSummaryViewModel } from '../view-models/deposits-summary.view-model';
import { MostPopularWalletViewModel } from '../view-models/most-popular-wallet.view-model';

const initialState: WalletStateModel = {
  wallets: [],
};

@Injectable({ providedIn: 'root' })
export class WalletsState implements WalletBalance, IncomesData {
  private readonly _walletsStateSubject: BehaviorSubject<WalletStateModel> =
    new BehaviorSubject<WalletStateModel>(initialState);
  private readonly _walletsState$: Observable<WalletStateModel> =
    this._walletsStateSubject.asObservable();

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

  getAvailableDepositSummary(): Observable<TransactionSummaryViewModel> {
    return combineLatest([
      this._walletsState$,
      this.dashboardFiltersState.getFilters(),
    ]).pipe(
      map(
        ([state, filters]: [WalletStateModel, DashboardFiltersStateModel]) => {
          const dateDiff: number =
            filters.toDate.getTime() - filters.fromDate.getTime();
          const prevFromDate: Date = new Date(
            filters.fromDate.getTime() - dateDiff
          );
          const prevToDate: Date = new Date(
            filters.fromDate.getTime() - 24 * 60 * 60 * 1000
          );

          const { total, prevTotal } = state.wallets.reduce(
            (
              acc: { total: number; prevTotal: number },
              wallet: WalletModel
            ) => {
              if (wallet.id !== filters.wallet.id && !!filters.wallet.id) {
                return acc;
              }

              const walletDepositTotals = wallet.deposits.reduce(
                (
                  depositAcc: { total: number; prevTotal: number },
                  deposit: WalletDepositModel
                ) => {
                  if (
                    !compareDatesWithoutTime(
                      deposit.createdAt,
                      filters.fromDate,
                      isBeforeDate
                    ) &&
                    !compareDatesWithoutTime(
                      deposit.createdAt,
                      filters.toDate,
                      isAfterDate
                    )
                  ) {
                    depositAcc.total += deposit.value;
                  }

                  if (
                    !compareDatesWithoutTime(
                      deposit.createdAt,
                      prevFromDate,
                      isBeforeDate
                    ) &&
                    !compareDatesWithoutTime(
                      deposit.createdAt,
                      prevToDate,
                      isAfterDate
                    )
                  ) {
                    depositAcc.prevTotal += deposit.value;
                  }

                  return depositAcc;
                },
                { total: 0, prevTotal: 0 }
              );

              acc.total += walletDepositTotals.total;
              acc.prevTotal += walletDepositTotals.prevTotal;

              return acc;
            },
            { total: 0, prevTotal: 0 }
          );

          return {
            total,
            currency: 'PLN',
            diffSinceLastRange: total - prevTotal,
            diffDaysCount: Math.round(dateDiff / (1000 * 60 * 60 * 24)),
          };
        }
      )
    );
  }

  getCurrentBalance(): Observable<CurrentBalanceViewModel> {
    return combineLatest([
      this._walletsState$,
      this.dashboardFiltersState.getFilters(),
    ]).pipe(
      map(
        ([state, filters]: [WalletStateModel, DashboardFiltersStateModel]) => {
          const total: number = state.wallets.reduce(
            (walletsTotal: number, wallet: WalletModel) => {
              if (wallet.id !== filters.wallet.id && !!filters.wallet.id) {
                return walletsTotal;
              }

              return walletsTotal + wallet.balance;
            },
            0
          );

          return {
            value: total,
            currency: 'PLN',
          };
        }
      )
    );
  }

  deposit(walletId: string, value: number, createdAt: Date): Observable<void> {
    // TODO Obsłużyć ręczny wybór daty
    return this._updateWalletBalance(
      walletId,
      value,
      WALLET_BALANCE_OPERATION_TYPE.DEPOSIT,
      createdAt
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

  getIncomesData(): Observable<IncomesDataViewModel> {
    return combineLatest([
      this._walletsState$,
      this.dashboardFiltersState.getFilters(),
      this.dashboardFiltersState.createEmptyDateRangeObject(),
    ]).pipe(
      map(
        ([state, filters, datesObject]: [
          WalletStateModel,
          DashboardFiltersStateModel,
          Record<string, number>
        ]) => {
          const monthlyIncomesMap: Record<string, number> = state.wallets
            .filter(
              (wallet: WalletModel) =>
                !filters.wallet.id || wallet.id === filters.wallet.id
            )
            .flatMap((wallet: WalletModel) => wallet.deposits)
            .reduce(
              (acc: Record<string, number>, deposit: WalletDepositModel) => {
                if (
                  compareDatesWithoutTime(
                    deposit.createdAt,
                    filters.fromDate,
                    isBeforeDate
                  ) ||
                  compareDatesWithoutTime(
                    deposit.createdAt,
                    filters.toDate,
                    isAfterDate
                  )
                ) {
                  return acc;
                }

                const dayWithMonth = getDayWithMonthAsString(deposit.createdAt);

                if (!acc[dayWithMonth]) {
                  acc[dayWithMonth] = 0;
                }
                acc[dayWithMonth] += deposit.value;

                return acc;
              },
              datesObject
            );

          return {
            incomes: Object.values(monthlyIncomesMap),
            dates: Object.keys(monthlyIncomesMap),
          };
        }
      )
    );
  }

  getDepositsSummary(): Observable<DepositsSummaryViewModel | null> {
    return this._walletsState$.pipe(
      map((state: WalletStateModel) => {
        if (state.wallets.length === 0) {
          return null;
        }

        const now: Date = new Date();
        const lastMonth: Date = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const twoMonthsAgo: Date = new Date(
          now.getFullYear(),
          now.getMonth() - 2,
          now.getDate()
        );

        const walletDepositsInCurrentMonthMap: Record<string, number> =
          this._getWalletDepositsAmountMapInRange(
            state.wallets,
            now,
            lastMonth
          );

        console.log(
          'walletDepositsInCurrentMonthMap: ',
          walletDepositsInCurrentMonthMap
        );

        const totalDepositsAmountInCurrentMonth: number = Object.values(
          walletDepositsInCurrentMonthMap
        ).reduce((total: number, cur: number) => total + cur, 0);

        const mostPopularWalletInCurrentMonth: MostPopularWalletViewModel =
          Object.entries(walletDepositsInCurrentMonthMap).reduce(
            (acc, [name, total]) => {
              if (total > acc.total) {
                return { name, total };
              }
              return acc;
            },
            { name: '', total: 0 }
          );

        const walletDepositsInLastMonthMap: Record<string, number> =
          this._getWalletDepositsAmountMapInRange(
            state.wallets,
            lastMonth,
            twoMonthsAgo
          );
        console.log(
          'walletDepositsInLastMonthMap: ',
          walletDepositsInLastMonthMap
        );

        const totalDepositsAmountInLastMonth: number = Object.values(
          walletDepositsInLastMonthMap
        ).reduce((total: number, cur: number) => total + cur, 0);

        return {
          total: totalDepositsAmountInCurrentMonth,
          mostPopularWallet: mostPopularWalletInCurrentMonth,
          lastMonthDiff:
            totalDepositsAmountInCurrentMonth - totalDepositsAmountInLastMonth,
        };
      })
    );
  }

  private _updateWalletBalance(
    walletId: string,
    value: number,
    operation: WALLET_BALANCE_OPERATION_TYPE,
    createdAt?: Date
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
                createdAt: createdAt || new Date(),
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

  private _getWalletDepositsAmountMapInRange(
    wallets: WalletModel[],
    startDate: Date,
    endDate: Date
  ): Record<string, number> {
    return wallets.reduce((acc: Record<string, number>, cur: WalletModel) => {
      const depositsAmount: number = cur.deposits.reduce(
        (total: number, cur: WalletDepositModel) => {
          if (cur.createdAt > endDate && cur.createdAt <= startDate) {
            return total + cur.value;
          }

          return total;
        },
        0
      );

      acc[cur.name] = depositsAmount;
      return acc;
    }, {});
  }
}
