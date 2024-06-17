import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ProductsTableComponent } from '@budget-app/products';
import { PaginationUiServiceModule } from '@budget-app/shared';

@Component({
  standalone: true,
  imports: [ProductsTableComponent, PaginationUiServiceModule],
  templateUrl: './products.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage {}
