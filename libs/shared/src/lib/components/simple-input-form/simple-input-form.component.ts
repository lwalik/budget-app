import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

type simpleInputType = 'text' | 'number' | 'password';

@Component({
  selector: 'lib-simple-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './simple-input-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleInputFormComponent {
  @Input({ required: true }) control: AbstractControl | null = null;
  @Input() label = '';
  @Input() isRequired = false;
  @Input() errorMsg = '';
  @Input() type: simpleInputType = 'text';

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
