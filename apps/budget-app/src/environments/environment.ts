import { EnvConfig } from '@budget-app/core';

export const environment: EnvConfig = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCSiKoR8A-03Ch4E2fNTjgGCLvLTQS1_PE',
    authDomain: 'budget-app-wit.firebaseapp.com',
    projectId: 'budget-app-wit',
    storageBucket: 'budget-app-wit.appspot.com',
    messagingSenderId: '1063541746333',
    appId: '1:1063541746333:web:4a30c737d911e5259d4274',
  },
  walletsUrl: 'wallets',
  userProductsUrl: 'user-products',
  expansesUrl: 'expanses',
};
