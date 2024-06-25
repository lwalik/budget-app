import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AuthState } from '../../state/auth.state';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { TranslationPipe } from '@budget-app/shared';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-logout',
  standalone: true,
  imports: [TranslationPipe, AsyncPipe],
  templateUrl: './logout.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  constructor(
    private readonly _authState: AuthState,
    private readonly _router: Router
  ) {}

  onLogoutClicked(): void {
    this._authState
      .logout()
      .pipe(take(1))
      .subscribe(() => this._router.navigateByUrl('/login'));
  }
}
