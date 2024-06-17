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
import { Router } from '@angular/router';
import { SimpleInputFormComponent } from '@budget-app/shared';
import { FirebaseError } from 'firebase/app';
import { take } from 'rxjs';
import { AuthState } from '../../state/auth.state';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [ReactiveFormsModule, SimpleInputFormComponent, CommonModule],
  templateUrl: './login-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
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
  ) {}

  onSignInBtnClicked(form: FormGroup): void {
    if (!form.valid) {
      return;
    }

    this._authState
      .login({
        email: form.get('email')?.value,
        password: form.get('password')?.value,
      })
      .pipe(take(1))
      .subscribe({
        complete: () => this._router.navigateByUrl('/dashboard'),
        error: (err: FirebaseError) => {
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
