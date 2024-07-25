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
import { BehaviorSubject, map, Observable, shareReplay, take, tap } from 'rxjs';
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

  onOptionSelected(event: string): void {
    this.products$
      .pipe(
        take(1),
        tap((products: ProductModel[]) => {
          const selectedProduct: ProductModel | undefined = products.find(
            (product: ProductModel) =>
              product.name.toLowerCase() === event.toLowerCase()
          );
          this.control?.setValue(event);

          if (!selectedProduct) {
            this.optionSelected.emit({
              name: event,
              category: 'Uncategorized',
            });
            return;
          }

          this.optionSelected.emit({
            name: event,
            category: selectedProduct.category,
          });
        })
      )
      .subscribe();
  }
}
