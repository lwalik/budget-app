import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { SuccessNotificationViewModel } from '../../view-models/success-notification.view-model';
import { delay, of, take, tap } from 'rxjs';
import { TranslationPipe } from '../../../pipes/translation.pipe';

@Component({
  selector: 'lib-success-notification',
  standalone: true,
  imports: [NgIf, AsyncPipe, TranslationPipe],
  templateUrl: './success-notification.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessNotificationComponent implements OnInit {
  constructor(
    private readonly _dialogRef: DialogRef,
    @Inject(DIALOG_DATA)
    readonly dialogData: SuccessNotificationViewModel
  ) {}

  ngOnInit(): void {
    of(void 0)
      .pipe(
        delay(4000),
        take(1),
        tap(() => this._dialogRef.close())
      )
      .subscribe();
  }

  onCloseBtnClicked(): void {
    this._dialogRef.close();
  }
}
