import { InjectionToken } from '@angular/core';

export const ENV_CONFIG: InjectionToken<EnvConfig> =
  new InjectionToken<EnvConfig>('ENV_CONFIG');

export interface EnvConfig {
  readonly production: boolean;
  readonly firebaseConfig: FirebaseConfig;
  readonly walletsUrl: string;
  readonly productsUrl: string;
  readonly productsCategoryUrl: string;
  readonly expansesUrl: string;
}

interface FirebaseConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
}
