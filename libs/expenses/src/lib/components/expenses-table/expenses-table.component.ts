import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  GET_TRANSLATION,
  GetTranslation,
  NotificationsService,
  PaginationComponent,
  PaginationUiService,
  PaginationViewModel,
  SimpleSelectListComponent,
  TranslationPipe,
  TwoOptionConfirmationModalComponent,
  TwoOptionConfirmationViewModel,
  WalletSelectListItemViewModel,
} from '@budget-app/shared';
import {
  WalletNameComponent,
  WalletSelectListComponent,
} from '@budget-app/wallets';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ExpenseModel } from '../../models/expense.model';
import { ExpensesState } from '../../states/expenses.state';
import { ExpenseFormModalComponent } from '../expense-form-modal/expense-form-modal.component';
import { ExpensesSortComponent } from '../expenses-sort/expenses-sort.component';

interface WalletFilterViewModel {
  readonly id: string | undefined;
  readonly name: string;
}

@Component({
  selector: 'lib-expenses-table',
  standalone: true,
  imports: [
    CommonModule,
    WalletNameComponent,
    ExpensesSortComponent,
    PaginationComponent,
    SimpleSelectListComponent,
    TranslationPipe,
    WalletSelectListComponent,
  ],
  templateUrl: './expenses-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesTableComponent {
  private readonly _pagination$: Observable<PaginationViewModel> =
    this._paginationUiService.getPagination();

  private readonly _walletFilerSubject: BehaviorSubject<WalletFilterViewModel> =
    new BehaviorSubject<WalletFilterViewModel>({ id: undefined, name: 'All' });
  readonly walletFilter$: Observable<WalletFilterViewModel> =
    this._walletFilerSubject.asObservable().pipe(shareReplay(1));

  readonly allExpenses$: Observable<ExpenseModel[]> = this._expensesState
    .getExpenses()
    .pipe(shareReplay(1));
  readonly expenses$: Observable<ExpenseModel[]> = combineLatest([
    this._pagination$,
    this.allExpenses$,
    this.walletFilter$,
  ]).pipe(
    map(
      ([pagination, expenses, walletFilter]: [
        PaginationViewModel,
        ExpenseModel[],
        WalletFilterViewModel
      ]) => {
        const start: number =
          pagination.current === 1
            ? 0
            : pagination.limit * (pagination.current - 1);
        const end: number = pagination.current * pagination.limit;
        const filteredExpenses: ExpenseModel[] = !!walletFilter.id
          ? expenses.filter((e) => e.walletId === walletFilter.id)
          : expenses;
        return filteredExpenses.slice(start, end);
      }
    )
  );

  constructor(
    private readonly _expensesState: ExpensesState,
    private readonly _dialog: Dialog,
    private readonly _paginationUiService: PaginationUiService,
    @Inject(GET_TRANSLATION) private readonly _getTranslation: GetTranslation,
    private readonly _notificationsService: NotificationsService
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
    const createdAt = `${expense.createdAt
      .getDate()
      .toString()
      .padStart(2, '0')}/${(expense.createdAt.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${expense.createdAt.getFullYear()}`;
    this._getTranslation
      .getAllTranslations([
        'Are you sure you want to remove expense from',
        `${createdAt}`,
        '?',
      ])
      .pipe(
        take(1),
        map((translations: string[]) => {
          const dialogData: TwoOptionConfirmationViewModel = {
            header: 'Confirm',
            text: translations.join(' '),
            firstOptionText: 'Remove and Revert Balance',
            secondOptionText: 'Only Remove',
          };

          const dialogRef: DialogRef<number | undefined> = this._dialog.open<
            number | undefined
          >(TwoOptionConfirmationModalComponent, {
            hasBackdrop: true,
            data: dialogData,
          });

          return dialogRef;
        }),
        switchMap((dialogRef: DialogRef<number | undefined>) =>
          dialogRef.closed.pipe(
            take(1),
            switchMap((result: number | undefined) => {
              if (result === 0) {
                return of(void 0);
              }
              return this._expensesState.deleteExpense(expense.expenseId).pipe(
                take(1),
                tap(() =>
                  this._notificationsService.openSuccessNotification(
                    'The expense has been removed'
                  )
                ),
                switchMap(() =>
                  result === 1
                    ? this._expensesState.revertWalletBalance(expense)
                    : of(void 0)
                )
              );
            })
          )
        )
      )
      .subscribe();
  }

  onWalletSelected(event: WalletSelectListItemViewModel): void {
    this._walletFilerSubject.next({
      id: event.id,
      name: event.name,
    });
  }
}
