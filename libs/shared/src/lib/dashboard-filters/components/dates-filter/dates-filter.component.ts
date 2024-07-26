import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take, tap } from 'rxjs';
import { TranslationPipe } from '../../../pipes/translation.pipe';
import { formatDateToString } from '../../../utils/dates';
import { fromToDatesValidator } from '../../../validators/from-to-dates.validator';
import { DashboardFiltersState } from '../../states/dashboard-filters.state';
import { DashboardFiltersSelectedDatesViewModel } from '../../view-models/dashboard-filters-selected-dates.view-model';

@Component({
  selector: 'lib-dates-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslationPipe],
  templateUrl: './dates-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatesFilterComponent implements OnInit {
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

  constructor(private readonly _dashboardFiltersState: DashboardFiltersState) {}

  ngOnInit(): void {
    this._dashboardFiltersState
      .getSelectedDates()
      .pipe(
        take(1),
        tap((dates: DashboardFiltersSelectedDatesViewModel) => {
          this.dateForm.patchValue({
            fromDate: formatDateToString(dates.fromDate),
            toDate: formatDateToString(dates.toDate),
          });
        })
      )
      .subscribe();
  }

  onDateFormSubmitted(form: FormGroup): void {
    this._dashboardFiltersState
      .setSelectedDates(
        new Date(form.get('fromDate')?.value),
        new Date(form.get('toDate')?.value)
      )
      .pipe(take(1))
      .subscribe();
  }
}
