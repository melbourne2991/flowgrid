import { Observable, BehaviorSubject, empty } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ObservableContainer } from "./types";

export function createObservableContainer<T>(): ObservableContainer<T> {
  const swapInput$ = new BehaviorSubject<Observable<T | never>>(empty());

  return {
    $: swapInput$.pipe(switchMap((newInput: Observable<T>) => newInput)),

    set(newObservable: Observable<T>) {
      swapInput$.next(newObservable);
    },

    clear() {
      swapInput$.next(empty());
    }
  };
}
