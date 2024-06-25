import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { WalletsState } from '../../states/wallets.state';
import { CurrentBalanceViewModel } from '../../view-models/current-balance.view-model';
import { TranslationPipe } from '@budget-app/shared';

@Component({
  selector: 'lib-current-balance-card',
  standalone: true,
  imports: [CommonModule, TranslationPipe],
  templateUrl: './current-balance-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentBalanceCardComponent {
  readonly currentBalance$: Observable<CurrentBalanceViewModel> =
    this._walletsState.getCurrentBalance();

  constructor(private readonly _walletsState: WalletsState) {}
}
