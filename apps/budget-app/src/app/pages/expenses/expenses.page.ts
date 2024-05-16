import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ExpensesTableComponent } from '@budget-app/expenses';

@Component({
  standalone: true,
  imports: [ExpensesTableComponent],
  templateUrl: './expenses.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage {}
