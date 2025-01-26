import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ConfirmationModalComponent,
  ConfirmationModalViewModel,
  GET_TRANSLATION,
  GetTranslation,
  NotificationsService,
  PaginationComponent,
  PaginationUiService,
  PaginationViewModel,
  TranslationPipe,
} from '@budget-app/shared';
import {
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { ProductsState } from '../../states/products.state';
import { ProductFormModalComponent } from '../product-form-modal/product-form-modal.component';

@Component({
  selector: 'lib-products-table',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    TranslationPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './products-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent {
  private readonly _pagination$: Observable<PaginationViewModel> =
    this._paginationUiService.getPagination();

  readonly searchForm: FormControl = new FormControl('', {
    nonNullable: true,
  });

  readonly allProducts$: Observable<ProductModel[]> = combineLatest([
    this._productsState.getAllProducts(),
    this.searchForm.valueChanges.pipe(startWith('')),
  ]).pipe(
    shareReplay(1),
    map(([products, search]: [ProductModel[], string]) =>
      products
        .filter(
          (product: ProductModel) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a: ProductModel, b: ProductModel) => (a.name > b.name ? 1 : -1))
    )
  );

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
    private readonly _paginationUiService: PaginationUiService,
    private readonly _notificationsService: NotificationsService,
    @Inject(GET_TRANSLATION) private readonly _getTranslation: GetTranslation
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
    this._getTranslation
      .getAllTranslations([
        'Are you sure you want to remove',
        `"${product.name}"`,
        'product',
        '?',
      ])
      .pipe(
        take(1),
        map((translations: string[]) => {
          const dialogData: ConfirmationModalViewModel = {
            header: 'Confirm',
            text: translations.join(' '),
          };
          const dialogRef: DialogRef<boolean | undefined> = this._dialog.open<
            boolean | undefined
          >(ConfirmationModalComponent, {
            hasBackdrop: true,
            data: dialogData,
          });

          return dialogRef;
        }),
        switchMap((dialogRef: DialogRef<boolean | undefined>) =>
          dialogRef.closed.pipe(
            take(1),
            switchMap((isConfirmed: boolean | undefined) =>
              isConfirmed
                ? this._productsState.deleteProduct(product.productId).pipe(
                    take(1),
                    tap(() =>
                      this._notificationsService.openSuccessNotification(
                        'The product has been removed'
                      )
                    )
                  )
                : of(void 0)
            )
          )
        )
      )
      .subscribe({
        error: () => {
          this._notificationsService.openFailureNotification(
            'The product has not been removed',
            'Try again later'
          );
        },
      });
  }
}
