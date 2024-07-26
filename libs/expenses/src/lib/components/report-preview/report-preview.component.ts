import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ProductReportConfigurationStateModel } from '../../models/product-report-configuration-state.model';
import { ExpensesState } from '../../states/expenses.state';

@Component({
  selector: 'lib-report-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-preview.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPreviewComponent {
  readonly report$: Observable<
    ProductReportConfigurationStateModel | undefined
  > = this._expensesState.getReportPreview();

  constructor(private readonly _expensesState: ExpensesState) {}
}
