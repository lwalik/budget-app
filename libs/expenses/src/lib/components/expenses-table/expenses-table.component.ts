import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { WalletNameComponent } from '@budget-app/wallets';
import { Observable } from 'rxjs';
import { ExpensesState } from '../../states/expenses.state';
import { ExpenseViewModel } from '../../view-models/expense.view-model';

@Component({
  selector: 'lib-expenses-table',
  standalone: true,
  imports: [CommonModule, WalletNameComponent],
  templateUrl: './expenses-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesTableComponent {
  readonly expenses$: Observable<ExpenseViewModel[]> =
    this._expensesState.getExpenses();

  constructor(private readonly _expensesState: ExpensesState) {}
}
