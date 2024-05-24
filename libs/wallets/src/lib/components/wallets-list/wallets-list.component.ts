import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { WalletModel } from '../../models/wallet.model';
import { WalletsState } from '../../states/wallets.state';
import { DepositFormModalComponent } from '../deposit-form-modal/deposit-form-modal.component';
import { NewWalletFormModalComponent } from '../new-wallet-form-modal/new-wallet-form-modal.component';
import { WithdrawFormModalComponent } from '../withdraw-form-modal/withdraw-form-modal.component';

@Component({
  selector: 'lib-wallets-list',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './wallets-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsListComponent {
  readonly wallets$: Observable<WalletModel[]> =
    this._walletsState.getAllWallets();

  constructor(
    private readonly _walletsState: WalletsState,
    private readonly _dialog: Dialog
  ) {}

  onNewWalletBtnClicked(): void {
    this._dialog.open(NewWalletFormModalComponent, {
      hasBackdrop: true,
    });
  }

  onDepositBtnClicked(walletId: string): void {
    this._dialog.open(DepositFormModalComponent, {
      hasBackdrop: true,
      data: {
        walletId,
      },
    });
  }

  onWithdrawBtnClicked(walletId: string, balance: number): void {
    this._dialog.open(WithdrawFormModalComponent, {
      hasBackdrop: true,
      data: {
        walletId,
        balance,
      },
    });
  }
}
