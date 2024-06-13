import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CurrentBalanceCardComponent,
  IncomesSummaryCardComponent,
} from '@budget-app/wallets';
import {
  ExpensesSummaryCardComponent,
  IncomesAndExpensesChartComponent,
} from '@budget-app/expenses';

@Component({
  standalone: true,
  imports: [
    IncomesSummaryCardComponent,
    ExpensesSummaryCardComponent,
    CurrentBalanceCardComponent,
    IncomesAndExpensesChartComponent,
  ],
  templateUrl: './dashboard.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
