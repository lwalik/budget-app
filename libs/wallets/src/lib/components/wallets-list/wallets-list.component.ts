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

@Component({
  selector: 'lib-wallets-list',
  standalone: true,
  imports: [CommonModule],
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
    private readonly _walletsService: WalletsService
  ) {}
}
