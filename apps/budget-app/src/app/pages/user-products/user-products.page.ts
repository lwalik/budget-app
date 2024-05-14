import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { OpenNewUserProductFormModalDirective } from '@budget-app/user-products';

@Component({
  standalone: true,
  imports: [OpenNewUserProductFormModalDirective],
  templateUrl: './user-products.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProductsPage {}
