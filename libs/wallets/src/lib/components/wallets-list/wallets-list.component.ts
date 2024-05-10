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
import { NewWalletFormComponent } from '../new-wallet-form/new-wallet-form.component';

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
    this._dialog.open(NewWalletFormComponent, {
      hasBackdrop: true,
    });
  }
}
