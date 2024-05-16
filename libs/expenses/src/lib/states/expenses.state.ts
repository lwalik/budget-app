import { ExpensesStateModel } from '../models/expenses-state.model';
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
import { ExpensesService } from '../services/expenses.service';
import { ExpenseModel } from '../models/expense.model';

const initialState: ExpensesStateModel = {
  expenses: [],
};

@Injectable({ providedIn: 'root' })
export class ExpensesState {
  private readonly _expensesStateSubject: BehaviorSubject<ExpensesStateModel> =
    new BehaviorSubject<ExpensesStateModel>(initialState);
  private readonly _expensesState$: Observable<ExpensesStateModel> =
    this._expensesStateSubject.asObservable();

  constructor(
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    private readonly _expensesService: ExpensesService
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
          map(() => void 0)
        )
      )
    );
  }

  getExpenses(): Observable<ExpenseModel[]> {
    return this._expensesState$.pipe(
      map((state: ExpensesStateModel) => state.expenses)
    );
  }
}
