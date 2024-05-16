import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, of, switchMap, take } from 'rxjs';
import { UserProductModel } from '../../models/user-product.model';
import { UserProductsState } from '../../states/user-products.state';
import { NewUserProductFormModalComponent } from '../new-user-product-form-modal/new-user-product-form-modal.component';
import {
  ConfirmationModalComponent,
  ConfirmationModalViewModel,
} from '@budget-app/shared';

@Component({
  selector: 'lib-user-products-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-products-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProductsTableComponent {
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

  onDeleteProductBtnClicked(product: UserProductModel): void {
    const dialogData: ConfirmationModalViewModel = {
      header: 'Confirm',
      text: `Are you sure you want to remove "${product.name}" Product?`,
    };
    const dialogRef: DialogRef<boolean | undefined> = this._dialog.open<
      boolean | undefined
    >(ConfirmationModalComponent, {
      hasBackdrop: true,
      data: dialogData,
    });
    dialogRef.closed
      .pipe(
        take(1),
        switchMap((isConfirmed: boolean | undefined) =>
          isConfirmed
            ? this._userProductsState
                .deleteProduct(product.productId)
                .pipe(take(1))
            : of(void 0)
        )
      )
      .subscribe();
  }
}
