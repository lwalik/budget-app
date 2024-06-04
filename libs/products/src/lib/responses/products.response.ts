import { ProductModel } from '../models/product.model';

export interface ProductsResponse {
  readonly products: ProductModel[];
}
