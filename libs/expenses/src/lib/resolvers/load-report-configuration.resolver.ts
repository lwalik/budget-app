import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { ExpensesState } from '../states/expenses.state';
import { inject } from '@angular/core';

export const LoadReportConfigurationResolver: ResolveFn<
  void
> = (): Observable<void> => {
  const expensesState: ExpensesState = inject(ExpensesState);

  return expensesState.loadReportConfigurationFromStorage();
};
