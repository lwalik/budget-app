import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SimpleInputFormComponent,
  SimpleModalComponent,
  SimplePaginationViewModel,
} from '@budget-app/shared';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import {
  UserProductSelectListItemViewModel,
  UserProductsSelectListComponent,
} from '@budget-app/user-products';

interface ExpenseFormDialogData {
  readonly isEdit: boolean;
}

@Component({
  selector: 'lib-expense-form-modal',
  standalone: true,
  imports: [
    SimpleModalComponent,
    ReactiveFormsModule,
    SimpleInputFormComponent,
    CommonModule,
    UserProductsSelectListComponent,
  ],
  templateUrl: './expense-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseFormModalComponent {
  readonly header: string = this._dialogData.isEdit
    ? 'Update Expense'
    : 'New Expense';

  private readonly _paginationSubject: BehaviorSubject<SimplePaginationViewModel> =
    new BehaviorSubject<SimplePaginationViewModel>({
      lastPageIdx: 0,
      currentIdx: 0,
    });
  readonly pagination$: Observable<SimplePaginationViewModel> =
    this._paginationSubject.asObservable();

  readonly expenseForm: FormGroup = new FormGroup({
    wallet: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    products: new FormArray([
      new FormGroup({
        name: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        category: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        price: new FormControl(0, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0)],
        }),
        quantity: new FormControl(0, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0)],
        }),
      }),
    ]),
  });

  constructor(
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: ExpenseFormDialogData
  ) {}

  getProductControl(idx: number): FormGroup {
    const productFormArray: FormArray = this._getProductsFormArray();
    return productFormArray.at(idx) as FormGroup;
  }

  onNextBtnClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        tap((subject: SimplePaginationViewModel) => {
          if (subject.currentIdx + 1 > subject.lastPageIdx) {
            return;
          }

          this._paginationSubject.next({
            ...subject,
            currentIdx: subject.currentIdx + 1,
          });
        })
      )
      .subscribe();
  }

  onPrevBtnClicked(): void {
    this.pagination$
      .pipe(
        take(1),
        tap((subject: SimplePaginationViewModel) => {
          if (subject.currentIdx - 1 < 0) {
            return;
          }

          this._paginationSubject.next({
            ...subject,
            currentIdx: subject.currentIdx - 1,
          });
        })
      )
      .subscribe();
  }

  addProductControl(): void {
    const productsFormArray: FormArray = this._getProductsFormArray();

    const productForm: FormGroup = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      category: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      quantity: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
    });

    this.pagination$
      .pipe(
        take(1),
        tap(() => productsFormArray.push(productForm)),
        tap((subject: SimplePaginationViewModel) => {
          this._paginationSubject.next({
            ...subject,
            currentIdx: Math.min(
              subject.lastPageIdx + 1,
              subject.currentIdx + 1
            ),
            lastPageIdx: subject.lastPageIdx + 1,
          });
        })
      )
      .subscribe();
  }

  removeProductControl(): void {
    const productsFormArray: FormArray = this._getProductsFormArray();

    this.pagination$
      .pipe(
        take(1),
        tap((subject: SimplePaginationViewModel) => {
          productsFormArray.removeAt(subject.currentIdx);
        }),
        tap((subject: SimplePaginationViewModel) => {
          this._paginationSubject.next({
            ...subject,
            currentIdx: Math.max(0, subject.currentIdx - 1),
            lastPageIdx: subject.lastPageIdx - 1,
          });
        })
      )
      .subscribe();
  }

  onOptionSelected(
    event: UserProductSelectListItemViewModel,
    control: FormGroup
  ): void {
    control.patchValue({
      name: event.name,
      category: event.category,
    });
  }

  onExpenseFormSubmitted(form: FormGroup): void {
    console.log('submit ? form: ', form);
  }

  private _getProductsFormArray(): FormArray {
    return this.expenseForm.get('products') as FormArray;
  }
}
