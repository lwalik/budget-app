import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { IncomesSummaryCardComponent } from '@budget-app/wallets';
import { ExpensesSummaryCardComponent } from '@budget-app/expenses';

@Component({
  standalone: true,
  imports: [IncomesSummaryCardComponent, ExpensesSummaryCardComponent],
  templateUrl: './dashboard.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
