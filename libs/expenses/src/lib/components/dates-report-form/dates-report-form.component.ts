import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  fromToDatesValidator,
  LoadingComponent,
  SpinnerComponent,
  TranslationPipe,
} from '@budget-app/shared';
import { take } from 'rxjs';
import { ExpensesState } from '../../states/expenses.state';

@Component({
  selector: 'lib-dates-report-form',
  standalone: true,
  imports: [
    TranslationPipe,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './dates-report-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatesReportFormComponent extends LoadingComponent {
  readonly dateForm: FormGroup = new FormGroup(
    {
      fromDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      toDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    fromToDatesValidator
  );

  @Output() stepCompleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() stepBack: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly _expensesState: ExpensesState) {
    super();
  }

  onBackBtnClicked(): void {
    this._expensesState
      .patchReportConfiguration({
        dates: {
          fromDate: undefined,
          toDate: undefined,
        },
      })
      .pipe(take(1))
      .subscribe(() => {
        this.stepBack.emit();
      });
  }

  onDateFormSubmitted(form: FormGroup): void {
    this.setLoading(true);
    this._expensesState
      .patchReportConfiguration({
        dates: {
          fromDate: new Date(form.get('fromDate')?.value) || undefined,
          toDate: new Date(form.get('toDate')?.value) || undefined,
        },
      })
      .pipe(take(1))
      .subscribe(() => {
        this.setLoading(false);
        this.stepCompleted.emit();
      });
  }
}
