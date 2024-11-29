import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, map, Observable, shareReplay, take } from 'rxjs';
import { ExpensesState } from '../../states/expenses.state';
import { ReportPreviewViewModel } from '../../view-models/report-preview.view-model';
import {
  PaginationComponent,
  PaginationUiService,
  PaginationViewModel,
  TranslationPipe,
} from '@budget-app/shared';
import { WalletNameComponent } from '@budget-app/wallets';
import { ExpenseModel } from '../../models/expense.model';

@Component({
  selector: 'lib-report-preview',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    PaginationComponent,
    WalletNameComponent,
  ],
  templateUrl: './report-preview.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPreviewComponent {
  private readonly _pagination$: Observable<PaginationViewModel> =
    this._paginationUiService.getPagination();

  readonly report$: Observable<ReportPreviewViewModel | null> =
    this._expensesState.getReportPreview().pipe(shareReplay(1));

  readonly filteredExpenses$: Observable<ExpenseModel[]> = combineLatest([
    this.report$,
    this._pagination$,
  ]).pipe(
    map(
      ([report, pagination]: [
        ReportPreviewViewModel | null,
        PaginationViewModel
      ]) => {
        if (!report) {
          return [];
        }

        const start: number =
          pagination.current === 1
            ? 0
            : pagination.limit * (pagination.current - 1);
        const end: number = pagination.current * pagination.limit;

        return report.expenses.slice(start, end);
      }
    )
  );

  @Output() createNew: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly _expensesState: ExpensesState,
    private readonly _paginationUiService: PaginationUiService
  ) {}

  onCreateNewReportClicked(): void {
    this._expensesState
      .clearReportConfiguration()
      .pipe(take(1))
      .subscribe(() => this.createNew.emit());
  }

  onCategoryClicked(category: string): void {
    this._expensesState.selectPreviewCategory(category).subscribe();
  }
}
