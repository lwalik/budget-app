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
import { Dialog } from '@angular/cdk/dialog';
import { ExpenseFormModalComponent } from '../expense-form-modal/expense-form-modal.component';

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

  constructor(
    private readonly _expensesState: ExpensesState,
    private readonly _dialog: Dialog
  ) {}

  onAddExpenseBtnClicked(): void {
    this._dialog.open(ExpenseFormModalComponent, {
      hasBackdrop: true,
      data: {
        isEdit: false,
      },
    });
  }
}
