import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { LowPriorityExpensesSummaryCardComponent } from '@budget-app/expenses';

@Component({
  standalone: true,
  imports: [LowPriorityExpensesSummaryCardComponent],
  templateUrl: './summary.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryPage {}
