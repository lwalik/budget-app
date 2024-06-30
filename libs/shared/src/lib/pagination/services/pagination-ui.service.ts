import { Injectable } from '@angular/core';
import {
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  startWith,
  take,
  tap,
} from 'rxjs';
import { PaginationViewModel } from '../view-models/pagination.view-model';

const initialPaginationState: PaginationViewModel = {
  first: 1,
  last: 1,
  current: 1,
  limit: 5,
  totalItems: 1,
};

@Injectable()
export class PaginationUiService {
  private readonly _paginationSubject: ReplaySubject<PaginationViewModel> =
    new ReplaySubject<PaginationViewModel>(1);
  private readonly _pagination$: Observable<PaginationViewModel> =
    this._paginationSubject
      .asObservable()
      .pipe(startWith(initialPaginationState), shareReplay(1));

  getPagination(): Observable<PaginationViewModel> {
    return this._pagination$;
  }

  setPagination(
    newPaginationState: Partial<PaginationViewModel>
  ): Observable<void> {
    return this._pagination$.pipe(
      take(1),
      tap((state: PaginationViewModel) =>
        this._paginationSubject.next({
          ...state,
          ...newPaginationState,
        })
      ),
      map(() => void 0)
    );
  }
}
