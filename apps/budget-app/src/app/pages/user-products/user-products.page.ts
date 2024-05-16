import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { UserProductsTableComponent } from '@budget-app/user-products';

@Component({
  standalone: true,
  imports: [UserProductsTableComponent],
  templateUrl: './user-products.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProductsPage {}
