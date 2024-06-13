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
import {
  DatesFilterComponent,
  SimpleInputFormComponent,
} from '@budget-app/shared';
import { FormControl, Validators } from '@angular/forms';

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
  ],
  templateUrl: './dashboard.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  control: FormControl = new FormControl('', Validators.required);
}
