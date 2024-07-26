import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {
  compareDatesWithoutTime,
  isAfterDate,
  isBeforeDate,
} from '../utils/dates';

export const fromToDatesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const fromDate: Date = new Date(control.get('fromDate')?.value);
  const toDate: Date = new Date(control.get('toDate')?.value);

  if (
    compareDatesWithoutTime(fromDate, toDate, isAfterDate) ||
    compareDatesWithoutTime(toDate, fromDate, isBeforeDate)
  ) {
    return { wrongDateRange: true };
  }

  return null;
};
