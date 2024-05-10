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
import { SimpleInputFormComponent } from '@budget-app/shared';
import { DialogRef } from '@angular/cdk/dialog';
import { WalletsService } from '../../services/wallets.service';
import { USER_CONTEXT, UserContext } from '@budget-app/core';
import { switchMap, take } from 'rxjs';

@Component({
  selector: 'lib-new-wallet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SimpleInputFormComponent],
  templateUrl: './new-wallet-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewWalletFormComponent {
  readonly walletForm: FormGroup = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    balance: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly _dialogRef: DialogRef,
    private readonly _walletsService: WalletsService,
    @Inject(USER_CONTEXT) private readonly _userContext: UserContext
  ) {}

  onCloseBtnClicked(): void {
    this._dialogRef.close();
  }

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
            balance: form.get('balance')?.value,
            currency: 'PLN',
            createdAt: createdAt,
            updatedAt: createdAt,
          });
        })
      )
      .subscribe(() => this._dialogRef.close());
  }
}
