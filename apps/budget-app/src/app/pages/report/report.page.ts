import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ReportFlowComponent } from '@budget-app/expenses';
import { PaginationUiServiceModule } from '@budget-app/shared';

@Component({
  standalone: true,
  imports: [ReportFlowComponent, PaginationUiServiceModule],
  templateUrl: './report.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPage {}
