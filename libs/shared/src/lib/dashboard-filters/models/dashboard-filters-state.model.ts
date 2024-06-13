export interface DashboardFiltersStateModel {
  readonly wallet: DashboardFiltersWalletStateModel;
  readonly startDate: Date;
  readonly endDate: Date;
}

export interface DashboardFiltersWalletStateModel {
  readonly id: string | undefined;
  readonly name: string;
}
