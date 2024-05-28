import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, shareReplay, take, tap } from 'rxjs';
import { OnClickOutsideTheElementDirective } from '../../directives/on-click-outside-the-element.directive';

@Component({
  selector: 'lib-simple-select-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OnClickOutsideTheElementDirective,
  ],
  templateUrl: './simple-select-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSelectListComponent {
  @Input({ required: true }) options: string[] = [];
  @Input() label = '';
  @Input() set selectedOption(option: string | null) {
    this._selectedOptionSubject.next(option);
  }

  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();

  private readonly _isDropdownVisibleSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isDropdownVisible$: Observable<boolean> =
    this._isDropdownVisibleSubject.asObservable();

  private readonly _selectedOptionSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  readonly selectedOption$: Observable<string | null> =
    this._selectedOptionSubject.asObservable().pipe(shareReplay(1));

  onOptionSelected(option: string): void {
    this.optionSelected.emit(option);
    this._isDropdownVisibleSubject.next(false);
  }

  toggleDropdown(): void {
    this.isDropdownVisible$
      .pipe(
        take(1),
        tap((isVisible: boolean) =>
          this._isDropdownVisibleSubject.next(!isVisible)
        )
      )
      .subscribe();
  }

  hideDropdown(): void {
    this._isDropdownVisibleSubject.next(false);
  }
}
