import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { UserProductModel } from '../models/user-product.model';
import { UserProductsResponse } from '../responses/user-products.response';

@Injectable({ providedIn: 'root' })
export class UserProductsService {
  private readonly _baseUrl: string = 'user-products';
  constructor(private readonly _client: AngularFirestore) {}

  getAll(userId: string): Observable<UserProductModel[]> {
    return this._getUserProductsResponse(userId).pipe(
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

    return this._getUserProductsResponse(userId).pipe(
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
    return this._getUserProductsResponse(userId).pipe(
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
    return this._getUserProductsResponse(userId).pipe(
      switchMap((data: UserProductsResponse | undefined) => {
        const doc = this._getUserProductsDoc(userId);

        if (!data) {
          return of(void 0);
        }

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

  private _getUserProductsResponse(
    userId: string
  ): Observable<UserProductsResponse | undefined> {
    return this._getUserProductsDoc(userId).valueChanges();
  }

  private _getUserProductsDoc(
    userId: string
  ): AngularFirestoreDocument<UserProductsResponse> {
    return this._client.doc<UserProductsResponse>(`${this._baseUrl}/` + userId);
  }
}
