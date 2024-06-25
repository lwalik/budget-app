import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  DashboardFiltersState,
  DashboardFiltersWalletStateModel,
  TranslationPipe,
  WalletSelectListItemViewModel,
} from '@budget-app/shared';
import { Observable } from 'rxjs';
import { WalletSelectListComponent } from '../wallet-select-list/wallet-select-list.component';

@Component({
  selector: 'lib-wallet-select-dashboard-filter',
  standalone: true,
  imports: [WalletSelectListComponent, CommonModule, TranslationPipe],
  templateUrl: './wallet-select-dashboard-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSelectDashboardFilterComponent {
  readonly selectedWallet$: Observable<DashboardFiltersWalletStateModel> =
    this._dashboardFiltersState.getSelectedWallet();

  constructor(private readonly _dashboardFiltersState: DashboardFiltersState) {}

  onWalletSelected(event: WalletSelectListItemViewModel): void {
    this._dashboardFiltersState
      .setSelectedWallet({
        id: event.id,
        name: event.name,
      })
      .subscribe();
  }
}
