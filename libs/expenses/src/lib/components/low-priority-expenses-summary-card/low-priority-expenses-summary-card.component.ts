import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { PositiveNumberPipe } from '@budget-app/shared';
import { Observable } from 'rxjs';
import { EXPENSE_PRODUCT_PRIORITY } from '../../enums/expense-product-priority.enum';
import { ExpensesState } from '../../states/expenses.state';
import { PrioritySummaryViewModel } from '../../view-models/priority-summary.view-model';

@Component({
  selector: 'lib-low-priority-expenses-summary-card',
  standalone: true,
  imports: [CommonModule, PositiveNumberPipe],
  templateUrl: './low-priority-expenses-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LowPriorityExpensesSummaryCardComponent {
  readonly summary$: Observable<PrioritySummaryViewModel> =
    this._expensesState.getLowPriorityExpensesSummary(
      EXPENSE_PRODUCT_PRIORITY.LOW
    );
  constructor(private readonly _expensesState: ExpensesState) {}
}
