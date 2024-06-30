import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'lib-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  private readonly _isLoadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isLoading$: Observable<boolean> =
    this._isLoadingSubject.asObservable();

  setLoading(isLoading: boolean): void {
    this._isLoadingSubject.next(isLoading);
  }
}
