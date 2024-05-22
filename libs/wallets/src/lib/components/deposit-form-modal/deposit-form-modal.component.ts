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

@Component({
  selector: 'lib-deposit-form-modal',
  standalone: true,
  imports: [
    SimpleModalComponent,
    SimpleInputFormComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './deposit-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositFormModalComponent {
  readonly depositForm: FormGroup = new FormGroup({
    amount: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
  });

  constructor(
    private readonly _walletsService: WalletsService,
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: WalletOperationDialogDataViewModel
  ) {}

  onDepositFormSubmitted(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    const newBalance: number =
      +form.get('amount')?.value + this._dialogData.balance;
    this._walletsService
      .updateBalance(this._dialogData.walletId, newBalance)
      .pipe(take(1))
      .subscribe(() => this._dialogRef.close());
  }
}
