import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationPipe } from '@budget-app/shared';

@Component({
  selector: 'lib-create-report-card',
  standalone: true,
  imports: [TranslationPipe, CommonModule, RouterLink],
  templateUrl: './create-report-card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReportCardComponent {}
