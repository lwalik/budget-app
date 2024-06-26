import { HighestExpenseProductViewModel } from './highest-expenses-product.view-model';

export interface CategorySummaryViewModel {
  readonly totalCost: number;
  readonly name: string;
  readonly highestExpensesProduct: HighestExpenseProductViewModel;
  readonly lastMonthDiff: number;
}
