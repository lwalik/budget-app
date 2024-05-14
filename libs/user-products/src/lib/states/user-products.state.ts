import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProductModel } from '../models/user-product.model';
import { UserProductsService } from '../services/user-products.service';

@Injectable({ providedIn: 'root' })
export class UserProductsState {
  constructor(private readonly _userProductsService: UserProductsService) {}

  addProduct(
    product: Omit<UserProductModel, 'productId'>,
    userId: string
  ): Observable<void> {
    return this._userProductsService.add(product, userId);
  }
}
