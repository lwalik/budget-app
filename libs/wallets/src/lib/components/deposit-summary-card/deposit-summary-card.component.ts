import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { WalletsState } from '../../states/wallets.state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TransactionSummaryViewModel } from '@budget-app/shared';

@Component({
  selector: 'lib-deposit-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deposit-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositSummaryCardComponent {
  readonly depositSummary$: Observable<TransactionSummaryViewModel> =
    this._walletsState.getDepositTotal();

  constructor(private readonly _walletsState: WalletsState) {}
}
