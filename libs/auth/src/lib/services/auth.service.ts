import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoginCredentialsModel } from '../models/login-credentials.model';
import { map, Observable, of } from 'rxjs';
import { AuthUserModel } from '../models/auth-user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
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

  getUser(): Observable<AuthUserModel | null> {
    return this._auth.user.pipe(
      map((data) =>
        data
          ? {
              email: data.email,
              emailVerified: data.emailVerified,
              uid: data.uid,
            }
          : null
      )
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this._auth.user.pipe(map((data) => !!data));
  }

  logout(): Observable<void> {
    return of(this._auth.signOut()).pipe(map(() => void 0));
  }
}
