import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  TransactionSummaryViewModel,
  TranslationPipe,
} from '@budget-app/shared';
import { Observable } from 'rxjs';
import { WalletsState } from '../../states/wallets.state';

@Component({
  selector: 'lib-incomes-summary-card',
  standalone: true,
  imports: [CommonModule, TranslationPipe],
  templateUrl: './incomes-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomesSummaryCardComponent {
  readonly depositSummary$: Observable<TransactionSummaryViewModel> =
    this._walletsState.getDepositSummary();

  constructor(private readonly _walletsState: WalletsState) {}
}
