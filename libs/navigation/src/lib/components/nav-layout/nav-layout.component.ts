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
  readonly isMobileNavVisible$: Observable<boolean> =
    this._navigationUiService.getMobileNavVisibility();

  constructor(private readonly _navigationUiService: NavigationUiService) {}

  openMobileNav(): void {
    this._navigationUiService
      .setMobileNavVisibility(true)
      .pipe(take(1))
      .subscribe();
  }

  closeMobileNav(): void {
    this._navigationUiService
      .setMobileNavVisibility(false)
      .pipe(take(1))
      .subscribe();
  }
}
