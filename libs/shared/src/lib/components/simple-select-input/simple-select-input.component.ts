import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, shareReplay, take, tap } from 'rxjs';

@Component({
  selector: 'lib-simple-select-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './simple-select-input.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSelectInputComponent implements OnInit {
  @Input({ required: true }) control: AbstractControl | null = null;
  @Input({ required: true }) options: string[] = [];
  @Input() label = '';

  private readonly _isCategoryDropdownVisibleSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isCategoryDropdownVisible$: Observable<boolean> =
    this._isCategoryDropdownVisibleSubject.asObservable();

  private readonly _selectedOptionSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(this.options[0]);
  readonly selectedOption$: Observable<string | null> =
    this._selectedOptionSubject.asObservable().pipe(
      tap((selectedOption: string | null) => {
        if (!selectedOption) {
          return;
        }

        this.control?.setValue(selectedOption);
      }),
      shareReplay(1)
    );

  ngOnInit(): void {
    this._selectedOptionSubject.next(this.options[0]);
  }

  onOptionSelected(option: string): void {
    this._selectedOptionSubject.next(option);
    this._isCategoryDropdownVisibleSubject.next(false);
  }

  toggleCategoryDropdown(): void {
    this.isCategoryDropdownVisible$
      .pipe(
        take(1),
        tap((isVisible: boolean) =>
          this._isCategoryDropdownVisibleSubject.next(!isVisible)
        )
      )
      .subscribe();
  }
}
