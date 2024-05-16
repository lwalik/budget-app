import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'lib-expenses-table',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './expenses-table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesTableComponent {}
