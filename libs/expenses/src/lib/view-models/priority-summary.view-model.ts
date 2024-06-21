export interface PrioritySummaryViewModel {
  readonly totalCost: number;
  readonly highestExpenseProduct: HighestExpenseProductViewModel;
  readonly lastMonthDiff: number;
}

export interface HighestExpenseProductViewModel {
  readonly name: string;
  readonly price: number;
}
