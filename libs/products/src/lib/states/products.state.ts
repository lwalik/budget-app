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
import { ProductModel } from '../models/product.model';
import { ProductsStateModel } from '../models/products-state.model';
import { ProductsCategoryService } from '../services/products-category.service';
import { ProductsService } from '../services/products.service';

const initialState: ProductsStateModel = {
  products: [],
};

@Injectable({ providedIn: 'root' })
export class ProductsState {
  private readonly _productsStateSubject: BehaviorSubject<ProductsStateModel> =
    new BehaviorSubject<ProductsStateModel>(initialState);
  private readonly _productsState$: Observable<ProductsStateModel> =
    this._productsStateSubject.asObservable();

  constructor(
    private readonly _productsService: ProductsService,
    private readonly _productsCategoryService: ProductsCategoryService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext
  ) {}

  loadProducts(): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._productsState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ProductsStateModel]) =>
        this._productsService.getAll(userId).pipe(
          tap((products: ProductModel[]) =>
            this._productsStateSubject.next({
              ...state,
              products,
            })
          ),
          map(() => void 0)
        )
      )
    );
  }

  getAllProducts(): Observable<ProductModel[]> {
    return this._productsState$.pipe(
      map((state: ProductsStateModel) => state.products)
    );
  }

  addProduct(product: Omit<ProductModel, 'productId'>): Observable<void> {
    return this._userContext.getUserId().pipe(
      take(1),
      switchMap((userId: string) =>
        this._productsService.add(product, userId).pipe(
          take(1),
          switchMap((newProduct: ProductModel) =>
            this._productsState$.pipe(
              take(1),
              tap((state: ProductsStateModel) =>
                this._productsStateSubject.next({
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
      this._productsState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ProductsStateModel]) =>
        this._productsService.delete(productId, userId).pipe(
          tap(() =>
            this._productsStateSubject.next({
              ...state,
              products: state.products.filter(
                (product: ProductModel) => product.productId !== productId
              ),
            })
          )
        )
      )
    );
  }

  updateProduct(updatedProduct: ProductModel): Observable<void> {
    return combineLatest([
      this._userContext.getUserId(),
      this._productsState$,
    ]).pipe(
      take(1),
      switchMap(([userId, state]: [string, ProductsStateModel]) =>
        this._productsService.update(updatedProduct, userId).pipe(
          tap(() =>
            this._productsStateSubject.next({
              ...state,
              products: state.products.map((product: ProductModel) =>
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

  getCategoriesList(): Observable<string[]> {
    return this._productsCategoryService.getAll();
  }

  createCategory(category: string): Observable<void> {
    const formattedCategoryName = `${category.charAt(0).toUpperCase()}${category
      .slice(1)
      .toLowerCase()}`;
    return this._productsCategoryService.create(formattedCategoryName);
  }
}
