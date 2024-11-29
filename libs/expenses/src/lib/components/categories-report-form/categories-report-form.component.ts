import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  LoadingComponent,
  SpinnerComponent,
  TranslationPipe,
} from '@budget-app/shared';
import { ExpensesState } from '../../states/expenses.state';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, shareReplay, take, tap } from 'rxjs';
import { CategoriesReportStepItemViewModel } from '../../view-models/categories-report-step-item.view-model';

@Component({
  selector: 'lib-categories-report-form',
  standalone: true,
  imports: [
    TranslationPipe,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './categories-report-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesReportFormComponent extends LoadingComponent {
  readonly form: FormGroup = new FormGroup({});
  readonly categories$: Observable<CategoriesReportStepItemViewModel[]> =
    this._expensesState.getAllExpenseCategoriesForReportConfiguration().pipe(
      tap((categories: CategoriesReportStepItemViewModel[]) => {
        categories.forEach((category: CategoriesReportStepItemViewModel) => {
          const control: FormControl = new FormControl(category.isSelected, {
            nonNullable: true,
          });
          this.form.addControl(category.name, control);
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
    const selectedCategories: string[] = this._getSelectedCategories();
    return selectedCategories.length === 0;
  }

  onToggleAllClicked(): void {
    this._updateAllValues(!this.areAllChecked);
  }

  onBackBtnClicked(): void {
    this._expensesState
      .patchReportConfiguration({
        categories: [],
      })
      .pipe(take(1))
      .subscribe(() => {
        this._updateAllValues(false);
        this.stepBack.emit();
      });
  }

  onCategoryFormSubmitted(): void {
    this.setLoading(true);
    const selectedCategories: string[] = this._getSelectedCategories();
    this._expensesState
      .patchReportConfiguration({
        categories: selectedCategories,
      })
      .pipe(take(1))
      .subscribe(() => {
        this.setLoading(false);
        this.stepCompleted.emit();
      });
  }

  get areAllChecked(): boolean {
    const values: boolean[] = Object.values(this.form.value);
    const selectedValues: boolean[] = values.filter((v) => v);
    return values.length === selectedValues.length;
  }

  private _getSelectedCategories(): string[] {
    return Object.entries(this.form.value).reduce(
      (acc: string[], [category, isSelected]) =>
        isSelected ? [...acc, category] : acc,
      []
    );
  }

  private _updateAllValues(value: boolean): void {
    Object.keys(this.form.value).forEach((key) => {
      this.form.get(key)?.setValue(value);
    });
  }
}
