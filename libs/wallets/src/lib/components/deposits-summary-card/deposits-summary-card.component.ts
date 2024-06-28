import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { WalletsState } from '../../states/wallets.state';
import { Observable } from 'rxjs';
import { DepositsSummaryViewModel } from '../../view-models/deposits-summary.view-model';
import {
  EmotionTextDirective,
  PositiveNumberPipe,
  TranslationPipe,
} from '@budget-app/shared';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-deposits-summary-card',
  standalone: true,
  imports: [
    EmotionTextDirective,
    CommonModule,
    PositiveNumberPipe,
    TranslationPipe,
  ],
  templateUrl: './deposits-summary-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositsSummaryCardComponent {
  readonly summary$: Observable<DepositsSummaryViewModel | null> =
    this._walletsState.getDepositsSummary();

  constructor(private readonly _walletsState: WalletsState) {}
}
