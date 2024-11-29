import { ExpenseModel } from '../models/expense.model';

export interface ReportPreviewViewModel {
  readonly expenses: ExpenseModel[];
  readonly totalCost: number;
  readonly selectedDates: {
    readonly from: Date;
    readonly to: Date;
  };
  readonly categoriesCostMap: Record<string, number>;
  readonly categoriesCost: {
    readonly category: string;
    readonly cost: number;
  }[];
  readonly selectedCategories: string[];
}
