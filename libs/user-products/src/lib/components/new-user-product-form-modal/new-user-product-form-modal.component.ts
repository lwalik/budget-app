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
  SimpleSelectInputComponent,
} from '@budget-app/shared';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { USER_PRODUCT_CATEGORY } from '../../enums/user-product-category.enum';
import { UserProductsService } from '../../services/user-products.service';

@Component({
  selector: 'lib-new-user-product-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    SimpleModalComponent,
    ReactiveFormsModule,
    SimpleInputFormComponent,
    SimpleSelectInputComponent,
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
  readonly categoryList: string[] = Object.values(USER_PRODUCT_CATEGORY);
  private readonly _isCategoryDropdownVisibleSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isCategoryDropdownVisible$: Observable<boolean> =
    this._isCategoryDropdownVisibleSubject.asObservable();

  constructor(
    private readonly _userProductsService: UserProductsService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext
  ) {}

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownVisible$
      .pipe(
        take(1),
        tap((isVisible: boolean) =>
          this._isCategoryDropdownVisibleSubject.next(!isVisible)
        )
      )
      .subscribe();
  }

  newProductFormSubmitted(form: FormGroup): void {
    console.log('category: ', form.get('category')?.value);
    // this._userContext
    //   .getUserId()
    //   .pipe(
    //     take(1),
    //     switchMap((userId: string) =>
    //       this._userProductsService
    //         .add(
    //           {
    //             name: 'test 1',
    //             category: USER_PRODUCT_CATEGORY.FOOD,
    //           },
    //           userId
    //         )
    //         .pipe(take(1))
    //     )
    //   )
    //   .subscribe();
  }
}
