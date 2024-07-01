import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { FailureNotificationComponent } from '../components/failure-notification/failure-notification.component';
import { SuccessNotificationComponent } from '../components/success-notification/success-notification.component';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private readonly _dialog: Dialog) {}

  openSuccessNotification(header: string, message = ''): void {
    this._dialog.open(SuccessNotificationComponent, {
      hasBackdrop: false,
      autoFocus: false,
      data: {
        header,
        message,
      },
    });
  }

  openFailureNotification(header: string, message = ''): void {
    this._dialog.open(FailureNotificationComponent, {
      hasBackdrop: false,
      autoFocus: false,
      data: {
        header,
        message,
      },
    });
  }
}
