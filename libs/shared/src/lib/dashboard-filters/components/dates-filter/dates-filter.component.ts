import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { DashboardFiltersState } from '../../states/dashboard-filters.state';
import { DashboardFiltersSelectedDatesViewModel } from '../../view-models/dashboard-filters-selected-dates.view-model';
import { formatDateToString } from '../../../utils/dates';

@Component({
  selector: 'lib-dates-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dates-filter.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatesFilterComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly _onDestroySubject: Subject<void> = new Subject<void>();
  readonly dateForm: FormGroup = new FormGroup({
    startDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private readonly _dashboardFiltersState: DashboardFiltersState) {}

  ngOnInit(): void {
    this._dashboardFiltersState
      .getSelectedDates()
      .pipe(
        take(1),
        tap((dates: DashboardFiltersSelectedDatesViewModel) => {
          this.dateForm.patchValue({
            startDate: formatDateToString(dates.startDate),
            endDate: formatDateToString(dates.endDate),
          });
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.dateForm.valueChanges
      .pipe(
        takeUntil(this._onDestroySubject.asObservable()),
        switchMap((form: { startDate: string; endDate: string }) =>
          this._dashboardFiltersState
            .setSelectedDates(new Date(form.startDate), new Date(form.endDate))
            .pipe(take(1))
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._onDestroySubject.next();
  }
}
