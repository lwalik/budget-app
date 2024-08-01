import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { map, take } from 'rxjs';
import { WalletsState } from '../states/wallets.state';
import { WalletModel } from '../models/wallet.model';

@Directive({ selector: '[libHasWallet]', standalone: true })
export class HasWalletDirective implements OnInit {
  private _elseTemplate: TemplateRef<unknown> | undefined;
  @Input('libHasWallet') set elseTemplate(
    temp: TemplateRef<unknown> | undefined | string
  ) {
    if (typeof temp !== 'string') {
      this._elseTemplate = temp;
    }
  }

  constructor(
    private readonly _walletsState: WalletsState,
    private _templateRef: TemplateRef<unknown>,
    private _viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this._walletsState
      .getAllWallets()
      .pipe(
        take(1),
        map((wallets: WalletModel[]) => wallets.length > 0)
      )
      .subscribe((hasWallet: boolean) => {
        if (hasWallet) {
          this._viewContainerRef.createEmbeddedView(this._templateRef);
        } else if (this._elseTemplate) {
          this._viewContainerRef.createEmbeddedView(this._elseTemplate);
        }
      });
  }
}
