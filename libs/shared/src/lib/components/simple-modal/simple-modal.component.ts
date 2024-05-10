import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { SimpleInputFormComponent } from '../simple-input-form/simple-input-form.component';

@Component({
  selector: 'lib-simple-modal',
  standalone: true,
  imports: [FormsModule, SimpleInputFormComponent],
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
