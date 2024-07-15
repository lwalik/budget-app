import { Directive, HostListener } from '@angular/core';
import { take } from 'rxjs';
import { ExpensesState } from '../states/expenses.state';

@Directive({ selector: '[libDeleteWalletExpenses]', standalone: true })
export class DeleteWalletExpensesDirective {
  constructor(private readonly _expensesState: ExpensesState) {}

  @HostListener('walletRemoved', ['$event'])
  DeleteWalletExpensesDirective(event: string): void {
    this._expensesState
      .deleteAllWalletExpenses(event)
      .pipe(take(1))
      .subscribe();
  }
}
