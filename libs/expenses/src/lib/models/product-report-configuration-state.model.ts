export interface ProductReportConfigurationStateModel {
  readonly products: string[];
  readonly categories: string[];
  readonly fromDate: Date | undefined;
  readonly toDate: Date | undefined;
}
