import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import {
  DashboardFiltersStateModel,
  DashboardFiltersWalletStateModel,
} from '../models/dashboard-filters-state.model';
import { DashboardFiltersSelectedDatesViewModel } from '../view-models/dashboard-filters-selected-dates.view-model';
import { getDayWithMonthAsString } from '../../utils/dates';

const initialState: DashboardFiltersStateModel = {
  wallet: {
    id: undefined,
    name: 'All',
  },
  fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
  toDate: new Date(),
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

  getSelectedDates(): Observable<DashboardFiltersSelectedDatesViewModel> {
    return this.dashboardFiltersState$.pipe(
      map((filters: DashboardFiltersStateModel) => ({
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      }))
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

  setSelectedDates(fromDate: Date, toDate: Date): Observable<void> {
    return this.dashboardFiltersState$.pipe(
      take(1),
      tap((filters: DashboardFiltersStateModel) =>
        this._dashboardFiltersStateSubject.next({
          ...filters,
          fromDate: !isNaN(fromDate.getTime()) ? fromDate : new Date(0),
          toDate: !isNaN(toDate.getTime()) ? toDate : new Date(),
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
          let d = new Date(filters.fromDate);
          d <= filters.toDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dayWithMonth = getDayWithMonthAsString(d);
          dates[dayWithMonth] = 0;
        }
        return dates;
      })
    );
  }
}
