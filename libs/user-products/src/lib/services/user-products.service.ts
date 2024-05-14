import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { Observable, map, switchMap, take } from 'rxjs';
import { UserProductModel } from '../models/user-product.model';
import { UserProductsResponse } from '../responses/user-products.response';

@Injectable({ providedIn: 'root' })
export class UserProductsService {
  private readonly _baseUrl: string = 'user-products';
  constructor(private readonly _client: AngularFirestore) {}

  getAll(userId: string): Observable<UserProductModel[]> {
    return this._client
      .doc<UserProductsResponse>(`${this._baseUrl}/` + userId)
      .valueChanges()
      .pipe(
        map((resp: UserProductsResponse | undefined) =>
          resp ? resp.products : []
        )
      );
  }

  add(
    product: Omit<UserProductModel, 'productId'>,
    userId: string
  ): Observable<void> {
    const productId: string = this._client.createId();

    return this._client
      .doc<UserProductsResponse>(`${this._baseUrl}/` + userId)
      .valueChanges()
      .pipe(
        take(1),
        switchMap((data: UserProductsResponse | undefined) => {
          const doc = this._client.doc(`${this._baseUrl}/` + userId);

          if (!data) {
            return mapPromiseToVoidObservable(
              doc.set({ products: [{ productId, ...product }] })
            );
          }

          return mapPromiseToVoidObservable(
            doc.update({
              products: [...data.products, { productId, ...product }],
            })
          );
        })
      );
  }
}
