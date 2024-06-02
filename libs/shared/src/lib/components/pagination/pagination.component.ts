import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable, of, shareReplay, take, tap } from 'rxjs';
import { PaginationViewModel } from '../../view-models/pagination.view-model';
import { CommonModule } from '@angular/common';
import { SimpleSelectListComponent } from '../simple-select-list/simple-select-list.component';

@Component({
  selector: 'lib-pagination',
  standalone: true,
  imports: [CommonModule, SimpleSelectListComponent],
  templateUrl: './pagination.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  private readonly _paginationSubject: BehaviorSubject<PaginationViewModel> =
    new BehaviorSubject<PaginationViewModel>({
      first: 1,
      last: 1,
      current: 1,
      limit: 5,
      totalItems: 1,
    });
  readonly pagination$: Observable<PaginationViewModel> =
    this._paginationSubject.asObservable().pipe(shareReplay(1));

  readonly limitOptions$: Observable<string[]> = of(['5', '10', '15', '20']);

  @Input() set initValue(value: PaginationViewModel | null) {
    if (!value) {
      return;
    }
    this._paginationSubject.next(value);
  }

  @Input() set totalItems(count: number) {
    this.pagination$
      .pipe(
        take(1),
        tap((pagination: PaginationViewModel) => {
          this._paginationSubject.next({
            ...pagination,
            totalItems: count,
            last: Math.max(1, Math.ceil(count / pagination.limit)),
          });
        })
      )
      .subscribe();
  }
  @Output() paginationChanged: EventEmitter<PaginationViewModel> =
    new EventEmitter<PaginationViewModel>();

  onFirstPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        tap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: pagination.first,
          };
          this.paginationChanged.emit(newPaginationState);
          return this._paginationSubject.next(newPaginationState);
        })
      )
      .subscribe();
  }

  onLastPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        tap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: pagination.last,
          };
          this.paginationChanged.emit(newPaginationState);
          return this._paginationSubject.next(newPaginationState);
        })
      )
      .subscribe();
  }

  onNextPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        tap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: Math.min(pagination.current + 1, pagination.last),
          };
          this.paginationChanged.emit(newPaginationState);
          return this._paginationSubject.next(newPaginationState);
        })
      )
      .subscribe();
  }

  onPrevPageClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        tap((pagination: PaginationViewModel) => {
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            current: Math.max(pagination.current - 1, pagination.first),
          };
          this.paginationChanged.emit(newPaginationState);
          return this._paginationSubject.next(newPaginationState);
        })
      )
      .subscribe();
  }

  onLimitOptionSelected(limit: string): void {
    this.pagination$
      .pipe(
        take(1),
        tap((pagination: PaginationViewModel) => {
          const newLimit: number = +limit;
          const newPaginationState: PaginationViewModel = {
            ...pagination,
            limit: newLimit,
            last: Math.max(1, Math.ceil(pagination.totalItems / newLimit)),
          };
          this.paginationChanged.emit(newPaginationState);
          return this._paginationSubject.next(newPaginationState);
        })
      )
      .subscribe();
  }
}
