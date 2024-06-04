import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SelectAutocompleteListComponent,
  SimpleInputFormComponent,
  SimpleModalComponent,
} from '@budget-app/shared';
import { Observable, of, shareReplay, switchMap, take, tap } from 'rxjs';
import { ProductsState } from '../../states/products.state';
import { ProductModel } from '../../models/product.model';

interface ProductFormDialogData {
  readonly isEdit: boolean;
  readonly product?: ProductModel;
}

@Component({
  selector: 'lib-product-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    SimpleModalComponent,
    ReactiveFormsModule,
    SimpleInputFormComponent,
    SelectAutocompleteListComponent,
  ],
  templateUrl: './product-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormModalComponent implements OnInit {
  readonly header: string = this._dialogData.isEdit
    ? 'Update Product'
    : 'New Product';

  readonly categoryList$: Observable<string[]> = this._productsState
    .getCategoriesList()
    .pipe(shareReplay(1));

  readonly productForm: FormGroup = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly _productsState: ProductsState,
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: ProductFormDialogData
  ) {}

  ngOnInit(): void {
    if (!this._dialogData.isEdit || !this._dialogData.product) {
      return;
    }

    this.productForm.patchValue({
      name: this._dialogData.product.name,
      category: this._dialogData.product.category,
    });
  }

  productFormSubmitted(form: FormGroup): void {
    const product: ProductModel | undefined = this._dialogData.product;
    if (!this._dialogData.isEdit || !product) {
      this._productsState
        .addProduct({
          name: form.get('name')?.value,
          category: form.get('category')?.value.trim().toLowerCase(),
        })
        .pipe(take(1))
        .subscribe(() => this._dialogRef.close());
      return;
    }

    this._productsState
      .updateProduct({
        name: form.get('name')?.value,
        category: form.get('category')?.value.trim().toLowerCase(),
        productId: product.productId,
      })
      .pipe(take(1))
      .subscribe(() => this._dialogRef.close());
  }

  onCategoryOptionSelected(option: string): void {
    this.categoryList$
      .pipe(
        take(1),
        tap(() =>
          this.productForm.patchValue({
            category: option,
          })
        ),
        switchMap((list: string[]) =>
          list
            .map((item: string) => item.toLowerCase())
            .includes(option.toLowerCase())
            ? of(void 0)
            : this._productsState.createCategory(option)
        )
      )
      .subscribe(() => this.productForm.get('category')?.markAsPristine());
  }
}
