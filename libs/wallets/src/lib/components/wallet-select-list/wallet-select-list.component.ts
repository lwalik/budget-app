import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SimpleSelectListComponent } from '@budget-app/shared';
import { CommonModule } from '@angular/common';
import { WalletSelectListItemViewModel } from '../../view-models/wallet-select-list-item.view-model';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import { WalletsService } from '../../services/wallets.service';
import { WalletModel } from '../../models/wallet.model';

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

  // TODO move getAll to state
  readonly wallets$: Observable<WalletModel[]> = this._userContext
    .getUserId()
    .pipe(
      switchMap((userId: string) =>
        this._walletsService.getAllUserWallets(userId)
      ),
      shareReplay(1)
    );
  readonly walletsName$: Observable<string[]> = this.wallets$.pipe(
    map((wallets: WalletModel[]) =>
      wallets.map((wallet: WalletModel) => wallet.name)
    )
  );

  constructor(
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    private readonly _walletsService: WalletsService
  ) {}

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
          });
        })
      )
      .subscribe();
  }
}
