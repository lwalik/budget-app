import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { WalletsListComponent } from '@budget-app/wallets';

@Component({
  standalone: true,
  imports: [WalletsListComponent],
  templateUrl: './wallets.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsPage {}
