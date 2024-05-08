import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavLinkModel } from '../models/nav-link.model';

@Injectable({ providedIn: 'root' })
export class InMemoryNavigationService {
  private readonly _navLinksSubject: BehaviorSubject<NavLinkModel[]> =
    new BehaviorSubject<NavLinkModel[]>([
      {
        name: 'Home',
        url: 'home',
        isActive: false,
      },
      {
        name: 'Dashboard',
        url: 'home',
        isActive: false,
      },
    ]);

  getAll(): Observable<NavLinkModel[]> {
    return this._navLinksSubject.asObservable();
  }
}
