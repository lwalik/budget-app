import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslationPipe } from '@budget-app/shared';
import { ExpensesState } from '../../states/expenses.state';
import { take } from 'rxjs';

@Component({
  selector: 'lib-create-report-card',
  standalone: true,
  imports: [TranslationPipe, CommonModule],
  templateUrl: './create-report-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReportCardComponent {
  constructor(
    private readonly _expensesState: ExpensesState,
    private readonly _router: Router
  ) {}

  onCreateReportBtnClicked(): void {
    this._expensesState
      .clearReportConfigurationInStorage()
      .pipe(take(1))
      .subscribe(() => this._router.navigateByUrl('/report'));
  }
}
