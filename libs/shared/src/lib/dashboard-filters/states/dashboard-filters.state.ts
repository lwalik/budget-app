import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import {
  DashboardFiltersStateModel,
  DashboardFiltersWalletStateModel,
} from '../models/dashboard-filters-state.model';

const initialState: DashboardFiltersStateModel = {
  wallet: {
    id: undefined,
    name: 'All',
  },
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

  getSelectedWallet(): Observable<DashboardFiltersWalletStateModel> {
    return this.dashboardFiltersState$.pipe(
      map((filters: DashboardFiltersStateModel) => filters.wallet)
    );
  }

  setSelectedWallet(
    wallet: DashboardFiltersWalletStateModel
  ): Observable<void> {
    return this.dashboardFiltersState$.pipe(
      take(1),
      tap((filters: DashboardFiltersStateModel) =>
        this._dashboardFiltersStateSubject.next({
          ...filters,
          wallet,
        })
      ),
      map(() => void 0)
    );
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
