import { ExpenseProductModel } from '../models/expense-product.model';
import firebase from 'firebase/compat';
import Timestamp = firebase.firestore.Timestamp;

export interface ExpenseResponse {
  readonly id: string;
  readonly ownerId: string;
  readonly products: ExpenseProductModel[];
  readonly totalPrice: number;
  readonly createdAt: Timestamp;
}
