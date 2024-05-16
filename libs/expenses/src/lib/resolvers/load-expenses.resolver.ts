import { ResolveFn } from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { ExpensesState } from '../states/expenses.state';
import { inject } from '@angular/core';

export const LoadExpensesResolver: ResolveFn<void> = (): Observable<void> => {
  const expensesState: ExpensesState = inject(ExpensesState);

  return expensesState.isInitialized$.pipe(
    take(1),
    switchMap((isInitialized: boolean) =>
      isInitialized ? of(void 0) : expensesState.loadExpenses()
    )
  );
};
