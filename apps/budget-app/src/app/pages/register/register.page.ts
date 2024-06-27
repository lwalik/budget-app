import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RegisterFormComponent } from '@budget-app/auth';

@Component({
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './register.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {}
