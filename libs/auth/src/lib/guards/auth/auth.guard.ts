import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthState } from '../../state/auth.state';

export const AuthGuard: CanActivateFn = () => {
  const authState = inject(AuthState);
  const router = inject(Router);
  return authState.isLoggedIn().pipe(
    tap((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        router.navigateByUrl('login');
      }
    })
  );
};
