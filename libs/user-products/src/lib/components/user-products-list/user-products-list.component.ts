import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, take } from 'rxjs';
import { UserProductModel } from '../../models/user-product.model';
import { UserProductsState } from '../../states/user-products.state';
import { NewUserProductFormModalComponent } from '../new-user-product-form-modal/new-user-product-form-modal.component';

@Component({
  selector: 'lib-user-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-products-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProductsListComponent {
  readonly products$: Observable<UserProductModel[]> =
    this._userProductsState.getProducts();

  constructor(
    private readonly _userProductsState: UserProductsState,
    private readonly _dialog: Dialog
  ) {}

  onAddProductBtnClicked(): void {
    this._dialog.open(NewUserProductFormModalComponent, {
      hasBackdrop: true,
      data: {
        isEdit: false,
      },
    });
  }

  onEditProductBtnClicked(product: UserProductModel): void {
    this._dialog.open(NewUserProductFormModalComponent, {
      hasBackdrop: true,
      data: {
        isEdit: true,
        product: {
          name: product.name,
          category: product.category,
          productId: product.productId,
        },
      },
    });
  }

  onDeleteProductBtnClicked(productId: string): void {
    this._userProductsState.deleteProduct(productId).pipe(take(1)).subscribe();
  }
}
