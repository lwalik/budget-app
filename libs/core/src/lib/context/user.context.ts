import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const USER_CONTEXT: InjectionToken<UserContext> =
  new InjectionToken<UserContext>('USER_CONTEXT');

export interface UserContext {
  getUserId(): Observable<string>;
  getUserEmail(): Observable<string>;
}
