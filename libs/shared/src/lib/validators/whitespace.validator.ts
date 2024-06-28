import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const whitespaceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value && control.value.trim().length > 0
    ? null
    : { emptyValue: true };
};
