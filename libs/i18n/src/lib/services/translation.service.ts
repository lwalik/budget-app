import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { translations } from '../translations/translations';
import { LanguageOptionViewModel } from '../view-models/language-option.view-model';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly availableLanguages: LanguageOptionViewModel[] = [
    { value: 'pl', icon: '/assets/icons/pl-flag.svg' },
    { value: 'en', icon: '/assets/icons/gb-flag.svg' },
  ];
  private readonly _selectedLangSubject: BehaviorSubject<LanguageOptionViewModel> =
    new BehaviorSubject<LanguageOptionViewModel>(this.availableLanguages[0]);

  getLangOptions(): Observable<LanguageOptionViewModel[]> {
    return of(this.availableLanguages);
  }

  getSelectedOption(): Observable<LanguageOptionViewModel> {
    return this._selectedLangSubject.asObservable();
  }

  getTranslation(key: string): Observable<string> {
    return this._selectedLangSubject
      .asObservable()
      .pipe(
        map((selectedLang: LanguageOptionViewModel) =>
          translations[key] ? translations[key][selectedLang.value] : key
        )
      );
  }

  selectLanguage(language: LanguageOptionViewModel): void {
    this._selectedLangSubject.next(language);
  }
}
