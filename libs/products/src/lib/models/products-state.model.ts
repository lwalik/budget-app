import { ProductReportConfigurationStateModel } from './product-report-configuration-state.model';
import { ProductModel } from './product.model';

export interface ProductsStateModel {
  readonly products: ProductModel[];
  readonly reportConfiguration:
    | ProductReportConfigurationStateModel
    | undefined;
}
