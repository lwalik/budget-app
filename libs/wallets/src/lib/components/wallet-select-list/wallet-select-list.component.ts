import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SimpleSelectListComponent } from '@budget-app/shared';
import { BehaviorSubject, Observable, map, shareReplay, take, tap } from 'rxjs';
import { WalletModel } from '../../models/wallet.model';
import { WalletsState } from '../../states/wallets.state';
import { WalletSelectListItemViewModel } from '../../view-models/wallet-select-list-item.view-model';

@Component({
  selector: 'lib-wallet-select-list',
  standalone: true,
  imports: [SimpleSelectListComponent, CommonModule],
  templateUrl: './wallet-select-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSelectListComponent {
  @Input() set selectedOption(option: string | null) {
    this._selectedOptionSubject.next(option);
  }
  @Output() optionSelected: EventEmitter<WalletSelectListItemViewModel> =
    new EventEmitter<WalletSelectListItemViewModel>();

  private readonly _selectedOptionSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  readonly selectedOption$: Observable<string | null> =
    this._selectedOptionSubject.asObservable();

  readonly wallets$: Observable<WalletModel[]> = this._walletsState
    .getAllWallets()
    .pipe(shareReplay(1));
  readonly walletsName$: Observable<string[]> = this.wallets$.pipe(
    map((wallets: WalletModel[]) =>
      wallets.map((wallet: WalletModel) => wallet.name)
    )
  );

  constructor(private readonly _walletsState: WalletsState) {}

  onOptionSelected(event: string): void {
    this.wallets$
      .pipe(
        take(1),
        map((wallets: WalletModel[]) =>
          wallets.find((wallet: WalletModel) => wallet.name === event)
        ),
        tap((selectedWallet: WalletModel | undefined) => {
          if (!selectedWallet) {
            return;
          }

          this.optionSelected.emit({
            name: selectedWallet.name,
            id: selectedWallet.id,
            currency: selectedWallet.currency,
          });
        })
      )
      .subscribe();
  }
}
