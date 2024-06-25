import { ExistingProvider } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { GET_TRANSLATION } from '@budget-app/shared';

export const getTranslationProvider = (): ExistingProvider => ({
  provide: GET_TRANSLATION,
  useExisting: TranslationService,
});
