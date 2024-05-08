import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { WalletsListComponent } from '@budget-app/wallets';
import { AsyncPipe, JsonPipe, NgForOf } from '@angular/common';

@Component({
  standalone: true,
  imports: [WalletsListComponent, AsyncPipe, JsonPipe, NgForOf],
  templateUrl: './wallets.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletsPage {}
