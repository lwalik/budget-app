import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import {
  OnClickOutsideTheElementDirective,
  TranslationPipe,
} from '@budget-app/shared';
import { TranslationService } from '../../services/translation.service';
import { LanguageOptionViewModel } from '../../view-models/language-option.view-model';

@Component({
  selector: 'lib-select-lang-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslationPipe,
    OnClickOutsideTheElementDirective,
  ],
  templateUrl: './select-lang-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLangListComponent {
  private readonly _isDropdownVisibleSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  readonly isDropdownVisible$: Observable<boolean> =
    this._isDropdownVisibleSubject.asObservable();

  readonly langOptions$: Observable<LanguageOptionViewModel[]> =
    this._translationService.getLangOptions();

  readonly selectedLang$: Observable<LanguageOptionViewModel> =
    this._translationService.getSelectedOption();
  constructor(private readonly _translationService: TranslationService) {}

  onOptionSelected(selectedOption: LanguageOptionViewModel): void {
    this._translationService.setCurrentLanguage(selectedOption);
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
