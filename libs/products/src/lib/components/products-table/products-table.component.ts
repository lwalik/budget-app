import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  ConfirmationModalComponent,
  ConfirmationModalViewModel,
  PaginationComponent,
  PaginationUiService,
  PaginationViewModel,
  TranslationPipe,
} from '@budget-app/shared';
import {
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { ProductsState } from '../../states/products.state';
import { ProductFormModalComponent } from '../product-form-modal/product-form-modal.component';

@Component({
  selector: 'lib-products-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent, TranslationPipe],
  templateUrl: './products-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent {
  private readonly _pagination$: Observable<PaginationViewModel> =
    this._paginationUiService.getPagination();

  readonly allProducts$: Observable<ProductModel[]> = this._productsState
    .getAllProducts()
    .pipe(shareReplay(1));

  readonly products$: Observable<ProductModel[]> = combineLatest([
    this._pagination$,
    this.allProducts$,
  ]).pipe(
    map(([pagination, products]: [PaginationViewModel, ProductModel[]]) => {
      const start: number =
        pagination.current === 1
          ? 0
          : pagination.limit * (pagination.current - 1);
      const end: number = pagination.current * pagination.limit;
      return products.slice(start, end);
    })
  );

  constructor(
    private readonly _productsState: ProductsState,
    private readonly _dialog: Dialog,
    private readonly _paginationUiService: PaginationUiService
  ) {}

  onAddProductBtnClicked(): void {
    this._dialog.open(ProductFormModalComponent, {
      hasBackdrop: true,
      data: {
        isEdit: false,
      },
    });
  }

  onEditProductBtnClicked(product: ProductModel): void {
    this._dialog.open(ProductFormModalComponent, {
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

  onDeleteProductBtnClicked(product: ProductModel): void {
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
            ? this._productsState.deleteProduct(product.productId).pipe(take(1))
            : of(void 0)
        )
      )
      .subscribe();
  }
}
