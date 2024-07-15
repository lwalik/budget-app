import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslationPipe } from '../../pipes/translation.pipe';

type simpleInputType = 'text' | 'number' | 'password';

@Component({
  selector: 'lib-simple-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslationPipe],
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

  @Output() inputFocus: EventEmitter<void> = new EventEmitter<void>();
  @Output() inputBlur: EventEmitter<void> = new EventEmitter<void>();

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  onFocus(): void {
    this.inputFocus.emit();
  }

  onBlur(): void {
    this.inputBlur.emit();
  }
}
