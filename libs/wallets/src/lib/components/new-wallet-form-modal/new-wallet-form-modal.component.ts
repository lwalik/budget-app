import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
  SimpleInputFormComponent,
  SimpleModalComponent,
  SpinnerComponent,
  TranslationPipe,
  whitespaceValidator,
} from '@budget-app/shared';
import { take } from 'rxjs';
import { WalletsState } from '../../states/wallets.state';

@Component({
  selector: 'lib-new-wallet-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleInputFormComponent,
    SimpleModalComponent,
    TranslationPipe,
    SpinnerComponent,
  ],
  templateUrl: './new-wallet-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWalletFormModalComponent extends LoadingComponent {
  readonly walletForm: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, whitespaceValidator],
      nonNullable: true,
    }),
    balance: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly _dialogRef: DialogRef,
    private readonly _walletsState: WalletsState
  ) {
    super();
  }

  onWalletFormSubmitted(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    this.setLoading(true);

    this._walletsState
      .createWallet({
        name: form.get('name')?.value,
        balance: +form.get('balance')?.value,
        currency: 'PLN',
      })
      .pipe(take(1))
      .subscribe(() => {
        this.setLoading(false);
        this._dialogRef.close();
      });
  }
}
