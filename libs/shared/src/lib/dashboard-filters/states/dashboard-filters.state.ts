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

  getSelectedDates(): Observable<DashboardFiltersSelectedDatesViewModel> {
    return this.dashboardFiltersState$.pipe(
      map((filters: DashboardFiltersStateModel) => ({
        startDate: filters.startDate,
        endDate: filters.endDate,
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

  setSelectedDates(startDate: Date, endDate: Date): Observable<void> {
    if (isNaN(startDate.getTime())) {
      console.log('tak');
    }
    return this.dashboardFiltersState$.pipe(
      take(1),
      tap((filters: DashboardFiltersStateModel) =>
        this._dashboardFiltersStateSubject.next({
          ...filters,
          startDate: !isNaN(startDate.getTime()) ? startDate : new Date(0),
          endDate: !isNaN(endDate.getTime()) ? endDate : new Date(),
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
          const dayWithMonth = getDayWithMonthAsString(d);
          dates[dayWithMonth] = 0;
        }
        return dates;
      })
    );
  }
}
