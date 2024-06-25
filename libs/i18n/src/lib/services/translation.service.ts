import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { GetTranslation } from '@budget-app/shared';
import { translations } from '../translations/translations';
import { LanguageOptionViewModel } from '../view-models/language-option.view-model';

@Injectable({ providedIn: 'root' })
export class TranslationService implements GetTranslation {
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

  getAllTranslations(keys: string[]): Observable<string[]> {
    return this._selectedLangSubject
      .asObservable()
      .pipe(
        map((selectedLang: LanguageOptionViewModel) =>
          keys.map((key: string) =>
            translations[key] ? translations[key][selectedLang.value] : key
          )
        )
      );
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

  setCurrentLanguage(lang: LanguageOptionViewModel): void {
    this._selectedLangSubject.next(lang);
  }
}
