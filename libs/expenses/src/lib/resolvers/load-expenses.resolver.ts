import { ResolveFn } from '@angular/router';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { ExpensesState } from '../states/expenses.state';
import { inject } from '@angular/core';

export const LoadExpensesResolver: ResolveFn<void> = (): Observable<void> => {
  const expensesState: ExpensesState = inject(ExpensesState);

  return expensesState.loadExpenses();
};
