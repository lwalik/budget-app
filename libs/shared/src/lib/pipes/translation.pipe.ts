import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GET_TRANSLATION,
  GetTranslation,
} from '../tokens/get-translation.token';

@Pipe({
  standalone: true,
  pure: false,
  name: 'i18n',
})
export class TranslationPipe implements PipeTransform {
  constructor(
    @Inject(GET_TRANSLATION) private readonly _getTranslation: GetTranslation
  ) {}
  transform(value: string): Observable<string> {
    return this._getTranslation.getTranslation(value);
  }
}
