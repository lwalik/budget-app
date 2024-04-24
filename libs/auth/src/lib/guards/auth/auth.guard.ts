import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn().pipe(
    tap((isLoggedIn: boolean) => {
      if (!isLoggedIn) {
        router.navigateByUrl('login');
      }
    })
  );
};
