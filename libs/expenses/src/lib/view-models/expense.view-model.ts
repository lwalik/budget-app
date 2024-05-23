import { EXPENSE_PRODUCT_PRIORITY } from '../enums/expense-product-priority.enum';

export interface ExpenseViewModel {
  readonly id: string;
  readonly walletId: string;
  readonly products: ExpenseProductViewModel[];
  readonly totalPrice: number;
  readonly currency: string;
  readonly createdAt: Date;
}

interface ExpenseProductViewModel {
  readonly name: string;
  readonly quantity: number;
  readonly totalPrice: number;
  readonly priority: EXPENSE_PRODUCT_PRIORITY;
}
