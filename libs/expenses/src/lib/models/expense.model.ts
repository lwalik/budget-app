import { ExpenseProductModel } from './expense-product.model';

export interface ExpenseModel {
  readonly id: string;
  readonly ownerId: string;
  readonly walletId: string;
  readonly products: ExpenseProductModel[];
  readonly totalPrice: number;
  readonly currency: string;
  readonly createdAt: Date;
}
