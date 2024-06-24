import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, of, shareReplay, switchMap, take } from 'rxjs';
import { SimpleSelectListComponent } from '../../../components/simple-select-list/simple-select-list.component';
import { PaginationUiService } from '../../services/pagination-ui.service';
import { PaginationViewModel } from '../../view-models/pagination.view-model';
import { TranslationPipe } from '../../../pipes/translation.pipe';

@Component({
  selector: 'lib-pagination',
  standalone: true,
  imports: [CommonModule, SimpleSelectListComponent, TranslationPipe],
  templateUrl: './pagination.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly pagination$: Observable<PaginationViewModel> =
    this._paginationUiService.getPagination().pipe(shareReplay(1));

  readonly limitOptions$: Observable<string[]> = of(['5', '10', '15', '20']);

  @Input() set totalItems(count: number) {
    this.pagination$
      .pipe(
        take(1),
        switchMap((pagination: PaginationViewModel) =>
          this._paginationUiService
            .setPagination({
              totalItems: count,
              last: Math.max(1, Math.ceil(count / pagination.limit)),
            })
            .pipe(take(1))
        )
      )
      .subscribe();
  }

  constructor(private readonly _paginationUiService: PaginationUiService) {}

  onFirstPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        switchMap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: pagination.first,
          };
          return this._paginationUiService
            .setPagination(newPaginationState)
            .pipe(take(1));
        })
      )
      .subscribe();
  }

  onLastPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        switchMap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: pagination.last,
          };
          return this._paginationUiService
            .setPagination(newPaginationState)
            .pipe(take(1));
        })
      )
      .subscribe();
  }

  onNextPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        switchMap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: Math.min(pagination.current + 1, pagination.last),
          };
          return this._paginationUiService
            .setPagination(newPaginationState)
            .pipe(take(1));
        })
      )
      .subscribe();
  }

  onPrevPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        switchMap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: Math.max(pagination.current - 1, pagination.first),
          };
          return this._paginationUiService
            .setPagination(newPaginationState)
            .pipe(take(1));
        })
      )
      .subscribe();
  }

  onLimitOptionSelected(limit: string): void {
    this.pagination$
      .pipe(
        take(1),
        switchMap((pagination: PaginationViewModel) => {
          const newLimit: number = +limit;
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            limit: newLimit,
            last: Math.max(1, Math.ceil(pagination.totalItems / newLimit)),
          };
          return this._paginationUiService
            .setPagination(newPaginationState)
            .pipe(take(1));
        })
      )
      .subscribe();
  }
}
