export interface PaginationViewModel {
  readonly first: number;
  readonly last: number;
  readonly current: number;
  readonly limit: number;
  readonly totalItems: number;
}
