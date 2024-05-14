import { Directive, HostListener } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { NewUserProductFormModalComponent } from '../components/new-user-product-form-modal/new-user-product-form-modal.component';

@Directive({ selector: '[libOpenNewUserProductFormModal]', standalone: true })
export class OpenNewUserProductFormModalDirective {
  constructor(private readonly _dialog: Dialog) {}

  @HostListener('click')
  onClicked(): void {
    this._dialog.open(NewUserProductFormModalComponent, {
      hasBackdrop: true,
    });
  }
}
