import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  ConfirmationModalComponent,
  ConfirmationModalViewModel,
} from '@budget-app/shared';
import { WalletNameComponent } from '@budget-app/wallets';
import { Observable, of, switchMap, take } from 'rxjs';
import { ExpenseModel } from '../../models/expense.model';
import { ExpensesState } from '../../states/expenses.state';
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
  readonly expenses$: Observable<ExpenseModel[]> =
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

  onEditExpenseBtnClicked(expense: ExpenseModel): void {
    this._dialog.open(ExpenseFormModalComponent, {
      hasBackdrop: true,
      data: {
        isEdit: true,
        expense,
      },
    });
  }

  onDeleteExpenseBtnClicked(expense: ExpenseModel): void {
    const createdAt = `${expense.createdAt.toDateString()}`;
    const dialogData: ConfirmationModalViewModel = {
      header: 'Confirm',
      text: `Are you sure you want to remove expense from ${createdAt} ?`,
    };
    const dialogRef: DialogRef<boolean | undefined> = this._dialog.open<
      boolean | undefined
    >(ConfirmationModalComponent, {
      hasBackdrop: true,
      data: dialogData,
    });
    dialogRef.closed
      .pipe(
        take(1),
        switchMap((isConfirmed: boolean | undefined) =>
          isConfirmed
            ? this._expensesState.deleteExpense(expense.expenseId)
            : of(void 0)
        )
      )
      .subscribe();
  }
}
