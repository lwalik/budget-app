import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  PaginationComponent,
  PaginationViewModel,
  SimpleSelectListComponent,
  TwoOptionConfirmationModalComponent,
  TwoOptionConfirmationViewModel,
} from '@budget-app/shared';
import { WalletNameComponent } from '@budget-app/wallets';
import {
  combineLatest,
  map,
  Observable,
  of,
  ReplaySubject,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { ExpenseModel } from '../../models/expense.model';
import { ExpensesState } from '../../states/expenses.state';
import { ExpenseFormModalComponent } from '../expense-form-modal/expense-form-modal.component';
import { ExpensesSortComponent } from '../expenses-sort/expenses-sort.component';

@Component({
  selector: 'lib-expenses-table',
  standalone: true,
  imports: [
    CommonModule,
    WalletNameComponent,
    ExpensesSortComponent,
    PaginationComponent,
    SimpleSelectListComponent,
  ],
  templateUrl: './expenses-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesTableComponent {
  readonly initialPaginationState: PaginationViewModel = {
    first: 1,
    last: 1,
    current: 1,
    limit: 5,
    totalItems: 1,
  };
  private readonly _paginationSubject: ReplaySubject<PaginationViewModel> =
    new ReplaySubject<PaginationViewModel>(1);
  private readonly _pagination$: Observable<PaginationViewModel> =
    this._paginationSubject
      .asObservable()
      .pipe(startWith(this.initialPaginationState));
  readonly allExpenses$: Observable<ExpenseModel[]> = this._expensesState
    .getExpenses()
    .pipe(shareReplay(1));
  readonly expenses$: Observable<ExpenseModel[]> = combineLatest([
    this._pagination$,
    this.allExpenses$,
  ]).pipe(
    map(([pagination, expenses]: [PaginationViewModel, ExpenseModel[]]) => {
      const start: number =
        pagination.current === 1
          ? 0
          : pagination.limit * (pagination.current - 1);
      const end: number = pagination.current * pagination.limit;
      return expenses.slice(start, end);
    })
  );

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

  onPaginationChanged(pagination: PaginationViewModel): void {
    this._paginationSubject.next(pagination);
  }
}
