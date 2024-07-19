import { ExpenseModel } from './expense.model';
import { ProductReportConfigurationStateModel } from './product-report-configuration-state.model';

export interface ExpensesStateModel {
  readonly expenses: ExpenseModel[];
  readonly reportConfiguration:
    | ProductReportConfigurationStateModel
    | undefined;
}
