import { Inject, Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ENV_CONFIG, EnvConfig } from '@budget-app/core';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { UserProductModel } from '../models/user-product.model';
import { UserProductsResponse } from '../responses/user-products.response';

@Injectable({ providedIn: 'root' })
export class UserProductsService {
  constructor(
    private readonly _client: AngularFirestore,
    @Inject(ENV_CONFIG) private _envConfig: EnvConfig
  ) {}

  getAll(userId: string): Observable<UserProductModel[]> {
    return this._getUserProductsDoc(userId)
      .valueChanges({ idFields: 'id' })
      .pipe(
        map((resp: UserProductsResponse | undefined) =>
          resp ? resp.products : []
        )
      );
  }

  add(
    product: Omit<UserProductModel, 'productId'>,
    userId: string
  ): Observable<UserProductModel> {
    const productId: string = this._client.createId();

    return this._getUserProductsDoc(userId)
      .valueChanges({ idFields: 'id' })
      .pipe(
        take(1),
        switchMap((data: UserProductsResponse | undefined) => {
          const doc = this._getUserProductsDoc(userId);
          const newProduct: UserProductModel = { productId, ...product };

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
    return this._getUserProductsDoc(userId)
      .valueChanges({ idFields: 'id' })
      .pipe(
        switchMap((data: UserProductsResponse | undefined) => {
          const doc = this._getUserProductsDoc(userId);

          if (!data) {
            return of(void 0);
          }

          return mapPromiseToVoidObservable(
            doc.update({
              products: data.products.filter(
                (product: UserProductModel) => product.productId !== productId
              ),
            })
          );
        })
      );
  }

  update(updatedProduct: UserProductModel, userId: string): Observable<void> {
    return this._getUserProductsDoc(userId)
      .valueChanges({ idFields: 'id' })
      .pipe(
        switchMap((data: UserProductsResponse | undefined) => {
          if (!data) {
            return of(void 0);
          }

          const doc = this._getUserProductsDoc(userId);

          return mapPromiseToVoidObservable(
            doc.update({
              products: data.products.map((product: UserProductModel) =>
                product.productId === updatedProduct.productId
                  ? updatedProduct
                  : product
              ),
            })
          );
        })
      );
  }

  private _getUserProductsDoc(
    userId: string
  ): AngularFirestoreDocument<UserProductsResponse> {
    return this._client.doc<UserProductsResponse>(
      `${this._envConfig.userProductsUrl}/` + userId
    );
  }
}
