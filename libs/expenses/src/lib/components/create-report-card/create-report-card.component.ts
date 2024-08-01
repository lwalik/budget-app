import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationPipe } from '@budget-app/shared';
import { ExpensesState } from '../../states/expenses.state';
import { map, Observable, take } from 'rxjs';
import { ExpenseModel } from '../../models/expense.model';

@Component({
  selector: 'lib-create-report-card',
  standalone: true,
  imports: [TranslationPipe, CommonModule, RouterLink],
  templateUrl: './create-report-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReportCardComponent {
  readonly isVisible$: Observable<boolean> = this._expensesState
    .getExpenses()
    .pipe(
      take(1),
      map((expenses: ExpenseModel[]) => expenses.length > 0)
    );

  constructor(private readonly _expensesState: ExpensesState) {}
}
