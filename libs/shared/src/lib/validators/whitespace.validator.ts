import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const whitespaceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  console.log('control.value: ', control.value);
  console.log('control.value.trim().length: ', control.value.trim().length);
  return control.value && control.value.trim().length > 0
    ? null
    : { emptyValue: true };
};
