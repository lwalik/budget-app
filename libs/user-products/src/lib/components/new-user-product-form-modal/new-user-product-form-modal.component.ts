import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import {
  SimpleInputFormComponent,
  SimpleModalComponent,
} from '@budget-app/shared';
import { switchMap, take } from 'rxjs';
import { UserProductsService } from '../../services/user-products.service';

@Component({
  selector: 'lib-new-user-product-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    SimpleModalComponent,
    ReactiveFormsModule,
    SimpleInputFormComponent,
  ],
  templateUrl: './new-user-product-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUserProductFormModalComponent {
  readonly newProductForm: FormGroup = new FormGroup({
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
    private readonly _userProductsService: UserProductsService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext,
    private readonly _dialogRef: DialogRef
  ) {}

  newProductFormSubmitted(form: FormGroup): void {
    this._userContext
      .getUserId()
      .pipe(
        take(1),
        switchMap((userId: string) =>
          this._userProductsService
            .add(
              {
                name: form.get('name')?.value,
                category: form.get('category')?.value.trim().toLowerCase(),
              },
              userId
            )
            .pipe(take(1))
        )
      )
      .subscribe(() => this._dialogRef.close());
  }
}
