import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SimpleInputFormComponent,
  SimpleModalComponent,
} from '@budget-app/shared';
import { take } from 'rxjs';
import { WalletsState } from '../../states/wallets.state';
import { WalletOperationDialogDataViewModel } from '../../view-models/wallet-operation-dialog-data.view-model';

@Component({
  selector: 'lib-withdraw-form-modal',
  standalone: true,
  imports: [
    SimpleModalComponent,
    SimpleInputFormComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './withdraw-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawFormModalComponent {
  readonly currentBalance: number = this._dialogData.balance;

  readonly withdrawForm: FormGroup = new FormGroup({
    amount: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.currentBalance),
      ],
    }),
  });

  constructor(
    private readonly _walletsState: WalletsState,
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: WalletOperationDialogDataViewModel
  ) {}

  onWithdrawFormFormSubmitted(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    const inputValue: number = +form.get('amount')?.value;

    if (this._dialogData.balance - inputValue < 0) {
      this.withdrawForm.setErrors({ notEnoughMoney: true });
      return;
    }

    this._walletsState
      .decreaseWalletBalance(this._dialogData.walletId, inputValue)
      .pipe(take(1))
      .subscribe(() => this._dialogRef.close());
  }
}
