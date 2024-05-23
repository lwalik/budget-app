import { EXPENSE_PRODUCT_PRIORITY } from '../enums/expense-product-priority.enum';

export interface ExpenseProductModel {
  readonly name: string;
  readonly category: string;
  readonly quantity: number;
  readonly price: number;
  readonly priority: EXPENSE_PRODUCT_PRIORITY;
}
