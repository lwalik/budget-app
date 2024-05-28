import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SimpleSelectListComponent } from '@budget-app/shared';
import { Observable, shareReplay, take } from 'rxjs';
import { SORT_TYPE } from '../../enums/sort-type.enum';
import { ExpensesState } from '../../states/expenses.state';
import { SortListViewModel } from '../../view-models/sort-list.view-model';

@Component({
  selector: 'lib-expenses-sort',
  standalone: true,
  imports: [CommonModule, SimpleSelectListComponent],
  templateUrl: './expenses-sort.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesSortComponent {
  readonly sortList$: Observable<SortListViewModel> = this._expensesState
    .getSortList()
    .pipe(shareReplay(1));
  //   readonly sortList$: Observable<SortListItemViewModel[]> = this._expensesState
  //     .getSortList()
  //     .pipe(shareReplay(1));

  //   readonly sortListLabels$: Observable<string[]> = this.sortList$.pipe(
  //     map((sortList: SortListItemViewModel[]) =>
  //       sortList.map((item: SortListItemViewModel) => item.label)
  //     )
  //   );

  //   readonly selectedItem$: Observable<string> = this.sortList$.pipe(
  //     map((sortList: SortListItemViewModel[]) => {
  //       const selectedItem: SortListItemViewModel | undefined = sortList.find(
  //         (item: SortListItemViewModel) => item.isSelected
  //       );

  //       if (!selectedItem) {
  //         return '';
  //       }

  //       return selectedItem.label;
  //     })
  //   );

  constructor(private readonly _expensesState: ExpensesState) {}

  onOptionSelected(option: string): void {
    this._expensesState
      .updateSort(option as SORT_TYPE)
      .pipe(take(1))
      .subscribe();
  }
}
