import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, take } from 'rxjs';
import { NavigationUiService } from '../../services/navigation-ui.service';

@Component({
  selector: 'lib-nav-layout',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./nav-layout.component.scss'],
  templateUrl: './nav-layout.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLayoutComponent {
  // private readonly _isMobileNavVisible: ReplaySubject<boolean> =
  //   new ReplaySubject<boolean>(1);
  // readonly isMobileNavVisible$: Observable<boolean> = this._isMobileNavVisible
  //   .asObservable()
  //   .pipe(shareReplay(1));

  readonly isMobileNavVisible$: Observable<boolean> =
    this._navigationUiService.getMobileNavVisibility();

  constructor(private readonly _navigationUiService: NavigationUiService) {}

  openMobileNav(): void {
    this._navigationUiService
      .setMobileNavVisibility(true)
      .pipe(take(1))
      .subscribe();
    // this._isMobileNavVisible.next(true);
  }

  closeMobileNav(): void {
    this._navigationUiService
      .setMobileNavVisibility(false)
      .pipe(take(1))
      .subscribe();
    // this._isMobileNavVisible.next(false);
  }
}
