import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import { WALLET_BALANCE, WalletBalance } from '@budget-app/wallets';
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
import { SORT_DIRECTION } from '../enums/sort-direction.enum';
import { SORT_TYPE } from '../enums/sort-type.enum';
import { ExpenseModel } from '../models/expense.model';
import { ExpensesStateModel } from '../models/expenses-state.model';
import { SortModel } from '../models/sort.model';
import { ExpensesService } from '../services/expenses.service';

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
    private readonly _walletBalance: WalletBalance
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

  revertWalletBalance(expense: ExpenseModel): Observable<void> {
    return this._walletBalance.increaseWalletBalance(
      expense.walletId,
      expense.totalPrice
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
