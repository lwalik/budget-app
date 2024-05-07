import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable, of } from 'rxjs';
import { AuthUserModel } from '../models/auth-user.model';
import { LoginCredentialsModel } from '../models/login-credentials.model';

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

  logout(): Observable<void> {
    return of(this._auth.signOut()).pipe(map(() => void 0));
  }

  getUser(): Observable<AuthUserModel | null> {
    return this._auth.user.pipe(
      map((user) =>
        user
          ? {
              uid: user.uid,
              email: user.email ?? '',
              emailVerified: user.emailVerified,
            }
          : null
      )
    );
  }
}
