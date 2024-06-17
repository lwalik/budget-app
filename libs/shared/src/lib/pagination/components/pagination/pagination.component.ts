import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { PaginationViewModel } from '../../view-models/pagination.view-model';
import { CommonModule } from '@angular/common';
import { SimpleSelectListComponent } from '../../../components/simple-select-list/simple-select-list.component';
import { PaginationUiService } from '../../services/pagination-ui.service';

@Component({
  selector: 'lib-pagination',
  standalone: true,
  imports: [CommonModule, SimpleSelectListComponent],
  templateUrl: './pagination.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  // private readonly _paginationSubject: BehaviorSubject<PaginationViewModel> =
  //   new BehaviorSubject<PaginationViewModel>({
  //     first: 1,
  //     last: 1,
  //     current: 1,
  //     limit: 5,
  //     totalItems: 1,
  //   });
  readonly pagination$: Observable<PaginationViewModel> =
    this._paginationUiService.getPagination().pipe(shareReplay(1));

  readonly limitOptions$: Observable<string[]> = of(['5', '10', '15', '20']);

  // @Input() set initValue(value: PaginationViewModel | null) {
  //   if (!value) {
  //     return;
  //   }
  //   this._paginationSubject.next(value);
  // }

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
  // @Output() paginationChanged: EventEmitter<PaginationViewModel> =
  //   new EventEmitter<PaginationViewModel>();

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
          // this.paginationChanged.emit(newPaginationState);
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
          // this.paginationChanged.emit(newPaginationState);
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
          // this.paginationChanged.emit(newPaginationState);
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
          // this.paginationChanged.emit(newPaginationState);
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
          // this.paginationChanged.emit(newPaginationState);
          return this._paginationUiService
            .setPagination(newPaginationState)
            .pipe(take(1));
        })
      )
      .subscribe();
  }
}
