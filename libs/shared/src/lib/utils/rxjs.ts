import { Observable } from 'rxjs';

export const mapPromiseToVoidObservable = (
  method: Promise<unknown>
): Observable<void> => {
  return new Observable((observer) => {
    method
      .then(() => {
        observer.next(void 0);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
};
