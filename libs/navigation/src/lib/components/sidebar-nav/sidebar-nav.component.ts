import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import { NavLinkModel } from '../../models/nav-link.model';
import { InMemoryNavigationService } from '../../services/in-memory-navigation.service';

@Component({
  selector: 'lib-sidebar-nav',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./sidebar-nav.component.scss'],
  templateUrl: './sidebar-nav.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavComponent {
  readonly links$: Observable<NavLinkModel[]> =
    this._navigationService.getAll();

  constructor(private readonly _navigationService: InMemoryNavigationService) {}

  onNavLinkClicked(link: NavLinkModel): void {
    if (link.isActive) {
      return;
    }
    this._navigationService.setActive(link).subscribe();
  }
}
