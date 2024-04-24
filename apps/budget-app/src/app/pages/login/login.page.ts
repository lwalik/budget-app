import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core';
import { LoginComponent } from '@budget-app/auth';

@Component({
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
}
