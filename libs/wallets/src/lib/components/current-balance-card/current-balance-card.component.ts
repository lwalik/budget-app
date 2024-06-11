import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { WalletsState } from '../../states/wallets.state';
import { Observable } from 'rxjs';
import { CurrentBalanceViewModel } from '../../view-models/current-balance.view-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-current-balance-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-balance-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentBalanceCardComponent {
  readonly currentBalance$: Observable<CurrentBalanceViewModel> =
    this._walletsState.getCurrentBalance();

  constructor(private readonly _walletsState: WalletsState) {}
}
