import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DashboardFiltersStateModel } from '../models/dashboard-filters-state.model';

const initialState: DashboardFiltersStateModel = {
  walletId: null,
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  endDate: new Date(),
};

@Injectable({ providedIn: 'root' })
export class DashboardFiltersState {
  private readonly _dashboardFiltersStateSubject: BehaviorSubject<DashboardFiltersStateModel> =
    new BehaviorSubject<DashboardFiltersStateModel>(initialState);
  private readonly dashboardFiltersState$: Observable<DashboardFiltersStateModel> =
    this._dashboardFiltersStateSubject.asObservable();

  getFilters(): Observable<DashboardFiltersStateModel> {
    return this.dashboardFiltersState$;
  }

  createEmptyDateRangeObject(): Observable<Record<string, number>> {
    return this.dashboardFiltersState$.pipe(
      map((filters: DashboardFiltersStateModel) => {
        const dates: Record<string, number> = {};
        for (
          let d = new Date(filters.startDate);
          d <= filters.endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dayMonth = `${String(d.getDate()).padStart(2, '0')}.${String(
            d.getMonth() + 1
          ).padStart(2, '0')}`;
          dates[dayMonth] = 0;
        }
        return dates;
      })
    );
  }
}
