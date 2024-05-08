import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarNavComponent } from '@budget-app/navigation';
import { LogoutComponent } from '@budget-app/auth';

@Component({
  standalone: true,
  imports: [RouterModule, SidebarNavComponent, LogoutComponent],
  templateUrl: './logged-in.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedInPage {}
