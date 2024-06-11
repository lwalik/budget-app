import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesState } from '../../states/expenses.state';
import { Observable } from 'rxjs';
import { TransactionSummaryViewModel } from '@budget-app/shared';

@Component({
  selector: 'lib-expenses-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expenses-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesSummaryCardComponent {
  readonly expensesSummary$: Observable<TransactionSummaryViewModel> =
    this._expensesState.getExpenseSummary();

  constructor(private readonly _expensesState: ExpensesState) {}
}
