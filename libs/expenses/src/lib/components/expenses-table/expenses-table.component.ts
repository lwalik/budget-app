import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesState } from '../../states/expenses.state';
import { Observable } from 'rxjs';
import { ExpenseModel } from '../../models/expense.model';
import { WalletNameComponent } from '@budget-app/wallets';

@Component({
  selector: 'lib-expenses-table',
  standalone: true,
  imports: [CommonModule, WalletNameComponent],
  templateUrl: './expenses-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesTableComponent {
  readonly expenses$: Observable<ExpenseModel[]> =
    this._expensesState.getExpenses();

  constructor(private readonly _expensesState: ExpensesState) {}
}
