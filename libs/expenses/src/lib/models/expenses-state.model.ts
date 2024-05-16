import { ExpenseModel } from './expense.model';

export interface ExpensesStateModel {
  readonly expenses: ExpenseModel[];
}
