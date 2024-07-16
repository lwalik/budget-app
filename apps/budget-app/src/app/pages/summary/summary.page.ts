import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CategoryExpensesSummaryCardComponent,
  LowPriorityExpensesSummaryCardComponent,
} from '@budget-app/expenses';
import { CreateReportCardComponent } from '@budget-app/products';
import { DepositsSummaryCardComponent } from '@budget-app/wallets';

@Component({
  standalone: true,
  imports: [
    LowPriorityExpensesSummaryCardComponent,
    CategoryExpensesSummaryCardComponent,
    DepositsSummaryCardComponent,
    CreateReportCardComponent,
  ],
  templateUrl: './summary.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryPage {}
