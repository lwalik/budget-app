import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  LoadingComponent,
  NotificationsService,
  SimpleInputFormComponent,
  SimpleModalComponent,
  SpinnerComponent,
  TranslationPipe,
  WalletSelectListItemViewModel,
} from '@budget-app/shared';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { WalletOperationDialogDataViewModel } from '../../view-models/wallet-operation-dialog-data.view-model';
import { WalletsState } from '../../states/wallets.state';
import { WalletSelectListComponent } from '../wallet-select-list/wallet-select-list.component';
import { take } from 'rxjs';

@Component({
  selector: 'lib-transfer-form-modal',
  standalone: true,
  imports: [
    SimpleModalComponent,
    SimpleInputFormComponent,
    ReactiveFormsModule,
    CommonModule,
    TranslationPipe,
    SpinnerComponent,
    WalletSelectListComponent,
  ],
  templateUrl: './transfer-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferFormModalComponent extends LoadingComponent {
  readonly transferForm: FormGroup = new FormGroup({
    amount: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(this.dialogData.balance),
      ],
    }),
    transferTo: new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      id: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
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
    readonly dialogData: WalletOperationDialogDataViewModel,
    private readonly _notificationsService: NotificationsService
  ) {
    super();
  }

  get transferToFormControl(): FormControl {
    return this._getTransferToFormGroup().get('name') as FormControl;
  }

  onWalletOptionSelected(event: WalletSelectListItemViewModel): void {
    const transferTo: FormGroup = this._getTransferToFormGroup();
    transferTo.patchValue({
      name: event.name,
      id: event.id,
    });
  }

  onTransferFormSubmitted(form: FormGroup): void {
    const transferToFormGroup: FormGroup = this._getTransferToFormGroup();
    const createdAt: Date = new Date(form.get('createdAt')?.value);

    // TODO handle in statistic maybe
    this.setLoading(true);
    this._walletsState
      .transferBetweenWallets(
        this.dialogData.walletId,
        transferToFormGroup.get('id')?.value,
        +form.get('amount')?.value,
        createdAt
      )
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this._notificationsService.openSuccessNotification(
            'Transfer successful'
          );
          this.setLoading(false);
          this._dialogRef.close();
        },
        error: () => {
          this._notificationsService.openFailureNotification(
            'Transfer failed',
            'Try again later'
          );
          this.setLoading(false);
          this._dialogRef.close();
        },
      });
  }

  private _getTransferToFormGroup(): FormGroup {
    return this.transferForm.get('transferTo') as FormGroup;
  }
}
