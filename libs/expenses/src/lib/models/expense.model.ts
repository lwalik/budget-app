import { ExpenseProductModel } from './expense-product.model';

export interface ExpenseModel {
  readonly id: string;
  readonly ownerId: string;
  readonly products: ExpenseProductModel[];
  readonly totalPrice: number;
  readonly createdAt: Date;
}
