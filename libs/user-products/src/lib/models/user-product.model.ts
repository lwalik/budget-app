import { USER_PRODUCT_CATEGORY } from '../enums/user-product-category.enum';

export interface UserProductModel {
  readonly name: string;
  readonly category: USER_PRODUCT_CATEGORY;
}
