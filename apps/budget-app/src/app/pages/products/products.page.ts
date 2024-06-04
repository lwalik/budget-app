import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ProductsTableComponent } from '@budget-app/products';

@Component({
  standalone: true,
  imports: [ProductsTableComponent],
  templateUrl: './products.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {}
