import { Inject, Injectable } from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
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
  private readonly _userProductsState$: Observable<UserProductsStateModel> =
    this._userProductsStateSubject.asObservable();

  constructor(
    private readonly _userProductsService: UserProductsService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext
  ) {}

  loadUserProducts(): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._userProductsState$,
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

  getProducts(): Observable<UserProductModel[]> {
    return this._userProductsState$.pipe(
      map((state: UserProductsStateModel) => state.products)
    );
  }

  addProduct(product: Omit<UserProductModel, 'productId'>): Observable<void> {
    return this._userContext.getUserId().pipe(
      take(1),
      switchMap((userId: string) =>
        this._userProductsService.add(product, userId).pipe(
          take(1),
          switchMap((newProduct: UserProductModel) =>
            this._userProductsState$.pipe(
              take(1),
              tap((state: UserProductsStateModel) =>
                this._userProductsStateSubject.next({
                  ...state,
                  products: [...state.products, newProduct],
                })
              ),
              map(() => void 0)
            )
          )
        )
      )
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._userProductsState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, UserProductsStateModel]) =>
        this._userProductsService.delete(productId, userId).pipe(
          tap(() =>
            this._userProductsStateSubject.next({
              ...state,
              products: state.products.filter(
                (product: UserProductModel) => product.productId !== productId
              ),
            })
          )
        )
      )
    );
  }

  updateProduct(updatedProduct: UserProductModel): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._userProductsState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, UserProductsStateModel]) =>
        this._userProductsService.update(updatedProduct, userId).pipe(
          tap(() =>
            this._userProductsStateSubject.next({
              products: state.products.map((product: UserProductModel) =>
                product.productId === updatedProduct.productId
                  ? updatedProduct
                  : product
              ),
            })
          )
        )
      )
    );
  }
}
