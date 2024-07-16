export interface ProductReportConfigurationStateModel {
  readonly productIds: string[];
  readonly categories: string[];
  readonly fromDate: Date;
  readonly toDate: Date;
}
