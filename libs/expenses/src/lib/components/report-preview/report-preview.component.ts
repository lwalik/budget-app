import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  shareReplay,
  take,
  tap,
} from 'rxjs';
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
  private readonly _selectedCategorySubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  readonly selectedCategory$: Observable<string | null> =
    this._selectedCategorySubject.asObservable().pipe(shareReplay(1));

  private readonly _pagination$: Observable<PaginationViewModel> =
    this._paginationUiService.getPagination();

  readonly report$: Observable<ReportPreviewViewModel | null> = combineLatest([
    this.selectedCategory$,
    this._expensesState.getReportPreview(),
  ]).pipe(
    map(
      ([selectedCategory, report]: [
        string | null,
        ReportPreviewViewModel | null
      ]) => {
        if (!report) {
          return report;
        }

        if (!selectedCategory) {
          return report;
        }

        return {
          ...report,
          expenses: report.expenses.filter((e) =>
            e.products.some((p) => p.category === selectedCategory)
          ),
        };
      }
    ),
    shareReplay(1)
  );

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
    this.selectedCategory$
      .pipe(
        take(1),
        tap((selectedCategory: string | null) => {
          if (selectedCategory === category) {
            this._selectedCategorySubject.next(null);
            return;
          }

          this._selectedCategorySubject.next(category);
        })
      )
      .subscribe();
  }
}
