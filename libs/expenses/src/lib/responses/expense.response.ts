// import firebase from 'firebase/compat';
import { ExpenseProductModel } from '../models/expense-product.model';
// import Timestamp = firebase.firestore.Timestamp;
import { Timestamp } from 'firebase/firestore';

export interface UserExpenseResponse {
  readonly expenses: ExpenseResponse[];
}

export interface ExpenseResponse {
  readonly id: string;
  readonly expenseId: string;
  readonly walletId: string;
  readonly products: ExpenseProductModel[];
  readonly totalPrice: number;
  readonly currency: string;
  readonly createdAt: Timestamp;
}
