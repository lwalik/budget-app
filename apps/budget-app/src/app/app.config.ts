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
import { getTranslationProvider } from '@budget-app/i18n';
import {
  incomesDataProvider,
  walletBalanceProvider,
} from '@budget-app/wallets';
import { Chart } from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

registerLocaleData(localePl);
Chart.register(ChartDataLabels);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom([
      AngularFirestoreModule,
      AngularFireAuthModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
    ]),
    userContextProvider(),
    walletBalanceProvider(),
    incomesDataProvider(),
    getTranslationProvider(),
    provideCharts(withDefaultRegisterables()),
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
