import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, ReplaySubject, shareReplay } from 'rxjs';

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
  private readonly _isMobileNavVisible: ReplaySubject<boolean> =
    new ReplaySubject<boolean>(1);
  readonly isMobileNavVisible$: Observable<boolean> = this._isMobileNavVisible
    .asObservable()
    .pipe(shareReplay(1));

  openMobileNav(): void {
    this._isMobileNavVisible.next(true);
  }

  closeMobileNav(): void {
    this._isMobileNavVisible.next(false);
  }
}
