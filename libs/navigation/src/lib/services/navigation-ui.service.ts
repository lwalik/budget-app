import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map,
  startWith,
} from 'rxjs';
import { NavLinkModel } from '../models/nav-link.model';

@Injectable({ providedIn: 'root' })
export class NavigationUiService {
  private readonly _navLinksSubject: BehaviorSubject<NavLinkModel[]> =
    new BehaviorSubject<NavLinkModel[]>([
      {
        id: 1,
        name: 'Home',
        url: '/home',
        isActive: false,
      },
    ]);
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
    })
  );

  constructor(private readonly _router: Router) {}

  getAll(): Observable<NavLinkModel[]> {
    return this.navLinks$;
  }
}
