import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import { Observable, switchMap } from 'rxjs';
import { WalletModel } from '../../models/wallet.model';
import { WalletsService } from '../../services/wallets.service';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NewWalletFormModalComponent } from '../new-wallet-form-modal/new-wallet-form-modal.component';
import { DepositFormModalComponent } from '../deposit-form-modal/deposit-form-modal.component';
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
  readonly wallets$: Observable<WalletModel[]> = this._userContext
    .getUserId()
    .pipe(
      switchMap((userId: string) =>
        this._walletsService.getAllUserWallets(userId)
      )
    );
  constructor(
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    private readonly _walletsService: WalletsService,
    private readonly _dialog: Dialog
  ) {}

  onNewWalletBtnClicked(): void {
    this._dialog.open(NewWalletFormModalComponent, {
      hasBackdrop: true,
    });
  }

  onDepositBtnClicked(walletId: string, balance: number): void {
    this._dialog.open(DepositFormModalComponent, {
      hasBackdrop: true,
      data: {
        walletId,
        balance,
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
