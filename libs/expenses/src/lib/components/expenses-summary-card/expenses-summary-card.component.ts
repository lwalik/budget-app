import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  TransactionSummaryViewModel,
  TranslationPipe,
} from '@budget-app/shared';
import { Observable } from 'rxjs';
import { ExpensesState } from '../../states/expenses.state';

@Component({
  selector: 'lib-expenses-summary-card',
  standalone: true,
  imports: [CommonModule, TranslationPipe],
  templateUrl: './expenses-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesSummaryCardComponent {
  readonly expensesSummary$: Observable<TransactionSummaryViewModel> =
    this._expensesState.getExpenseSummary();

  constructor(private readonly _expensesState: ExpensesState) {}
}
