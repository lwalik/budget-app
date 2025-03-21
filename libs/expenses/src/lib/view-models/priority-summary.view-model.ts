import { HighestExpenseProductViewModel } from './highest-expenses-product.view-model';

export interface PrioritySummaryViewModel {
  readonly totalCost: number;
  readonly highestExpenseProduct: HighestExpenseProductViewModel;
  readonly lastMonthDiff: number;
}
