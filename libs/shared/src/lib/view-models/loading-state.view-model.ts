export interface LoadingStateViewModel<T> {
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly data: T;
}
