import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ENV_CONFIG, EnvConfig } from '@budget-app/core';
import { mapPromiseToVoidObservable } from '@budget-app/shared';
import { Observable, map } from 'rxjs';
import { ProductsCategoryResponse } from '../responses/products-category.response';

@Injectable({ providedIn: 'root' })
export class ProductsCategoryService {
  constructor(
    private readonly _client: AngularFirestore,
    @Inject(ENV_CONFIG) private _envConfig: EnvConfig
  ) {}

  getAll(): Observable<string[]> {
    return this._client
      .collection<ProductsCategoryResponse>(
        this._envConfig.productsCategoryUrl,
        (ref) => ref.orderBy('name', 'asc')
      )
      .valueChanges()
      .pipe(
        map((categories: ProductsCategoryResponse[]) =>
          categories.map((category: ProductsCategoryResponse) => category.name)
        )
      );
  }

  create(category: string): Observable<void> {
    const id: string = this._client.createId();
    return mapPromiseToVoidObservable(
      this._client.doc(`${this._envConfig.productsCategoryUrl}/` + id).set({
        name: category,
      })
    );
  }
}
