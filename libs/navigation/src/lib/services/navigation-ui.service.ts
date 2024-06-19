import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  combineLatest,
  filter,
  map,
  of,
  takeUntil,
  tap,
} from 'rxjs';
import { NavLinkModel } from '../models/nav-link.model';

@Injectable({ providedIn: 'root' })
export class NavigationUiService implements OnDestroy {
  private readonly _destroySubject: Subject<void> = new Subject<void>();
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
      {
        id: 5,
        name: 'Summary',
        url: '/summary',
        isActive: false,
      },
    ]);
  private readonly urlStateSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>(this._router.url);

  private readonly _isMobileNavVisible: ReplaySubject<boolean> =
    new ReplaySubject<boolean>(1);

  private readonly navLinks$: Observable<NavLinkModel[]> = combineLatest([
    this._navLinksSubject.asObservable(),
    this.urlStateSubject.asObservable(),
  ]).pipe(
    map(([navLinks, url]: [NavLinkModel[], string]) => {
      return navLinks.map((navLink: NavLinkModel) => ({
        ...navLink,
        isActive: navLink.url === url,
      }));
    }),
    tap(() => this._isMobileNavVisible.next(false))
  );

  constructor(private readonly _router: Router) {
    this._router.events
      .pipe(
        takeUntil(this._destroySubject.asObservable()),
        filter((event) => event instanceof NavigationEnd),
        map((event) => (event as NavigationEnd).url),
        tap((url: string) => this.urlStateSubject.next(url))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroySubject.next();
    this._destroySubject.complete();
  }

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
