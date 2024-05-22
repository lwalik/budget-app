import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { UserProductsState } from '../../states/user-products.state';
import { BehaviorSubject, map, Observable, shareReplay, take, tap } from 'rxjs';
import { UserProductModel } from '../../models/user-product.model';
import { SimpleSelectListComponent } from '@budget-app/shared';
import { CommonModule } from '@angular/common';
import { UserProductSelectListItemViewModel } from '../../view-models/user-product-select-list-item.view-model';

@Component({
  selector: 'lib-user-products-select-list',
  standalone: true,
  imports: [SimpleSelectListComponent, CommonModule],
  templateUrl: './user-products-select-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProductsSelectListComponent {
  @Input() set selectedOption(option: string | null) {
    this._selectedOptionSubject.next(option);
  }
  @Output() optionSelected: EventEmitter<UserProductSelectListItemViewModel> =
    new EventEmitter<UserProductSelectListItemViewModel>();

  private readonly _selectedOptionSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  readonly selectedOption$: Observable<string | null> =
    this._selectedOptionSubject.asObservable();

  readonly products$: Observable<UserProductModel[]> = this._userProductsState
    .getAllProducts()
    .pipe(shareReplay(1));
  readonly productsName$: Observable<string[]> = this.products$.pipe(
    map((products: UserProductModel[]) =>
      products.map((product: UserProductModel) => product.name)
    )
  );

  constructor(private readonly _userProductsState: UserProductsState) {}

  onOptionSelected(event: string): void {
    this.products$
      .pipe(
        take(1),
        map((products: UserProductModel[]) =>
          products.find((product: UserProductModel) => product.name === event)
        ),
        tap((selectedProduct: UserProductModel | undefined) => {
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
