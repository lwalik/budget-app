import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { ExpenseProductModel } from '../models/expense-product.model';

export const availableBalanceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const walletForm: FormGroup = control.get('wallet') as FormGroup;
  const productsForm: FormArray = control.get('products') as FormArray;
  const balance: number = walletForm.get('balance')?.value as number;
  const products: ExpenseProductModel[] = productsForm.value;

  if (!balance || products.length === 0) {
    return null;
  }

  const allProductsCost: number = products.reduce(
    (total: number, product: ExpenseProductModel) =>
      total + product.price * product.quantity,
    0
  );

  return allProductsCost <= balance ? null : { insufficientBalance: true };
};
