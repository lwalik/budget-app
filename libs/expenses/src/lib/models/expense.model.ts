import { ExpenseProductModel } from './expense-product.model';

export interface ExpenseModel {
  readonly product: ExpenseProductModel;
  readonly quantity: number;
  readonly pricePerUnit: number;
  readonly createdAt: Date;
}
