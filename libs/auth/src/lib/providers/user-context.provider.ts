import { ExistingProvider } from '@angular/core';
import { USER_CONTEXT } from '@budget-app/core';
import { AuthState } from '../state/auth.state';

export const userContextProvider = (): ExistingProvider => ({
  provide: USER_CONTEXT,
  useExisting: AuthState,
});
