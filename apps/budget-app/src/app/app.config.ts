import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { userContextProvider } from '@budget-app/auth';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { ENV_CONFIG } from '@budget-app/core';

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
