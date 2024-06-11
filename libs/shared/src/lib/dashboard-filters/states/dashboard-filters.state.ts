import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
}
