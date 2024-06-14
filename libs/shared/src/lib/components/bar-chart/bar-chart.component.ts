import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject, Observable, shareReplay, take, tap } from 'rxjs';
import { BarChartDatasetViewModel } from '../../view-models/bar-chart-dataset.view-model';

@Component({
  selector: 'lib-bar-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: './bar-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  private readonly _chartDataSubject: BehaviorSubject<ChartData<'bar'>> =
    new BehaviorSubject<ChartData<'bar'>>({
      labels: [],
      datasets: [],
    });
  readonly chartData$: Observable<ChartData<'bar'>> = this._chartDataSubject
    .asObservable()
    .pipe(shareReplay(1));

  private readonly _chartOptionsSubject: BehaviorSubject<
    ChartConfiguration<'bar'>['options']
  > = new BehaviorSubject<ChartConfiguration<'bar'>['options']>({
    scales: {
      x: {},
      y: {},
    },
    responsive: true,
  });
  readonly chartOptions$: Observable<ChartConfiguration<'bar'>['options']> =
    this._chartOptionsSubject.asObservable().pipe(shareReplay(1));

  @Input() set xAxis(value: string[]) {
    this.chartData$
      .pipe(
        take(1),
        tap((subject: ChartData<'bar'>) =>
          this._chartDataSubject.next({
            ...subject,
            labels: value,
          })
        )
      )
      .subscribe();
  }

  @Input() set datasets(value: BarChartDatasetViewModel[]) {
    this.chartData$
      .pipe(
        take(1),
        tap((subject: ChartData<'bar'>) =>
          this._chartDataSubject.next({
            ...subject,
            datasets: value,
          })
        )
      )
      .subscribe();
  }

  @Input() set xAxisText(text: string) {
    this.chartOptions$
      .pipe(
        take(1),
        tap((subject: ChartConfiguration<'bar'>['options']) =>
          this._chartOptionsSubject.next({
            ...subject,
            scales: {
              ...subject?.scales,
              x: {
                ...subject?.scales?.['x'],
                title: {
                  display: true,
                  text,
                },
              },
            },
          })
        )
      )
      .subscribe();
  }

  @Input() set yAxisText(text: string) {
    this.chartOptions$
      .pipe(
        take(1),
        tap((subject: ChartConfiguration<'bar'>['options']) =>
          this._chartOptionsSubject.next({
            ...subject,
            scales: {
              ...subject?.scales,
              y: {
                ...subject?.scales?.['y'],
                title: {
                  display: true,
                  text,
                },
              },
            },
          })
        )
      )
      .subscribe();
  }
}
