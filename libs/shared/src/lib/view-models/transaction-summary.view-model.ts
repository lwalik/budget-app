export interface TransactionSummaryViewModel {
  readonly total: number;
  readonly currency: string;
  readonly diffSinceLastRangeInPercentage: number;
}
