import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideRouter } from '@angular/router';
import { userContextProvider } from '@budget-app/auth';
import { ENV_CONFIG } from '@budget-app/core';
import { decreaseWalletBalanceProvider } from '@budget-app/wallets';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom([
      AngularFirestoreModule,
      AngularFireAuthModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
    ]),
    userContextProvider(),
    decreaseWalletBalanceProvider(),
    {
      provide: LOCALE_ID,
      useValue: 'pl_PL',
    },
    {
      provide: ENV_CONFIG,
      useValue: environment,
    },
  ],
};
