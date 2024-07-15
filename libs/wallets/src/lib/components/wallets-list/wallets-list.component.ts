import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ConfirmationModalComponent,
  ConfirmationModalViewModel,
  GET_TRANSLATION,
  GetTranslation,
  NotificationsService,
  TranslationPipe,
} from '@budget-app/shared';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
import { WalletModel } from '../../models/wallet.model';
import { WalletsState } from '../../states/wallets.state';
import { DepositFormModalComponent } from '../deposit-form-modal/deposit-form-modal.component';
import { NewWalletFormModalComponent } from '../new-wallet-form-modal/new-wallet-form-modal.component';
import { TransferFormModalComponent } from '../transfer-form-modal/transfer-form-modal.component';

@Component({
  selector: 'lib-wallets-list',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslationPipe],
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
    private readonly _dialog: Dialog,
    @Inject(GET_TRANSLATION) private readonly _getTranslation: GetTranslation,
    private readonly _notificationsService: NotificationsService
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

  onTransferBtnClicked(wallet: WalletModel): void {
    this._dialog.open(TransferFormModalComponent, {
      hasBackdrop: true,
      data: {
        walletId: wallet.id,
        balance: wallet.balance,
      },
    });
  }

  onRemoveWalletBtnClicked(wallet: WalletModel): void {
    this._getTranslation
      .getAllTranslations([
        'Are you sure you want to remove',
        `"${wallet.name}"`,
        'Wallet',
        '?',
        '\n',
        'This will remove all expenses associated with this Wallet.',
      ])
      .pipe(
        take(1),
        map((translations: string[]) => {
          const dialogData: ConfirmationModalViewModel = {
            header: 'Confirm',
            text: translations.join(' '),
          };

          const dialogRef: DialogRef<boolean | undefined> = this._dialog.open<
            boolean | undefined
          >(ConfirmationModalComponent, {
            hasBackdrop: true,
            data: dialogData,
          });

          return dialogRef;
        }),
        switchMap((dialogRef: DialogRef<boolean | undefined>) =>
          dialogRef.closed.pipe(
            take(1),
            switchMap((isConfirmed: boolean | undefined) =>
              isConfirmed
                ? this._walletsState.deleteWallet(wallet.id).pipe(
                    take(1),
                    tap(() => {
                      this.walletRemoved.emit(wallet.id);
                      this._notificationsService.openSuccessNotification(
                        'The wallet has been removed'
                      );
                    })
                  )
                : of(void 0)
            )
          )
        )
      )
      .subscribe({
        error: () => {
          this._notificationsService.openFailureNotification(
            'The wallet has not been removed',
            'Try again later'
          );
        },
      });
  }
}
