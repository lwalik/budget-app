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

  constructor(private readonly _expensesState: ExpensesState) {}

  onOptionSelected(option: string): void {
    this._expensesState
      .updateSortBy(option as SORT_TYPE)
      .pipe(take(1))
      .subscribe();
  }

  onChangeDirectionClicked(): void {
    this._expensesState.updateSortDirection().pipe(take(1)).subscribe();
  }
}
