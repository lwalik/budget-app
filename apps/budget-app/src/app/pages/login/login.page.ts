import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { LoginFormComponent } from '@budget-app/auth';
import { SelectLangListComponent } from '@budget-app/i18n';

@Component({
  standalone: true,
  imports: [LoginFormComponent, SelectLangListComponent],
  templateUrl: './login.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
