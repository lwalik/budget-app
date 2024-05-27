import { ExpenseProductModel } from './expense-product.model';

export interface ExpenseModel {
  readonly expenseId: string;
  readonly walletId: string;
  readonly products: ExpenseProductModel[];
  readonly totalPrice: number;
  readonly currency: string;
  readonly createdAt: Date;
}
