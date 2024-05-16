import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { UserProductsState } from '../states/user-products.state';

export const LoadUserProductsResolver: ResolveFn<
  void
> = (): Observable<void> => {
  const userProductsState: UserProductsState = inject(UserProductsState);

  return userProductsState.isInitialized$.pipe(
    take(1),
    switchMap((isInitialized: boolean) =>
      isInitialized ? of(void 0) : userProductsState.loadUserProducts()
    )
  );
};
