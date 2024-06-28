import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CategoryExpensesSummaryCardComponent,
  LowPriorityExpensesSummaryCardComponent,
} from '@budget-app/expenses';
import { DepositsSummaryCardComponent } from '@budget-app/wallets';

@Component({
  standalone: true,
  imports: [
    LowPriorityExpensesSummaryCardComponent,
    CategoryExpensesSummaryCardComponent,
    DepositsSummaryCardComponent,
  ],
  templateUrl: './summary.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryPage {}
