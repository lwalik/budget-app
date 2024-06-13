export interface WalletSelectListItemViewModel {
  readonly name: string;
  readonly id: string | undefined;
  readonly currency: string;
  readonly balance: number;
}
