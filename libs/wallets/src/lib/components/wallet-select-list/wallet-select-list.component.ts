import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  SimpleSelectListComponent,
  WalletSelectListItemViewModel,
} from '@budget-app/shared';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { WalletModel } from '../../models/wallet.model';
import { WalletsState } from '../../states/wallets.state';

@Component({
  selector: 'lib-wallet-select-list',
  standalone: true,
  imports: [SimpleSelectListComponent, CommonModule],
  templateUrl: './wallet-select-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSelectListComponent {
  @Input() label = '';
  @Input() excludedIds: string[] = [];
  @Input() set allOptionAvailable(value: boolean) {
    this._allOptionAvailableSubject.next(value);
  }
  @Input() set initialValueId(id: string | undefined) {
    if (!id) {
      return;
    }

    this.wallets$
      .pipe(
        take(1),
        tap((wallets: WalletModel[]) => {
          const selectedWallet: WalletModel | undefined = wallets.find(
            (wallet: WalletModel) => wallet.id === id
          );

          if (!selectedWallet) {
            return;
          }

          this.optionSelected.emit({
            name: selectedWallet.name,
            id: selectedWallet.id,
            currency: selectedWallet.currency,
            balance: selectedWallet.balance,
          });
        })
      )
      .subscribe();
  }
  @Input() set selectedOption(option: string | null) {
    this._selectedOptionSubject.next(option);
  }
  @Output() optionSelected: EventEmitter<WalletSelectListItemViewModel> =
    new EventEmitter<WalletSelectListItemViewModel>();

  private readonly _selectedOptionSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  readonly selectedOption$: Observable<string | null> =
    this._selectedOptionSubject.asObservable();
  private readonly _allOptionAvailableSubject: ReplaySubject<boolean> =
    new ReplaySubject<boolean>(1);
  readonly allOptionAvailable$: Observable<boolean> =
    this._allOptionAvailableSubject.asObservable().pipe(shareReplay(1));

  readonly wallets$: Observable<WalletModel[]> = this._walletsState
    .getAllWallets()
    .pipe(shareReplay(1));
  readonly walletsName$: Observable<string[]> = combineLatest([
    this.wallets$,
    this.allOptionAvailable$,
  ]).pipe(
    map(([wallets, allOptionAvailable]: [WalletModel[], boolean]) => {
      console.log('Test: ', this.excludedIds);
      const walletsName: string[] = wallets.reduce(
        (acc: string[], cur: WalletModel) =>
          !this.excludedIds.includes(cur.id) ? [...acc, cur.name] : acc,
        []
      );

      if (allOptionAvailable) {
        return ['All', ...walletsName];
      }

      return walletsName;
    })
  );

  constructor(private readonly _walletsState: WalletsState) {}

  onOptionSelected(event: string): void {
    this.wallets$
      .pipe(
        take(1),
        map((wallets: WalletModel[]) =>
          wallets.find((wallet: WalletModel) => wallet.name === event)
        ),
        switchMap((selectedWallet: WalletModel | undefined) =>
          this.allOptionAvailable$.pipe(
            take(1),
            tap((allOptionAvailable: boolean) => {
              if (selectedWallet) {
                this.optionSelected.emit({
                  name: selectedWallet.name,
                  id: selectedWallet.id,
                  currency: selectedWallet.currency,
                  balance: selectedWallet.balance,
                });
                return;
              }

              if (allOptionAvailable) {
                this.optionSelected.emit({
                  name: event,
                  id: undefined,
                  currency: 'PLN',
                  balance: 0,
                });
                return;
              }
            })
          )
        )
      )
      .subscribe();
  }
}
