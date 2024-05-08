export interface WalletModel {
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly balance: number;
  readonly currency: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
