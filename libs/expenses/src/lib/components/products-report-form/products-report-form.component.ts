import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  LoadingComponent,
  SpinnerComponent,
  TranslationPipe,
} from '@budget-app/shared';
import { Observable, shareReplay, take, tap } from 'rxjs';
import { ExpensesState } from '../../states/expenses.state';
import { ProductReportStepItemViewModel } from '../../view-models/product-report-step-item.view-model';

@Component({
  selector: 'lib-products-report-form',
  standalone: true,
  imports: [
    TranslationPipe,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './products-report-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// TODO Spróbować zrobić wspólny component dla categories i products i tutaj go użyć
// sporo części wspólnych
export class ProductsReportFormComponent extends LoadingComponent {
  readonly form: FormGroup = new FormGroup({});
  readonly products$: Observable<ProductReportStepItemViewModel[]> =
    this._expensesState.getAllExpenseProductsForReportConfiguration().pipe(
      tap((categories: ProductReportStepItemViewModel[]) => {
        categories.forEach((product: ProductReportStepItemViewModel) => {
          const control: FormControl = new FormControl(product.isSelected, {
            nonNullable: true,
          });
          this.form.addControl(product.name, control);
        });
      }),
      shareReplay(1)
    );

  @Output() stepCompleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() stepBack: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly _expensesState: ExpensesState) {
    super();
  }

  get isSubmitBtnDisabled(): boolean {
    const selectedCategories: string[] = this._getSelectedProducts();
    return selectedCategories.length === 0;
  }

  get isAllItemsSelected(): boolean {
    const selectedCategories: string[] = this._getSelectedProducts();
    return Object.keys(this.form.value).length === selectedCategories.length;
  }

  onProductFormSubmitted(): void {
    this.setLoading(true);
    const selectedProducts: string[] = this._getSelectedProducts();
    this._expensesState
      .patchReportConfiguration({
        products: selectedProducts,
      })
      .pipe(take(1))
      .subscribe(() => {
        this.setLoading(false);
        this.stepCompleted.emit();
      });
  }

  onSelectAllClicked(): void {
    this._updateAllValues(true);
  }

  onBackBtnClicked(): void {
    this._expensesState
      .patchReportConfiguration({
        products: [],
      })
      .pipe(take(1))
      .subscribe(() => {
        this._updateAllValues(false);
        this.stepBack.emit();
      });
  }

  private _getSelectedProducts(): string[] {
    return Object.entries(this.form.value).reduce(
      (acc: string[], [product, isSelected]) =>
        isSelected ? [...acc, product] : acc,
      []
    );
  }

  private _updateAllValues(value: boolean): void {
    Object.keys(this.form.value).forEach((key) => {
      this.form.get(key)?.setValue(value);
    });
  }
}
