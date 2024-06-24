import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Observable } from 'rxjs';

@Pipe({
  standalone: true,
  pure: false,
  name: 'i18n',
})
export class TranslationPipe implements PipeTransform {
  constructor(private readonly _translationService: TranslationService) {}
  transform(value: string): Observable<string> {
    return this._translationService.getTranslation(value);
  }
}
