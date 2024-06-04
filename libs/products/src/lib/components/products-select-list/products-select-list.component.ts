import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ProductsState } from '../../states/products.state';
import { BehaviorSubject, map, Observable, shareReplay, take, tap } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { SimpleSelectListComponent } from '@budget-app/shared';
import { CommonModule } from '@angular/common';
import { ProductSelectListItemViewModel } from '../../view-models/product-select-list-item.view-model';

@Component({
  selector: 'lib-products-select-list',
  standalone: true,
  imports: [SimpleSelectListComponent, CommonModule],
  templateUrl: './products-select-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSelectListComponent {
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
      products.map((product: ProductModel) => product.name)
    )
  );

  constructor(private readonly _productsState: ProductsState) {}

  onOptionSelected(event: string): void {
    this.products$
      .pipe(
        take(1),
        map((products: ProductModel[]) =>
          products.find((product: ProductModel) => product.name === event)
        ),
        tap((selectedProduct: ProductModel | undefined) => {
          if (!selectedProduct) {
            return;
          }

          this.optionSelected.emit({
            name: selectedProduct.name,
            category: selectedProduct.category,
          });
        })
      )
      .subscribe();
  }
}
