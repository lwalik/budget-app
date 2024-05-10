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
import { DialogRef } from '@angular/cdk/dialog';
import { WalletsService } from '../../services/wallets.service';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'lib-new-wallet-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SimpleInputFormComponent,
    SimpleModalComponent,
  ],
  templateUrl: './new-wallet-form-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWalletFormModalComponent {
  readonly walletForm: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    balance: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly _dialogRef: DialogRef,
    private readonly _walletsService: WalletsService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext
  ) {}

  onWalletFormSubmitted(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    this._userContext
      .getUserId()
      .pipe(
        take(1),
        switchMap((userId: string) => {
          const createdAt: Date = new Date();
          return this._walletsService.create({
            ownerId: userId,
            name: form.get('name')?.value,
            balance: +form.get('balance')?.value,
            currency: 'PLN',
            createdAt: createdAt,
            updatedAt: createdAt,
          });
        })
      )
      .subscribe(() => this._dialogRef.close());
  }
}
