export interface ProductReportConfigurationStateModel {
  readonly walletsIds: string[];
  readonly products: string[];
  readonly categories: string[];
  readonly dates: {
    readonly fromDate: Date | undefined;
    readonly toDate: Date | undefined;
  };
  readonly selectedPreviewCategory: string | null;
}
