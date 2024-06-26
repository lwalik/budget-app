import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CategoryExpensesSummaryCardComponent,
  LowPriorityExpensesSummaryCardComponent,
} from '@budget-app/expenses';

@Component({
  standalone: true,
  imports: [
    LowPriorityExpensesSummaryCardComponent,
    CategoryExpensesSummaryCardComponent,
  ],
  templateUrl: './summary.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryPage {}
