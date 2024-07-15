import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  OnClickOutsideTheElementDirective,
  SelectAutocompleteListComponent,
  SimpleInputFormComponent,
  SimpleSelectListComponent,
} from '@budget-app/shared';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { ProductsState } from '../../states/products.state';
import { ProductSelectListItemViewModel } from '../../view-models/product-select-list-item.view-model';

@Component({
  selector: 'lib-products-select-list',
  standalone: true,
  imports: [
    SimpleSelectListComponent,
    CommonModule,
    SelectAutocompleteListComponent,
    SimpleInputFormComponent,
    OnClickOutsideTheElementDirective,
  ],
  templateUrl: './products-select-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSelectListComponent {
  @Input({ required: true }) control: AbstractControl | null = null;
  @Input() set selectedOption(option: string | null) {
    this._selectedOptionSubject.next(option);
  }
  @Output() optionSelected: EventEmitter<ProductSelectListItemViewModel> =
    new EventEmitter<ProductSelectListItemViewModel>();

  private readonly _selectedOptionSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  readonly selectedOption$: Observable<string | null> =
    this._selectedOptionSubject.asObservable();

  private readonly _autocompleteShouldBeVisibleSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly autocompleteShouldBeVisible$: Observable<boolean> =
    this._autocompleteShouldBeVisibleSubject.asObservable();

  readonly products$: Observable<ProductModel[]> = this._productsState
    .getAllProducts()
    .pipe(shareReplay(1));
  readonly productsName$: Observable<string[]> = this.products$.pipe(
    map((products: ProductModel[]) =>
      products
        .map((product: ProductModel) => product.name)
        .sort((a: string, b: string) => (a > b ? 1 : -1))
    )
  );

  constructor(private readonly _productsState: ProductsState) {}

  onFocus(): void {
    this._autocompleteShouldBeVisibleSubject.next(true);
  }

  hideAutocomplete(): void {
    this._autocompleteShouldBeVisibleSubject.next(false);
  }

  onOptionSelected(event: string): void {
    this.optionSelected.emit({
      name: event,
      category: 'Uncategorized',
    });
    this.control?.setValue(event);
    this._autocompleteShouldBeVisibleSubject.next(false);
    // this.products$
    //   .pipe(
    //     take(1),
    //     map((products: ProductModel[]) =>
    //       products.find((product: ProductModel) => product.name === event)
    //     ),
    //     tap((selectedProduct: ProductModel | undefined) => {
    //       if (!selectedProduct) {
    //         return;
    //       }

    //       this.optionSelected.emit({
    //         name: selectedProduct.name,
    //         category: selectedProduct.category,
    //       });
    //     })
    //   )
    //   .subscribe();
  }
}
