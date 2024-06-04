import { Inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ENV_CONFIG, EnvConfig } from '@budget-app/core';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { ProductsResponse } from '../responses/products.response';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(
    private readonly _client: AngularFirestore,
    @Inject(ENV_CONFIG) private _envConfig: EnvConfig
  ) {}

  getAll(userId: string): Observable<ProductModel[]> {
    return this._getProductsDoc(userId)
      .valueChanges({ idFields: 'id' })
      .pipe(
        map((resp: ProductsResponse | undefined) => (resp ? resp.products : []))
      );
  }

  add(
    product: Omit<ProductModel, 'productId'>,
    userId: string
  ): Observable<ProductModel> {
    const productId: string = this._client.createId();
    const doc = this._getProductsDoc(userId);

    return doc.valueChanges({ idFields: 'id' }).pipe(
      take(1),
      switchMap((data: ProductsResponse | undefined) => {
        const newProduct: ProductModel = { productId, ...product };

        if (!data) {
          return mapPromiseToVoidObservable(
            doc.set({ products: [newProduct] })
          ).pipe(map(() => newProduct));
        }

        return mapPromiseToVoidObservable(
          doc.update({
            products: [...data.products, newProduct],
          })
        ).pipe(map(() => newProduct));
      })
    );
  }

  delete(productId: string, userId: string): Observable<void> {
    const doc = this._getProductsDoc(userId);
    return doc.valueChanges({ idFields: 'id' }).pipe(
      switchMap((data: ProductsResponse | undefined) => {
        if (!data) {
          return of(void 0);
        }

        return mapPromiseToVoidObservable(
          doc.update({
            products: data.products.filter(
              (product: ProductModel) => product.productId !== productId
            ),
          })
        );
      })
    );
  }

  update(updatedProduct: ProductModel, userId: string): Observable<void> {
    return this._getProductsDoc(userId)
      .valueChanges({ idFields: 'id' })
      .pipe(
        switchMap((data: ProductsResponse | undefined) => {
          if (!data) {
            return of(void 0);
          }

          const doc = this._getProductsDoc(userId);

          return mapPromiseToVoidObservable(
            doc.update({
              products: data.products.map((product: ProductModel) =>
                product.productId === updatedProduct.productId
                  ? updatedProduct
                  : product
              ),
            })
          );
        })
      );
  }

  private _getProductsDoc(
    userId: string
  ): AngularFirestoreDocument<ProductsResponse> {
    return this._client.doc<ProductsResponse>(
      `${this._envConfig.productsUrl}/` + userId
    );
  }
}
