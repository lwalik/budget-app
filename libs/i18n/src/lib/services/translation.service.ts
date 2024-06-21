import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { translations } from '../translations/translations';
import { LanguageType } from '../types/language.type';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _selectedLangSubject: BehaviorSubject<LanguageType> =
    new BehaviorSubject<LanguageType>('pl');

  getTranslation(key: string): string {
    console.log('key: ', key);
    const lang: LanguageType = this._selectedLangSubject.getValue();
    console.log('lang: ', lang);
    console.log('translation: ', translations);

    return translations[key] ? translations[key][lang] : key;
  }
}
