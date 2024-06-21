import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  standalone: true,
  pure: false,
  name: 'i18n',
})
export class TranslationPipe implements PipeTransform {
  constructor(private readonly _translationService: TranslationService) {}
  transform(value: string): string {
    return this._translationService.getTranslation(value);
  }
}
