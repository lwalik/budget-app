import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const INCOMES_DATA: InjectionToken<IncomesData> =
  new InjectionToken<IncomesData>('INCOMES_DATA');

export interface IncomesData {
  getIncomesData(): Observable<IncomesDataViewModel>;
}

export interface IncomesDataViewModel {
  readonly incomes: number[];
  readonly dates: string[];
}
