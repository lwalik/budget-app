import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const GET_TRANSLATION: InjectionToken<GetTranslation> =
  new InjectionToken<GetTranslation>('GET_TRANSLATION');

export interface GetTranslation {
  getAllTranslations(keys: string[]): Observable<string[]>;
  getTranslation(key: string): Observable<string>;
}
