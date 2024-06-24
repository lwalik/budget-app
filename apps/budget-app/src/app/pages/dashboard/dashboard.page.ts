import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  ExpensesSummaryCardComponent,
  IncomesAndExpensesChartComponent,
} from '@budget-app/expenses';
import {
  DatesFilterComponent,
  SimpleInputFormComponent,
  TranslationPipe,
} from '@budget-app/shared';
import {
  CurrentBalanceCardComponent,
  IncomesSummaryCardComponent,
  WalletSelectDashboardFilterComponent,
} from '@budget-app/wallets';

@Component({
  standalone: true,
  imports: [
    IncomesSummaryCardComponent,
    ExpensesSummaryCardComponent,
    CurrentBalanceCardComponent,
    IncomesAndExpensesChartComponent,
    WalletSelectDashboardFilterComponent,
    DatesFilterComponent,
    SimpleInputFormComponent,
    TranslationPipe,
    AsyncPipe,
  ],
  templateUrl: './dashboard.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  control: FormControl = new FormControl('', Validators.required);
}
