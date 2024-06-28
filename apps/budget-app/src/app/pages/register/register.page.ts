import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RegisterFormComponent } from '@budget-app/auth';
import { SelectLangListComponent } from '@budget-app/i18n';

@Component({
  standalone: true,
  imports: [RegisterFormComponent, SelectLangListComponent],
  templateUrl: './register.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {}
