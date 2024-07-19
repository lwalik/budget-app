export interface ReportFlowStepsViewModel {
  readonly activeStepIdx: number;
  readonly completedStepsIdx: number[];
}

export interface ReportFlowStepItemViewModel {
  readonly idx: number;
  readonly name: string;
  readonly isCompleted: boolean;
  readonly isActive: boolean;
}
