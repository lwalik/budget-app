import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  EmotionTextDirective,
  PositiveNumberPipe,
  TranslationPipe,
} from '@budget-app/shared';
import { Observable } from 'rxjs';
import { ExpensesState } from '../../states/expenses.state';
import { CategorySummaryViewModel } from '../../view-models/category-summary.view-model';

@Component({
  selector: 'lib-category-expenses-summary-card',
  standalone: true,
  imports: [
    CommonModule,
    PositiveNumberPipe,
    TranslationPipe,
    EmotionTextDirective,
  ],
  templateUrl: './category-expenses-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryExpensesSummaryCardComponent {
  readonly summary$: Observable<CategorySummaryViewModel> =
    this._expensesState.getCategoryExpensesSummary();

  constructor(private readonly _expensesState: ExpensesState) {}
}
