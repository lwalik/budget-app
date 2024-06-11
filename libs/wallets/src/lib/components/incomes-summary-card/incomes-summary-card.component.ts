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
  selector: 'lib-incomes-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incomes-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomesSummaryCardComponent {
  readonly depositSummary$: Observable<TransactionSummaryViewModel> =
    this._walletsState.getDepositSummary();

  constructor(private readonly _walletsState: WalletsState) {}
}
