import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CurrentBalanceCardComponent,
  IncomesSummaryCardComponent,
  WalletSelectDashboardFilterComponent,
  WalletSelectListComponent,
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
    WalletSelectDashboardFilterComponent,
  ],
  templateUrl: './dashboard.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
