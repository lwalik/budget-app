import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ConfirmationModalViewModel } from '../../view-models/confirmation-modal.view-model';
import { TranslationPipe } from '../../pipes/translation.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-confirmation-modal',
  standalone: true,
  imports: [TranslationPipe, AsyncPipe],
  templateUrl: './confirmation-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent {
  constructor(
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    public readonly dialogData: ConfirmationModalViewModel
  ) {}

  onCancelBtnClicked(): void {
    this._dialogRef.close(false);
  }

  onConfirmBtnClicked(): void {
    this._dialogRef.close(true);
  }
}
