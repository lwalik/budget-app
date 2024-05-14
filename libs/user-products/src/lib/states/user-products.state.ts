import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { UserProductModel } from '../models/user-product.model';
import { UserProductsStateModel } from '../models/user-products-state.model';
import { UserProductsService } from '../services/user-products.service';

const initialState: UserProductsStateModel = {
  products: [],
};

@Injectable({ providedIn: 'root' })
export class UserProductsState {
  private readonly _userProductsStateSubject: BehaviorSubject<UserProductsStateModel> =
    new BehaviorSubject<UserProductsStateModel>(initialState);

  constructor(
    private readonly _userProductsService: UserProductsService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext
  ) {}

  loadUserProducts(): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._userProductsStateSubject.asObservable(),
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, UserProductsStateModel]) =>
        this._userProductsService.getAll(userId).pipe(
          tap((userProducts: UserProductModel[]) =>
            this._userProductsStateSubject.next({
              ...state,
              products: userProducts,
            })
          ),
          map(() => void 0)
        )
      )
    );
  }

  addProduct(
    product: Omit<UserProductModel, 'productId'>,
    userId: string
  ): Observable<void> {
    return this._userProductsService.add(product, userId);
  }
}
