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
import { BehaviorSubject, Observable } from 'rxjs';

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
export class LoggedInPage {
  private readonly _isMobileNavVisible: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isMobileNavVisible$: Observable<boolean> =
    this._isMobileNavVisible.asObservable();

  openMobileNav(): void {
    this._isMobileNavVisible.next(true);
  }

  closeMobileNav(): void {
    this._isMobileNavVisible.next(false);
  }
}
