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
import { SimpleInputFormComponent } from '@budget-app/shared';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [ReactiveFormsModule, SimpleInputFormComponent, CommonModule],
  templateUrl: './register-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  readonly registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    },
    confirmPasswordValidator
  );

  onCreateAccountBtnClicked(form: FormGroup): void {
    console.log('form: ', form);
  }
}
