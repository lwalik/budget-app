import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  BarChartComponent,
  BarChartDatasetViewModel,
  GET_TRANSLATION,
  GetTranslation,
  INCOMES_DATA,
  IncomesData,
  IncomesDataViewModel,
  TranslationPipe,
} from '@budget-app/shared';
import { Observable, combineLatest, map, shareReplay, switchMap } from 'rxjs';
import { ExpensesState } from '../../states/expenses.state';
import { ExpensesDataViewModel } from '../../view-models/expenses-data.view-model';

@Component({
  selector: 'lib-incomes-and-expenses-chart',
  standalone: true,
  imports: [BarChartComponent, CommonModule, TranslationPipe],
  templateUrl: './incomes-and-expenses-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomesAndExpensesChartComponent {
  private readonly _expensesData$: Observable<ExpensesDataViewModel> =
    this._expensesState.getExpensesData().pipe();
  private readonly _incomesData$: Observable<IncomesDataViewModel> =
    this._incomesData.getIncomesData().pipe(shareReplay(1));

  readonly datasets$: Observable<BarChartDatasetViewModel[]> = combineLatest([
    this._expensesData$,
    this._incomesData$,
  ]).pipe(
    switchMap(
      ([expensesData, incomesData]: [
        ExpensesDataViewModel,
        IncomesDataViewModel
      ]) =>
        this._getTranslation.getAllTranslations(['Incomes', 'Expenses']).pipe(
          map(([incomesText, expensesText]: string[]) => {
            return [
              {
                label: incomesText,
                backgroundColor: 'rgba(0, 128, 0, 0.6)',
                data: incomesData.incomes,
              },
              {
                label: expensesText,
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                data: expensesData.expenses,
              },
            ];
          })
        )
    )
  );

  readonly xAxis$: Observable<string[]> = this._expensesData$.pipe(
    map((expensesData: ExpensesDataViewModel) => expensesData.dates)
  );

  constructor(
    private readonly _expensesState: ExpensesState,
    @Inject(INCOMES_DATA) private readonly _incomesData: IncomesData,
    @Inject(GET_TRANSLATION)
    private readonly _getTranslation: GetTranslation
  ) {}
}
