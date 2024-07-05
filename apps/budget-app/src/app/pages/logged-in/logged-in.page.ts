import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoutComponent } from '@budget-app/auth';
import { SelectLangListComponent } from '@budget-app/i18n';
import {
  NavLayoutComponent,
  SidebarNavComponent,
} from '@budget-app/navigation';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    SidebarNavComponent,
    LogoutComponent,
    NavLayoutComponent,
    CommonModule,
    SelectLangListComponent,
  ],
  templateUrl: './logged-in.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedInPage {}
