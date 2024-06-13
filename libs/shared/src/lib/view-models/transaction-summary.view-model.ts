export interface TransactionSummaryViewModel {
  readonly total: number;
  readonly currency: string;
  readonly diffSinceLastRange: number;
  readonly diffDaysCount: number;
}
