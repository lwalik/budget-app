import { ExpenseProductModel } from './expense-product.model';

export interface ExpenseModel {
  readonly id: string;
  readonly ownerId: string;
  readonly product: ExpenseProductModel;
  readonly quantity: number;
  readonly pricePerUnit: number;
  readonly createdAt: Date;
}
