import { DIALOG_DATA } from '@angular/cdk/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { TranslationPipe } from '../../../pipes/translation.pipe';
import { SimpleNotificationViewModel } from '../../view-models/simple-notification.view-model';
import { SimpleNotificationComponent } from '../simple-notification/simple-notification.component';

@Component({
  selector: 'lib-success-notification',
  standalone: true,
  imports: [NgIf, AsyncPipe, TranslationPipe, SimpleNotificationComponent],
  templateUrl: './success-notification.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessNotificationComponent {
  constructor(
    @Inject(DIALOG_DATA)
    readonly dialogData: SimpleNotificationViewModel
  ) {}
}
