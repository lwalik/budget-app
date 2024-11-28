import { ExpenseModel } from '../models/expense.model';

export interface ReportPreviewViewModel {
  readonly expenses: ExpenseModel[];
  readonly totalCost: number;
  readonly selectedDates: {
    readonly from: Date;
    readonly to: Date;
  };
}
