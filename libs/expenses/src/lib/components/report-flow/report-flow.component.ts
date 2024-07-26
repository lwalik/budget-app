import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { TranslationPipe } from '@budget-app/shared';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  take,
  tap,
} from 'rxjs';
import {
  ReportFlowStepItemViewModel,
  ReportFlowStepsViewModel,
} from '../../view-models/report-flow-state.view-model';
import { CategoriesReportFormComponent } from '../categories-report-form/categories-report-form.component';
import { DatesReportFormComponent } from '../dates-report-form/dates-report-form.component';
import { ProductsReportFormComponent } from '../products-report-form/products-report-form.component';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';

@Component({
  selector: 'lib-report-flow',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    CategoriesReportFormComponent,
    ProductsReportFormComponent,
    DatesReportFormComponent,
    ReportPreviewComponent,
  ],
  templateUrl: './report-flow.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportFlowComponent {
  private readonly _stepsStateSubject: BehaviorSubject<ReportFlowStepsViewModel> =
    new BehaviorSubject<ReportFlowStepsViewModel>({
      activeStepIdx: 0,
      completedStepsIdx: [],
    });
  readonly stepsState$: Observable<ReportFlowStepsViewModel> =
    this._stepsStateSubject.asObservable().pipe(shareReplay(1));

  readonly steps$: Observable<ReportFlowStepItemViewModel[]> = combineLatest([
    this.stepsState$,
    of(['Categories', 'Products', 'Date Range', 'Preview']),
  ]).pipe(
    map(([stepsState, stepNames]: [ReportFlowStepsViewModel, string[]]) =>
      stepNames.map((name: string, idx: number) => ({
        idx,
        name,
        isCompleted: stepsState.completedStepsIdx.includes(idx),
        isActive: stepsState.activeStepIdx === idx,
      }))
    ),
    shareReplay(1)
  );

  onStepCompleted(stepIdx: number): void {
    this.stepsState$
      .pipe(
        take(1),
        tap((state: ReportFlowStepsViewModel) =>
          this._stepsStateSubject.next({
            ...state,
            activeStepIdx: stepIdx + 1,
            completedStepsIdx: [...state.completedStepsIdx, stepIdx],
          })
        )
      )
      .subscribe();
  }

  onStepBack(stepIdx: number): void {
    this.stepsState$
      .pipe(
        take(1),
        tap((state: ReportFlowStepsViewModel) =>
          this._stepsStateSubject.next({
            ...state,
            activeStepIdx: Math.max(stepIdx - 1, 0),
            completedStepsIdx: state.completedStepsIdx.filter(
              (curIdx: number) => curIdx !== stepIdx
            ),
          })
        )
      )
      .subscribe();
  }
}
