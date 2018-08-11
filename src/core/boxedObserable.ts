import { Observable, BehaviorSubject, zip, interval, empty } from "rxjs";
import { map, switchMap } from "rxjs/operators";

export interface ObservableContainer<T> {
  set(newObservable: Observable<T>): void;
  $: Observable<T>;
  clear(): void;
}

export function createObservableContainer(): ObservableContainer<any> {
  const swapInput$ = new BehaviorSubject<Observable<any>>(empty());

  return {
    $: swapInput$.pipe(switchMap(newInput => newInput)),

    set(newObservable: Observable<any>) {
      swapInput$.next(newObservable);
    },

    clear() {
      swapInput$.next(empty());
    }
  };
}
