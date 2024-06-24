import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import {
  OnClickOutsideTheElementDirective,
  SimpleSelectListComponent,
} from '@budget-app/shared';
import { LanguageOptionViewModel } from '../../view-models/language-option.view-model';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '../../pipes/translation.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-select-lang-list',
  standalone: true,
  imports: [
    SimpleSelectListComponent,
    CommonModule,
    ReactiveFormsModule,
    OnClickOutsideTheElementDirective,
    TranslationPipe,
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
    this._translationService.selectLanguage(selectedOption);
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
