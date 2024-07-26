export interface ProductReportConfigurationStateModel {
  readonly products: string[];
  readonly categories: string[];
  readonly dates: {
    readonly fromDate: Date | undefined;
    readonly toDate: Date | undefined;
  };
}
