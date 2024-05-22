import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  SimpleInputFormComponent,
  SimpleModalComponent,
} from '@budget-app/shared';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WalletsService } from '../../services/wallets.service';
import { take } from 'rxjs';
import { WalletOperationDialogDataViewModel } from '../../view-models/wallet-operation-dialog-data.view-model';
import { CommonModule } from '@angular/common';

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
    private readonly _walletsService: WalletsService,
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: WalletOperationDialogDataViewModel
  ) {}

  onWithdrawFormFormSubmitted(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    const newBalance: number =
      this._dialogData.balance - +form.get('amount')?.value;

    if (newBalance < 0) {
      this.withdrawForm.setErrors({ notEnoughMoney: true });
      return;
    }

    this._walletsService
      .updateBalance(this._dialogData.walletId, newBalance)
      .pipe(take(1))
      .subscribe(() => this._dialogRef.close());
  }
}
