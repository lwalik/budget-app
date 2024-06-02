import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './overview.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPage {
  barChartData: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009'],
    datasets: [
      { data: [500, 600, 100, 200], label: 'Przychody' },
      { data: [400, 200, 200, 150], label: 'Wydatki' },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      // datalabels: {
      //   anchor: 'end',
      //   align: 'end',
      // },
    },
  };
}
