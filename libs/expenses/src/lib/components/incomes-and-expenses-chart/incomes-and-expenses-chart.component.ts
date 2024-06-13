import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { ExpensesState } from '../../states/expenses.state';
import {
  BarChartComponent,
  BarChartDatasetViewModel,
  INCOMES_DATA,
  IncomesData,
  IncomesDataViewModel,
} from '@budget-app/shared';
import { Observable, shareReplay, combineLatest, map } from 'rxjs';
import { ExpensesDataViewModel } from '../../view-models/expenses-data.view-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-incomes-and-expenses-chart',
  standalone: true,
  imports: [BarChartComponent, CommonModule],
  templateUrl: './incomes-and-expenses-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomesAndExpensesChartComponent {
  private readonly _expensesData$: Observable<ExpensesDataViewModel> =
    this._expensesState.getExpensesData().pipe(shareReplay(1));
  private readonly _incomesData$: Observable<IncomesDataViewModel> =
    this._incomesData.getIncomesData().pipe(shareReplay(1));

  readonly datasets$: Observable<BarChartDatasetViewModel[]> = combineLatest([
    this._expensesData$,
    this._incomesData$,
  ]).pipe(
    map(
      ([expensesData, incomesData]: [
        ExpensesDataViewModel,
        IncomesDataViewModel
      ]) => {
        return [
          {
            label: 'Income',
            backgroundColor: 'rgba(0, 128, 0, 0.6)',
            data: incomesData.incomes,
          },
          {
            label: 'Expense',
            backgroundColor: 'rgba(255, 0, 0, 0.6)',
            data: expensesData.expenses,
          },
        ];
      }
    )
  );

  readonly xAxis$: Observable<string[]> = this._expensesData$.pipe(
    map((expensesData: ExpensesDataViewModel) => expensesData.dates)
  );

  constructor(
    private readonly _expensesState: ExpensesState,
    @Inject(INCOMES_DATA) private readonly _incomesData: IncomesData
  ) {}
}
