import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { LoginFormComponent } from '@budget-app/auth';

@Component({
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
