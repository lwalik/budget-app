import { Timestamp } from 'firebase/firestore';

export interface WalletResponse {
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly balance: number;
  readonly currency: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
  readonly deposits: WalletDepositResponse[];
}

export interface WalletDepositResponse {
  readonly value: number;
  readonly createdAt: Timestamp;
}
