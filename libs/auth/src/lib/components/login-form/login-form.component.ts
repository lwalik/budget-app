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
import { Router, RouterModule } from '@angular/router';
import {
  LoadingComponent,
  SimpleInputFormComponent,
  SpinnerComponent,
  TranslationPipe,
} from '@budget-app/shared';
import { FirebaseError } from 'firebase/app';
import { take, tap } from 'rxjs';
import { AuthState } from '../../state/auth.state';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SimpleInputFormComponent,
    CommonModule,
    RouterModule,
    TranslationPipe,
    SpinnerComponent,
  ],
  templateUrl: './login-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent extends LoadingComponent {
  readonly loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(
    private readonly _authState: AuthState,
    private readonly _router: Router,
    private readonly _cdr: ChangeDetectorRef
  ) {
    super();
  }

  onSignInBtnClicked(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    this.setLoading(true);
    this._authState
      .login({
        email: form.get('email')?.value,
        password: form.get('password')?.value,
      })
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.setLoading(false);
          this._router.navigateByUrl('/dashboard');
        },
        error: (err: FirebaseError) => {
          this.setLoading(false);

          if (err.code === 'auth/invalid-credential') {
            this.loginForm.setErrors({
              invalidCredentials: true,
            });
            this._cdr.detectChanges();
            return;
          }

          if (err.code === 'auth/too-many-requests') {
            this.loginForm.setErrors({
              tooManyRequests: true,
            });
            this._cdr.detectChanges();
            return;
          }

          this.loginForm.setErrors({
            somethingWentWrong: true,
          });
          this._cdr.detectChanges();
        },
      });
  }
}
