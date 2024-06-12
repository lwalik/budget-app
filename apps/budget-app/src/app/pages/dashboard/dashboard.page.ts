import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CurrentBalanceCardComponent,
  IncomesSummaryCardComponent,
} from '@budget-app/wallets';
import { ExpensesSummaryCardComponent } from '@budget-app/expenses';
import {
  BarChartComponent,
  BarChartDatasetViewModel,
} from '@budget-app/shared';

@Component({
  standalone: true,
  imports: [
    IncomesSummaryCardComponent,
    ExpensesSummaryCardComponent,
    CurrentBalanceCardComponent,
    BarChartComponent,
  ],
  templateUrl: './dashboard.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  readonly emptyArray: number[] = new Array(
    Math.ceil(new Date(2024, 6, 0).getDate() / 7)
  ).fill(0);
  readonly xAxis: string[] = this.emptyArray.map((_, idx) => `${idx + 1}`);

  readonly datasets: BarChartDatasetViewModel[] = [
    {
      label: 'Income',
      backgroundColor: 'green',
      data: this.emptyArray.map((v, idx) =>
        idx % 5 === 0 ? Math.floor(Math.random() * 51) : v
      ),
    },
    {
      label: 'Expense',
      backgroundColor: 'red',
      data: this.emptyArray.map((v, idx) =>
        idx % 2 === 0 ? Math.floor(Math.random() * 41) : v
      ),
    },
  ];
}
