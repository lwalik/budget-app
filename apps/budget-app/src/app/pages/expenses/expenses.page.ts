import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CreateReportCardComponent,
  ExpensesTableComponent,
} from '@budget-app/expenses';
import { PaginationUiServiceModule, TranslationPipe } from '@budget-app/shared';
import { HasWalletDirective } from '@budget-app/wallets';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    ExpensesTableComponent,
    PaginationUiServiceModule,
    CreateReportCardComponent,
    HasWalletDirective,
    TranslationPipe,
    AsyncPipe,
  ],
  templateUrl: './expenses.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage {}
