import { ResolveFn } from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { WalletsState } from '../states/wallets.state';
import { inject } from '@angular/core';

export const LoadWalletsResolver: ResolveFn<void> = (): Observable<void> => {
  const walletsState: WalletsState = inject(WalletsState);

  return walletsState.isInitialized$.pipe(
    take(1),
    switchMap((isInitialized: boolean) =>
      isInitialized ? of(void 0) : walletsState.loadWallets()
    )
  );
};
