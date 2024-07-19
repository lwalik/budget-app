import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ReportFlowComponent } from '@budget-app/expenses';

@Component({
  standalone: true,
  imports: [ReportFlowComponent],
  templateUrl: './report.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPage {}
