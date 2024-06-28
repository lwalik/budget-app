import { MostPopularWalletViewModel } from './most-popular-wallet.view-model';

export interface DepositsSummaryViewModel {
  readonly total: number;
  readonly mostPopularWallet: MostPopularWalletViewModel;
  readonly lastMonthDiff: number;
}
