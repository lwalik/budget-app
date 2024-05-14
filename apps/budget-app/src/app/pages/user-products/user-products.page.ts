import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { UserProductsListComponent } from '@budget-app/user-products';

@Component({
  standalone: true,
  imports: [UserProductsListComponent],
  templateUrl: './user-products.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProductsPage {}
