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
import { take } from 'rxjs';
import { UserProductsState } from '../../states/user-products.state';
import { UserProductModel } from '../../models/user-product.model';

interface UserProductFormDialogData {
  readonly isEdit: boolean;
  readonly product?: UserProductModel;
}

@Component({
  selector: 'lib-user-product-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    SimpleModalComponent,
    ReactiveFormsModule,
    SimpleInputFormComponent,
    SelectAutocompleteListComponent,
  ],
  templateUrl: './user-product-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProductFormModalComponent implements OnInit {
  readonly header: string = this._dialogData.isEdit
    ? 'Update Product'
    : 'New Product';
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
    private readonly _userProductsState: UserProductsState,
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: UserProductFormDialogData
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
    const product: UserProductModel | undefined = this._dialogData.product;
    if (!this._dialogData.isEdit || !product) {
      this._userProductsState
        .addProduct({
          name: form.get('name')?.value,
          category: form.get('category')?.value.trim().toLowerCase(),
        })
        .pipe(take(1))
        .subscribe(() => this._dialogRef.close());
      return;
    }

    this._userProductsState
      .updateProduct({
        name: form.get('name')?.value,
        category: form.get('category')?.value.trim().toLowerCase(),
        productId: product.productId,
      })
      .pipe(take(1))
      .subscribe(() => this._dialogRef.close());
  }
}
