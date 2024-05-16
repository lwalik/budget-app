import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, ReplaySubject, switchMap } from 'rxjs';
import { WalletsState } from '../../states/wallets.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-wallet-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet-name.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletNameComponent {
  @Input({ required: true }) set walletId(id: string) {
    this._walletIdSubject.next(id);
  }

  private readonly _walletIdSubject: ReplaySubject<string> =
    new ReplaySubject<string>();
  readonly walletName$: Observable<string | undefined> = this._walletIdSubject
    .asObservable()
    .pipe(
      switchMap((walletId: string) =>
        this._walletsState.getWalletName(walletId)
      )
    );

  constructor(private readonly _walletsState: WalletsState) {}
}
