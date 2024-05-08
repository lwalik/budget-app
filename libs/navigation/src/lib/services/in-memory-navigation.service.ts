import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, take, tap } from 'rxjs';
import { NavLinkModel } from '../models/nav-link.model';

@Injectable({ providedIn: 'root' })
export class InMemoryNavigationService {
  private readonly _navLinksSubject: BehaviorSubject<NavLinkModel[]> =
    new BehaviorSubject<NavLinkModel[]>([
      {
        id: 1,
        name: 'Home',
        url: 'home',
        isActive: false,
      },
      {
        id: 2,
        name: 'Dashboard',
        url: '/',
        isActive: false,
      },
    ]);

  constructor(private readonly _router: Router) {}

  getAll(): Observable<NavLinkModel[]> {
    return this._navLinksSubject.asObservable();
  }

  setActive(selectedLink: NavLinkModel): Observable<void> {
    return this._navLinksSubject.asObservable().pipe(
      take(1),
      tap((links: NavLinkModel[]) => {
        const updatedLinks: NavLinkModel[] = links.map((link: NavLinkModel) =>
          link.id === selectedLink.id
            ? { ...link, isActive: true }
            : { ...link, isActive: false }
        );

        this._navLinksSubject.next(updatedLinks);
      }),
      tap(() => this._router.navigateByUrl(selectedLink.url)),
      map(() => void 0)
    );
  }
}
