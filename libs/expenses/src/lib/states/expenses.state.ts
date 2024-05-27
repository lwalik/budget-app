import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  DECREASE_WALLET_BALANCE,
  DecreaseWalletBalance,
} from '@budget-app/wallets';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ExpenseProductModel } from '../models/expense-product.model';
import { ExpenseModel } from '../models/expense.model';
import { ExpensesStateModel } from '../models/expenses-state.model';
import { ExpensesService } from '../services/expenses.service';
import { ExpenseViewModel } from '../view-models/expense.view-model';

const initialState: ExpensesStateModel = {
  expenses: [],
};

@Injectable({ providedIn: 'root' })
export class ExpensesState {
  private readonly _expensesStateSubject: BehaviorSubject<ExpensesStateModel> =
    new BehaviorSubject<ExpensesStateModel>(initialState);
  private readonly _expensesState$: Observable<ExpensesStateModel> =
    this._expensesStateSubject.asObservable();

  private readonly _isInitializedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isInitialized$: Observable<boolean> =
    this._isInitializedSubject.asObservable();

  constructor(
    private readonly _expensesService: ExpensesService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    @Inject(DECREASE_WALLET_BALANCE)
    private readonly _decreaseWalletBalance: DecreaseWalletBalance
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

  getExpenses(): Observable<ExpenseViewModel[]> {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) =>
        state.expenses.map((expense: ExpenseModel) => ({
          id: expense.id,
          walletId: expense.walletId,
          products: expense.products.map((product: ExpenseProductModel) => ({
            name: product.name,
            quantity: product.quantity,
            totalPrice: product.quantity * product.price,
            priority: product.priority,
          })),
          totalPrice: expense.totalPrice,
          currency: expense.currency,
          createdAt: expense.createdAt,
        }))
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
        this._decreaseWalletBalance.decreaseWalletBalance(
          expense.walletId,
          expense.totalPrice
        )
      ),
      map(() => void 0)
    );
  }
}
