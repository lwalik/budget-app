import { Injectable } from '@angular/core';
import { UserContext } from '@budget-app/core';
import {
  BehaviorSubject,
  Observable,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AuthUserModel } from '../models/auth-user.model';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthState implements UserContext {
  private readonly _userSubject: BehaviorSubject<AuthUserModel | null> =
    new BehaviorSubject<AuthUserModel | null>(null);

  constructor(private readonly _authService: AuthService) {}

  login(user: UserCredentialsModel): Observable<void> {
    return this._authService.login(user).pipe(
      switchMap(() => this._authService.getUser()),
      tap((user: AuthUserModel | null) => this._userSubject.next(user)),
      map(() => void 0)
    );
  }

  logout(): Observable<void> {
    return this._authService
      .logout()
      .pipe(tap(() => this._userSubject.next(null)));
  }

  isLoggedIn(): Observable<boolean> {
    return this._userSubject.asObservable().pipe(
      take(1),
      map((user) => !!user),
      switchMap((isLoggedIn: boolean) =>
        !isLoggedIn
          ? this._authService.getUser().pipe(
              tap((user: AuthUserModel | null) => this._userSubject.next(user)),
              map((user: AuthUserModel | null) => !!user)
            )
          : of(true)
      )
    );
  }

  getUserId(): Observable<string> {
    return this._userSubject
      .asObservable()
      .pipe(map((user) => (user ? user.uid : '')));
  }

  getUserEmail(): Observable<string> {
    return this._userSubject
      .asObservable()
      .pipe(map((user) => (user ? user.email : '')));
  }

  createUser(user: UserCredentialsModel): Observable<void> {
    return this._authService.register(user);
  }
}
