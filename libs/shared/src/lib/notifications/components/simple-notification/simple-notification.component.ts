import { DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { delay, of, take, tap } from 'rxjs';

@Component({
  selector: 'lib-simple-notification',
  standalone: true,
  imports: [],
  templateUrl: './simple-notification.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleNotificationComponent implements OnInit {
  constructor(private readonly _dialogRef: DialogRef) {}

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
