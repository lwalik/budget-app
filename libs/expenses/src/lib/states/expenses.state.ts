import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  compareDatesWithoutTime,
  DashboardFiltersState,
  DashboardFiltersStateModel,
  getDayWithMonthAsString,
  isAfterDate,
  isBeforeDate,
  TransactionSummaryViewModel,
  WALLET_BALANCE,
  WalletBalance,
} from '@budget-app/shared';
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
import { SORT_DIRECTION } from '../enums/sort-direction.enum';
import { SORT_TYPE } from '../enums/sort-type.enum';
import { ExpenseModel } from '../models/expense.model';
import { ExpensesStateModel } from '../models/expenses-state.model';
import { SortModel } from '../models/sort.model';
import { ExpensesService } from '../services/expenses.service';
import { SortListViewModel } from '../view-models/sort-list.view-model';
import { ExpensesDataViewModel } from '../view-models/expenses-data.view-model';

const initialState: ExpensesStateModel = {
  expenses: [],
};

@Injectable({ providedIn: 'root' })
export class ExpensesState {
  private readonly _isInitializedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isInitialized$: Observable<boolean> =
    this._isInitializedSubject.asObservable();

  private readonly _expensesStateSubject: BehaviorSubject<ExpensesStateModel> =
    new BehaviorSubject<ExpensesStateModel>(initialState);
  private readonly _expensesState$: Observable<ExpensesStateModel> =
    this._expensesStateSubject.asObservable();

  private readonly _sortStateSubject: BehaviorSubject<SortModel> =
    new BehaviorSubject<SortModel>({
      sortBy: SORT_TYPE.CREATED_AT,
      direction: SORT_DIRECTION.ASC,
    });
  private readonly _sortState$: Observable<SortModel> =
    this._sortStateSubject.asObservable();

  constructor(
    private readonly _expensesService: ExpensesService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    @Inject(WALLET_BALANCE)
    private readonly _walletBalance: WalletBalance,
    private readonly dashboardFiltersState: DashboardFiltersState
  ) {}

  loadExpenses(): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.getAll(userId).pipe(
          tap((expenses: ExpenseModel[]) =>
            this._expensesStateSubject.next({
              ...state,
              expenses,
            })
          ),
          tap(() => this._isInitializedSubject.next(true)),
          map(() => void 0)
        )
      )
    );
  }

  getExpenses(): Observable<ExpenseModel[]> {
    return combineLatest([this._expensesState$, this._sortState$]).pipe(
      map(([state, sort]: [ExpensesStateModel, SortModel]) =>
        this._sortExpenses(sort, state.expenses)
      )
    );
  }

  addExpense(
    expense: Omit<ExpenseModel, 'id' | 'ownerId' | 'createdAt' | 'expenseId'>
  ): Observable<void> {
    // TODO Obsłużyć ręczny wybór daty
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.add(expense, userId).pipe(
          tap((newExpense: ExpenseModel) =>
            this._expensesStateSubject.next({
              ...state,
              expenses: [...state.expenses, newExpense],
            })
          )
        )
      ),
      switchMap(() =>
        this._walletBalance.decreaseWalletBalance(
          expense.walletId,
          expense.totalPrice
        )
      ),
      map(() => void 0)
    );
  }

  updateExpense(updatedExpense: ExpenseModel): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.update(updatedExpense, userId).pipe(
          take(1),
          tap(() =>
            this._expensesStateSubject.next({
              ...state,
              expenses: state.expenses.map((expense: ExpenseModel) =>
                expense.expenseId === updatedExpense.expenseId
                  ? updatedExpense
                  : expense
              ),
            })
          ),
          switchMap(() =>
            this._updateWalletBalance(state.expenses, updatedExpense)
          )
        )
      )
    );
  }

  deleteExpense(expenseId: string): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.delete(expenseId, userId).pipe(
          tap(() =>
            this._expensesStateSubject.next({
              ...state,
              expenses: state.expenses.filter(
                (expense: ExpenseModel) => expense.expenseId !== expenseId
              ),
            })
          )
        )
      )
    );
  }

  deleteAllWalletExpenses(walletId: string): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._expensesState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ExpensesStateModel]) =>
        this._expensesService.deleteAllByWalletId(userId, walletId).pipe(
          tap(() =>
            this._expensesStateSubject.next({
              ...state,
              expenses: state.expenses.filter(
                (expense: ExpenseModel) => expense.walletId !== walletId
              ),
            })
          )
        )
      )
    );
  }

  revertWalletBalance(expense: ExpenseModel): Observable<void> {
    return this._walletBalance.increaseWalletBalance(
      expense.walletId,
      expense.totalPrice
    );
  }

  getSortList(): Observable<SortListViewModel> {
    return this._sortState$.pipe(
      map((sort: SortModel) => ({
        items: Object.values(SORT_TYPE),
        selectedItem: sort.sortBy,
        selectedDirection: sort.direction,
      }))
    );
  }

  updateSortBy(sortBy: SORT_TYPE): Observable<void> {
    return this._sortState$.pipe(
      take(1),
      tap((state: SortModel) =>
        this._sortStateSubject.next({
          ...state,
          sortBy,
        })
      ),
      map(() => void 0)
    );
  }

  updateSortDirection(): Observable<void> {
    return this._sortState$.pipe(
      take(1),
      tap((state: SortModel) =>
        this._sortStateSubject.next({
          ...state,
          direction:
            state.direction === SORT_DIRECTION.ASC
              ? SORT_DIRECTION.DESC
              : SORT_DIRECTION.ASC,
        })
      ),
      map(() => void 0)
    );
  }

  getExpenseSummary(): Observable<TransactionSummaryViewModel> {
    return combineLatest([
      this._expensesState$,
      this.dashboardFiltersState.getFilters(),
    ]).pipe(
      map(
        ([state, filters]: [
          ExpensesStateModel,
          DashboardFiltersStateModel
        ]) => {
          const dateDiff: number =
            filters.endDate.getTime() - filters.startDate.getTime();
          const prevStartDate: Date = new Date(
            filters.startDate.getTime() - dateDiff
          );
          const prevEndDate: Date = new Date(
            filters.startDate.getTime() - 24 * 60 * 60 * 1000
          );

          const { total, prevTotal } = state.expenses.reduce(
            (
              acc: { total: number; prevTotal: number },
              expense: ExpenseModel
            ) => {
              if (
                !compareDatesWithoutTime(
                  expense.createdAt,
                  filters.startDate,
                  isBeforeDate
                ) &&
                !compareDatesWithoutTime(
                  expense.createdAt,
                  filters.endDate,
                  isAfterDate
                ) &&
                (!filters.wallet.id || expense.walletId === filters.wallet.id)
              ) {
                acc.total += expense.totalPrice;
              }

              if (
                !compareDatesWithoutTime(
                  expense.createdAt,
                  prevStartDate,
                  isBeforeDate
                ) &&
                !compareDatesWithoutTime(
                  expense.createdAt,
                  prevEndDate,
                  isAfterDate
                ) &&
                (!filters.wallet.id || expense.walletId === filters.wallet.id)
              ) {
                acc.prevTotal += expense.totalPrice;
              }

              return acc;
            },
            { total: 0, prevTotal: 0 }
          );

          return {
            total,
            currency: 'PLN',
            diffSinceLastRange: total - prevTotal,
            diffDaysCount: dateDiff / (1000 * 60 * 60 * 24),
          };
        }
      )
    );
  }

  getExpensesData(): Observable<ExpensesDataViewModel> {
    return combineLatest([
      this._expensesState$,
      this.dashboardFiltersState.getFilters(),
      this.dashboardFiltersState.createEmptyDateRangeObject(),
    ]).pipe(
      map(
        ([state, filters, datesObject]: [
          ExpensesStateModel,
          DashboardFiltersStateModel,
          Record<string, number>
        ]) => {
          const monthlyExpensesMap: Record<string, number> =
            state.expenses.reduce(
              (acc: Record<string, number>, expense: ExpenseModel) => {
                if (
                  compareDatesWithoutTime(
                    expense.createdAt,
                    filters.startDate,
                    isBeforeDate
                  ) ||
                  compareDatesWithoutTime(
                    expense.createdAt,
                    filters.endDate,
                    isAfterDate
                  ) ||
                  (filters.wallet.id && expense.walletId !== filters.wallet.id)
                ) {
                  return acc;
                }

                const dayWithMonth = getDayWithMonthAsString(expense.createdAt);

                if (!acc[dayWithMonth]) {
                  acc[dayWithMonth] = 0;
                }

                acc[dayWithMonth] += expense.totalPrice;

                return acc;
              },
              datesObject
            );

          return {
            expenses: Object.values(monthlyExpensesMap),
            dates: Object.keys(monthlyExpensesMap),
          };
        }
      )
    );
  }

  private _updateWalletBalance(
    allExpenses: ExpenseModel[],
    updatedExpense: ExpenseModel
  ): Observable<void> {
    const prevExpenseState: ExpenseModel | undefined = allExpenses.find(
      (expense: ExpenseModel) => expense.expenseId === updatedExpense.expenseId
    );
    if (!prevExpenseState) {
      return of(void 0);
    }

    const diff: number =
      prevExpenseState.totalPrice - updatedExpense.totalPrice;

    if (diff === 0 && prevExpenseState.walletId === updatedExpense.walletId) {
      return of(void 0);
    }

    if (prevExpenseState.walletId === updatedExpense.walletId) {
      return diff > 0
        ? this._walletBalance.increaseWalletBalance(
            updatedExpense.walletId,
            diff
          )
        : this._walletBalance.decreaseWalletBalance(
            updatedExpense.walletId,
            diff
          );
    }

    return this._walletBalance
      .increaseWalletBalance(
        prevExpenseState.walletId,
        prevExpenseState.totalPrice
      )
      .pipe(
        take(1),
        switchMap(() =>
          this._walletBalance.decreaseWalletBalance(
            updatedExpense.walletId,
            updatedExpense.totalPrice
          )
        ),
        map(() => void 0)
      );
  }

  private _sortExpenses(
    sort: SortModel,
    expenses: ExpenseModel[]
  ): ExpenseModel[] {
    if (sort.sortBy === SORT_TYPE.TOTAL_PRICE) {
      return expenses.sort((a, b) =>
        sort.direction === SORT_DIRECTION.ASC
          ? a.totalPrice - b.totalPrice
          : b.totalPrice - a.totalPrice
      );
    }

    if (sort.sortBy === SORT_TYPE.PRODUCTS_COUNT) {
      return expenses.sort((a, b) =>
        sort.direction === SORT_DIRECTION.ASC
          ? a.products.length - b.products.length
          : b.products.length - a.products.length
      );
    }

    return expenses.sort((a, b) =>
      sort.direction === SORT_DIRECTION.ASC
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}
