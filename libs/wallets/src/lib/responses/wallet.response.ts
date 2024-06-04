import { Timestamp } from 'firebase/firestore';
import { WalletDepositModel } from '../models/wallet-deposit.model';

export interface WalletResponse {
  readonly id: string;
  readonly ownerId: string;
  readonly name: string;
  readonly balance: number;
  readonly currency: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
  readonly deposits: WalletDepositModel[];
}
