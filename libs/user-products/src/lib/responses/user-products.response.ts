import { UserProductModel } from '../models/user-product.model';

export interface UserProductsResponse {
  readonly products: UserProductModel[];
}
