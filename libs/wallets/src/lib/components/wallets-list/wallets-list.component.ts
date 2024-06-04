import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ConfirmationModalComponent,
  ConfirmationModalViewModel,
} from '@budget-app/shared';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { WalletModel } from '../../models/wallet.model';
import { WalletsState } from '../../states/wallets.state';
import { DepositFormModalComponent } from '../deposit-form-modal/deposit-form-modal.component';
import { NewWalletFormModalComponent } from '../new-wallet-form-modal/new-wallet-form-modal.component';

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

  @Output() walletRemoved: EventEmitter<string> = new EventEmitter<string>();

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

  onRemoveWalletBtnClicked(wallet: WalletModel): void {
    const dialogData: ConfirmationModalViewModel = {
      header: 'Confirm',
      text: `Are you sure you want to remove "${wallet.name}" Wallet?\nThis will remove all expenses associated with this Wallet.`,
    };
    const dialogRef: DialogRef<boolean | undefined> = this._dialog.open<
      boolean | undefined
    >(ConfirmationModalComponent, {
      hasBackdrop: true,
      data: dialogData,
    });

    dialogRef.closed
      .pipe(
        take(1),
        switchMap((isConfirmed: boolean | undefined) =>
          isConfirmed
            ? this._walletsState.deleteWallet(wallet.id).pipe(
                take(1),
                tap(() => this.walletRemoved.emit(wallet.id))
              )
            : of(void 0)
        )
      )
      .subscribe();
  }
}
