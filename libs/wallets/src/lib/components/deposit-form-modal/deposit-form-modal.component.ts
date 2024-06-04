import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
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
    private readonly _walletsState: WalletsState,
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: WalletOperationDialogDataViewModel
  ) {}

  onDepositFormSubmitted(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    this._walletsState
      .deposit(this._dialogData.walletId, +form.get('amount')?.value)
      .pipe(take(1))
      .subscribe(() => this._dialogRef.close());
  }
}
