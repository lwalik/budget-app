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
  LoadingComponent,
  NotificationsService,
  SimpleInputFormComponent,
  SimpleModalComponent,
  SpinnerComponent,
  TranslationPipe,
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
    CommonModule,
    TranslationPipe,
    SpinnerComponent,
  ],
  templateUrl: './deposit-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositFormModalComponent extends LoadingComponent {
  readonly depositForm: FormGroup = new FormGroup({
    amount: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    createdAt: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private readonly _walletsState: WalletsState,
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    private readonly _dialogData: WalletOperationDialogDataViewModel,
    private readonly _notificationsService: NotificationsService
  ) {
    super();
  }

  onDepositFormSubmitted(form: FormGroup): void {
    if (!form.valid) {
      return;
    }
    this.setLoading(true);

    const amount: number = +form.get('amount')?.value;
    const createdAt: Date = new Date(form.get('createdAt')?.value);

    this._walletsState
      .deposit(this._dialogData.walletId, amount, createdAt)
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this._notificationsService.openSuccessNotification(
            'Deposit successful'
          );
          this.setLoading(false);
          this._dialogRef.close();
        },
        error: () => {
          this.setLoading(false);
          this._dialogRef.close();
        },
      });
  }
}
