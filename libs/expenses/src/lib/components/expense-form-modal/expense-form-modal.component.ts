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
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ProductSelectListItemViewModel,
  ProductsSelectListComponent,
} from '@budget-app/products';
import {
  LoadingComponent,
  NotificationsService,
  SimpleInputFormComponent,
  SimpleModalComponent,
  SimplePaginationViewModel,
  SimpleSelectListComponent,
  SpinnerComponent,
  TranslationPipe,
  WalletSelectListItemViewModel,
  formatDateToString,
} from '@budget-app/shared';
import { WalletSelectListComponent } from '@budget-app/wallets';
import { BehaviorSubject, Observable, map, of, take, tap } from 'rxjs';
import { EXPENSE_PRODUCT_PRIORITY } from '../../enums/expense-product-priority.enum';
import { ExpenseProductModel } from '../../models/expense-product.model';
import { ExpenseModel } from '../../models/expense.model';
import { ExpensesState } from '../../states/expenses.state';
import { availableBalanceValidator } from '../../validators/available-balance.validator';

interface ExpenseFormDialogData {
  readonly isEdit: boolean;
  readonly expense?: ExpenseModel;
}
@Component({
  selector: 'lib-expense-form-modal',
  standalone: true,
  imports: [
    SimpleModalComponent,
    ReactiveFormsModule,
    SimpleInputFormComponent,
    CommonModule,
    ProductsSelectListComponent,
    WalletSelectListComponent,
    SimpleSelectListComponent,
    TranslationPipe,
    SpinnerComponent,
  ],
  templateUrl: './expense-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseFormModalComponent
  extends LoadingComponent
  implements OnInit
{
  readonly header: string = this.dialogData.isEdit
    ? 'Update Expense'
    : 'New Expense';

  private readonly _paginationSubject: BehaviorSubject<SimplePaginationViewModel> =
    new BehaviorSubject<SimplePaginationViewModel>({
      lastPageIdx: 0,
      currentIdx: 0,
    });
  readonly pagination$: Observable<SimplePaginationViewModel> =
    this._paginationSubject.asObservable();

  readonly priorityList$: Observable<string[]> = of(
    Object.values(EXPENSE_PRODUCT_PRIORITY)
  );

  readonly expenseForm: FormGroup = new FormGroup(
    {
      wallet: new FormGroup({
        name: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        id: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        currency: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        balance: new FormControl(0, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      products: new FormArray([]),
      createdAt: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      prevTotalPrice: new FormControl(0, {
        nonNullable: true,
      }),
    },
    availableBalanceValidator
  );

  constructor(
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    readonly dialogData: ExpenseFormDialogData,
    private readonly _expenseState: ExpensesState,
    private readonly _notificationsService: NotificationsService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.dialogData.isEdit || !this.dialogData.expense) {
      this._addProductControl();
      return;
    }

    const expense: ExpenseModel = this.dialogData.expense;

    const createdAtFormControl: FormControl = this.expenseForm.get(
      'createdAt'
    ) as FormControl;

    createdAtFormControl.patchValue(formatDateToString(expense.createdAt));

    const prevTotalPriceControl: FormControl = this.expenseForm.get(
      'prevTotalPrice'
    ) as FormControl;
    prevTotalPriceControl.patchValue(expense.totalPrice);

    expense.products.forEach((product) => this._addProductControl(product));
    this._changePaginationPagesCount(expense.products.length - 1).subscribe();
  }

  get walletNameFormControl(): FormControl {
    return this._getWalletFormGroup().get('name') as FormControl;
  }

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
    this._addProductControl();

    this._changePaginationPagesCount(1).subscribe();
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

  onProductOptionSelected(
    event: ProductSelectListItemViewModel,
    control: FormGroup
  ): void {
    control.patchValue({
      name: event.name,
      category: event.category,
    });
  }

  onWalletOptionSelected(event: WalletSelectListItemViewModel): void {
    const walletFormGroup: FormGroup = this._getWalletFormGroup();
    walletFormGroup.patchValue({
      name: event.name,
      id: event.id,
      currency: event.currency,
      balance: event.balance,
    });
  }

  onPriorityOptionSelected(event: string, control: FormGroup): void {
    control.patchValue({
      priority: event,
    });
  }

  onExpenseFormSubmitted(): void {
    const products: ExpenseProductModel[] = this._getProductsFormArray().value;
    const mappedProducts: ExpenseProductModel[] = products.map((product) => ({
      ...product,
      price: +product.price,
      quantity: +product.quantity,
    }));

    this.setLoading(true);

    if (!this.dialogData.isEdit || !this.dialogData.expense) {
      this._expenseState
        .addExpense({
          walletId: this._getWalletFormGroup().get('id')?.value,
          products: mappedProducts,
          totalPrice: products.reduce(
            (total: number, product: ExpenseProductModel) =>
              total + product.price * product.quantity,
            0
          ),
          currency: this._getWalletFormGroup().get('currency')?.value,
          createdAt: new Date(this.expenseForm.get('createdAt')?.value),
        })
        .pipe(take(1))
        .subscribe({
          complete: () => {
            this._notificationsService.openSuccessNotification(
              'The expense has been added'
            );
            this.setLoading(false);
            this._dialogRef.close();
          },
          error: () => {
            this.setLoading(false);
            this._dialogRef.close();
          },
        });
      return;
    }

    this._expenseState
      .updateExpense({
        expenseId: this.dialogData.expense.expenseId,
        createdAt: new Date(this.expenseForm.get('createdAt')?.value),
        walletId: this._getWalletFormGroup().get('id')?.value,
        products: mappedProducts,
        totalPrice: products.reduce(
          (total: number, product: ExpenseProductModel) =>
            total + product.price * product.quantity,
          0
        ),
        currency: this._getWalletFormGroup().get('currency')?.value,
      })
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this._notificationsService.openSuccessNotification(
            'The expense has been edited'
          );
          this.setLoading(false);
          this._dialogRef.close();
        },
        error: () => {
          this.setLoading(false);
          this._dialogRef.close();
        },
      });
  }

  private _addProductControl(product?: ExpenseProductModel): void {
    const productsFormArray: FormArray = this._getProductsFormArray();

    const productForm: FormGroup = new FormGroup({
      name: new FormControl(!!product && product.name ? product.name : '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl(!!product && product.price ? +product.price : 0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      category: new FormControl(
        !!product && product.category ? product.category : '',
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      quantity: new FormControl(
        !!product && product.quantity ? +product.quantity : 1,
        {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0.01)],
        }
      ),
      priority: new FormControl(
        !!product && product.priority ? product.priority : '',
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
    });

    productsFormArray.push(productForm);
  }

  private _getProductsFormArray(): FormArray {
    return this.expenseForm.get('products') as FormArray;
  }

  private _getWalletFormGroup(): FormGroup {
    return this.expenseForm.get('wallet') as FormGroup;
  }

  private _changePaginationPagesCount(value: number): Observable<void> {
    return this.pagination$.pipe(
      take(1),
      tap((subject: SimplePaginationViewModel) => {
        this._paginationSubject.next({
          ...subject,
          currentIdx: Math.min(
            subject.lastPageIdx + value,
            subject.currentIdx + value
          ),
          lastPageIdx: subject.lastPageIdx + value,
        });
      }),
      map(() => void 0)
    );
  }
}
