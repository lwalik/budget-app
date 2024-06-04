import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { DeleteWalletExpensesDirective } from '@budget-app/expenses';
import { WalletsListComponent } from '@budget-app/wallets';

@Component({
  standalone: true,
  imports: [WalletsListComponent, DeleteWalletExpensesDirective],
  templateUrl: './wallets.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsPage {}
