import { DialogRef } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationPipe } from '../../pipes/translation.pipe';

@Component({
  selector: 'lib-simple-modal',
  standalone: true,
  imports: [FormsModule, TranslationPipe, AsyncPipe],
  templateUrl: './simple-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleModalComponent {
  @Input() header = '';
  constructor(private readonly _dialogRef: DialogRef) {}

  onCloseBtnClicked(): void {
    this._dialogRef.close();
  }
}
