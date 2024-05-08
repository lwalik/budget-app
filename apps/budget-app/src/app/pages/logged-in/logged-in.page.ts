import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarNavComponent } from '@budget-app/navigation';

@Component({
  standalone: true,
  imports: [RouterModule, SidebarNavComponent],
  templateUrl: './logged-in.page.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggedInPage {}
