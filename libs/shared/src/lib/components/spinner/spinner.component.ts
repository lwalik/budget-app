import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'lib-spinner',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './spinner.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {}
