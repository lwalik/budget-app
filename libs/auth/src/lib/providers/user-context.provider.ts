import { ExistingProvider } from '@angular/core';
import { USER_CONTEXT } from '@budget-app/core';
import { AuthService } from '../services/auth.service';

export const userContextProvider = (): ExistingProvider => ({
  provide: USER_CONTEXT,
  useExisting: AuthService,
});
