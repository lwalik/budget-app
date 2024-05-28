import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  TwoOptionConfirmationModalComponent,
  TwoOptionConfirmationViewModel,
} from '@budget-app/shared';
import { WalletNameComponent } from '@budget-app/wallets';
import { Observable, of, switchMap, take } from 'rxjs';
import { ExpenseModel } from '../../models/expense.model';
import { ExpensesState } from '../../states/expenses.state';
import { ExpenseFormModalComponent } from '../expense-form-modal/expense-form-modal.component';
import { ExpensesSortComponent } from '../expenses-sort/expenses-sort.component';

@Component({
  selector: 'lib-expenses-table',
  standalone: true,
  imports: [CommonModule, WalletNameComponent, ExpensesSortComponent],
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
    const dialogData: TwoOptionConfirmationViewModel = {
      header: 'Confirm',
      text: `Are you sure you want to remove expense from ${createdAt} ?`,
      firstOptionText: 'Remove and Revert Balance',
      secondOptionText: 'Only Remove',
    };
    const dialogRef: DialogRef<number | undefined> = this._dialog.open<
      number | undefined
    >(TwoOptionConfirmationModalComponent, {
      hasBackdrop: true,
      data: dialogData,
    });
    dialogRef.closed
      .pipe(
        take(1),
        switchMap((result: number | undefined) => {
          if (result === 0) {
            return of(void 0);
          }
          console.log('result: ', result);
          return this._expensesState.deleteExpense(expense.expenseId).pipe(
            take(1),
            switchMap(() =>
              result === 1
                ? this._expensesState.revertWalletBalance(expense)
                : of(void 0)
            )
          );
        })
      )
      .subscribe();
  }
}
