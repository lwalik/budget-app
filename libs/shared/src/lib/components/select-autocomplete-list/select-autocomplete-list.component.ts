import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, take, tap } from 'rxjs';
import { AutocompleteOptionsViewModel } from '../../view-models/autocomplete-options.view-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-select-autocomplete-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-autocomplete-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAutocompleteListComponent {
  @Input() set options(list: string[]) {
    this.listOptions$
      .pipe(
        take(1),
        tap((currentSubject: AutocompleteOptionsViewModel) =>
          this._listOptionsSubject.next({
            ...currentSubject,
            list,
          })
        )
      )
      .subscribe();
  }
  @Input() set inputValue(value: string | null) {
    this.listOptions$
      .pipe(
        take(1),
        tap((currentSubject: AutocompleteOptionsViewModel) =>
          this._listOptionsSubject.next({
            ...currentSubject,
            inputValue: value || '',
          })
        )
      )
      .subscribe();
  }
  @Output() optionSelected: EventEmitter<string> = new EventEmitter<string>();

  private readonly _listOptionsSubject: BehaviorSubject<AutocompleteOptionsViewModel> =
    new BehaviorSubject<AutocompleteOptionsViewModel>({
      list: [],
      inputValue: '',
    });
  readonly listOptions$: Observable<AutocompleteOptionsViewModel> =
    this._listOptionsSubject.asObservable().pipe(shareReplay(1));
  readonly filteredListOptions$: Observable<string[]> = this.listOptions$.pipe(
    map((autocomplete: AutocompleteOptionsViewModel) =>
      autocomplete.list.filter((item: string) =>
        item.toLowerCase().includes(autocomplete.inputValue.toLowerCase())
      )
    )
  );

  get inputValueShouldBeVisible(): Observable<boolean> {
    return this.listOptions$.pipe(
      take(1),
      map(
        (listOptions: AutocompleteOptionsViewModel) =>
          !listOptions.list
            .map((item: string) => item.toLowerCase())
            .includes(listOptions.inputValue.toLowerCase())
      )
    );
  }

  onOptionSelected(option: string): void {
    this.optionSelected.emit(option);
  }
}
