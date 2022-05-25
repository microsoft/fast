import type { Disposable } from "./interfaces";
import { Observable } from "./observation/observable.js";
import { makeObservable } from "./utilities.js";

/**
 * Functions used for getting and setting a stateful value.
 * @beta
 */
export type State<T> = [() => T, (newValue: T) => void];

/**
 * Creates an observable state value.
 * @param value The initial state value.
 * @param deep Whether or not to convert the state value to an observable.
 * @returns The state accessor functions.
 * @beta
 */
export function useState<T>(value: T, deep = false): State<T> {
    const host = makeObservable({ value }, deep);
    return [() => host.value, newValue => (host.value = newValue)];
}

const effectModel = Object.freeze({});

export function useEffect(action: () => void): Disposable {
    /* eslint prefer-const: 0 */
    let observer;
    const subscriber = {
        handleChange() {
            observer.observe(effectModel);
        },
    };

    observer = Observable.binding(action, subscriber);
    subscriber.handleChange();

    return observer;
}
