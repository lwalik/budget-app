import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  SpinnerComponent,
  TranslationPipe,
} from '@budget-app/shared';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { Router, RouterLink } from '@angular/router';
import { AuthState } from '../../state/auth.state';
import { FirebaseError } from 'firebase/app';
import { take, tap } from 'rxjs';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SimpleInputFormComponent,
    CommonModule,
    RouterLink,
    TranslationPipe,
    SpinnerComponent,
  ],
  templateUrl: './register-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent extends LoadingComponent {
  readonly registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: true,
      }),
    },
    confirmPasswordValidator
  );

  constructor(
    private readonly _authState: AuthState,
    private readonly _router: Router,
    private readonly _cdr: ChangeDetectorRef
  ) {
    super();
  }

  onCreateAccountBtnClicked(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    this.setLoading(true);
    this._authState
      .createUser({
        email: form.get('email')?.value,
        password: form.get('password')?.value,
      })
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.setLoading(false);
          this._router.navigateByUrl('login');
        },
        error: (err: FirebaseError) => {
          this.setLoading(false);
          if (err.code === 'auth/email-already-in-use') {
            form.setErrors({
              emailAlreadyInUse: true,
            });
            this._cdr.detectChanges();
            return;
          }
        },
      });
  }
}
