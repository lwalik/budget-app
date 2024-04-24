import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCredentialsModel } from '../models/user-credentials.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly _auth: AngularFireAuth) {
  }

  login(user: UserCredentialsModel): Observable<any> {
    return new Observable(observer => {
      this._auth.signInWithEmailAndPassword(user.email, user.password)
        .then((response) => {
          console.log('response: ', response);
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          console.log('error: ', error);
          observer.error(error)
        })
    })
  }
}
