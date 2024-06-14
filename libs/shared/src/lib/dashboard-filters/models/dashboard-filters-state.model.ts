export interface DashboardFiltersStateModel {
  readonly wallet: DashboardFiltersWalletStateModel;
  readonly fromDate: Date;
  readonly toDate: Date;
}

export interface DashboardFiltersWalletStateModel {
  readonly id: string | undefined;
  readonly name: string;
}
