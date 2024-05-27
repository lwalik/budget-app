import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TwoOptionConfirmationViewModel } from '../../view-models/two-option-confirmation.view-model';

@Component({
  selector: 'lib-two-option-confirmation-modal',
  standalone: true,
  imports: [],
  templateUrl: './two-option-confirmation-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoOptionConfirmationModalComponent {
  constructor(
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    public readonly dialogData: TwoOptionConfirmationViewModel
  ) {}

  onCancelBtnClicked(): void {
    this._dialogRef.close(0);
  }

  onFirstConfirmBtnClicked(): void {
    this._dialogRef.close(1);
  }

  onSecondConfirmBtnClicked(): void {
    this._dialogRef.close(2);
  }
}
