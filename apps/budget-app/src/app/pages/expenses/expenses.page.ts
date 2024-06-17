import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ExpensesTableComponent } from '@budget-app/expenses';
import { PaginationUiServiceModule } from '@budget-app/shared';

@Component({
  standalone: true,
  imports: [ExpensesTableComponent, PaginationUiServiceModule],
  templateUrl: './expenses.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage {}
