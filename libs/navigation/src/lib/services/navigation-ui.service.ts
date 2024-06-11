import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  combineLatest,
  filter,
  map,
  of,
  startWith,
  tap,
} from 'rxjs';
import { NavLinkModel } from '../models/nav-link.model';

@Injectable({ providedIn: 'root' })
export class NavigationUiService {
  private readonly _navLinksSubject: BehaviorSubject<NavLinkModel[]> =
    new BehaviorSubject<NavLinkModel[]>([
      {
        id: 1,
        name: 'Dashboard',
        url: '/dashboard',
        isActive: false,
      },
      {
        id: 2,
        name: 'Wallets',
        url: '/wallets',
        isActive: false,
      },
      {
        id: 3,
        name: 'Products',
        url: '/products',
        isActive: false,
      },
      {
        id: 4,
        name: 'Expenses',
        url: '/expenses',
        isActive: false,
      },
    ]);

  private readonly _isMobileNavVisible: ReplaySubject<boolean> =
    new ReplaySubject<boolean>(1);

  private readonly urlState$: Observable<string> = this._router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => (event as NavigationEnd).url)
  );

  private readonly navLinks$: Observable<NavLinkModel[]> = combineLatest([
    this._navLinksSubject.asObservable(),
    this.urlState$.pipe(startWith(this._router.url)),
  ]).pipe(
    map(([navLinks, url]: [NavLinkModel[], string]) => {
      return navLinks.map((navLink: NavLinkModel) => ({
        ...navLink,
        isActive: navLink.url === url,
      }));
    }),
    tap(() => this._isMobileNavVisible.next(false))
  );

  constructor(private readonly _router: Router) {}

  getAll(): Observable<NavLinkModel[]> {
    return this.navLinks$;
  }

  getMobileNavVisibility(): Observable<boolean> {
    return this._isMobileNavVisible.asObservable();
  }

  setMobileNavVisibility(isVisible: boolean): Observable<void> {
    return of(void 0).pipe(tap(() => this._isMobileNavVisible.next(isVisible)));
  }
}
