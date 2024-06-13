import { ResolveFn } from '@angular/router';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { WalletsState } from '../states/wallets.state';
import { inject } from '@angular/core';

export const LoadWalletsResolver: ResolveFn<void> = (): Observable<void> => {
  const walletsState: WalletsState = inject(WalletsState);

  return walletsState.loadWallets();
};
