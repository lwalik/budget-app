import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable, of } from 'rxjs';
import { LoginCredentialsModel } from '../models/login-credentials.model';
import { UserContext } from '@budget-app/core';

@Injectable({ providedIn: 'root' })
export class AuthService implements UserContext {
  constructor(private readonly _auth: AngularFireAuth) {}

  login(user: LoginCredentialsModel): Observable<void> {
    return new Observable((observer) => {
      this._auth
        .signInWithEmailAndPassword(user.email, user.password)
        .then(() => {
          observer.next(void 0);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  isLoggedIn(): Observable<boolean> {
    return this._auth.user.pipe(map((data) => !!data));
  }

  logout(): Observable<void> {
    return of(this._auth.signOut()).pipe(map(() => void 0));
  }

  getUserId(): Observable<string> {
    // TODO po loginie zapisać dane usera w subject i tutaj tylko zwrócić dane z subject
    return this._auth.user.pipe(map((data) => (data ? data.uid : '')));
  }
}
