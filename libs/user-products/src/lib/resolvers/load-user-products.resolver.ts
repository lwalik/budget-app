import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { UserProductsState } from '../states/user-products.state';

export const LoadUserProductsResolver: ResolveFn<
  void
> = (): Observable<void> => {
  const userProductsState: UserProductsState = inject(UserProductsState);

  return userProductsState.loadUserProducts();
};
