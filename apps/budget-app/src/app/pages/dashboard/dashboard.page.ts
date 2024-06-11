import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { DepositSummaryCardComponent } from '@budget-app/wallets';

@Component({
  standalone: true,
  imports: [DepositSummaryCardComponent],
  templateUrl: './dashboard.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
