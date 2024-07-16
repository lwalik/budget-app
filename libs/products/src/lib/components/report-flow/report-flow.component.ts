import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-report-flow',
  standalone: true,
  imports: [CommonModule],
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
    )
  );

  onStepClicked(idx: number): void {
    this.stepsState$
      .pipe(
        take(1),
        tap((state: ReportFlowStepsViewModel) =>
          this._stepsStateSubject.next({
            ...state,
            activeStepIdx: idx,
          })
        )
      )
      .subscribe();
  }
}
