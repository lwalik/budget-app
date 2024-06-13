import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsState } from '../states/products.state';

export const LoadProductsResolver: ResolveFn<void> = (): Observable<void> => {
  const productsState: ProductsState = inject(ProductsState);

  return productsState.loadProducts();
};
