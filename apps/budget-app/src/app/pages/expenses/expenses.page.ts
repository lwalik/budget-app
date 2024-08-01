import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  CreateReportCardComponent,
  ExpensesTableComponent,
} from '@budget-app/expenses';
import { PaginationUiServiceModule } from '@budget-app/shared';

@Component({
  standalone: true,
  imports: [
    ExpensesTableComponent,
    PaginationUiServiceModule,
    CreateReportCardComponent,
  ],
  templateUrl: './expenses.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage {}
