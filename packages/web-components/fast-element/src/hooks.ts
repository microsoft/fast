import { BindingObserver, Observable } from "./observation/observable.js";
import { makeObservable } from "./utilities.js";

/**
 * Functions used for getting and setting a stateful value.
 * @beta
 */
export type State<T> = [() => T, (newValue: T) => T];

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

/**
 * Executes an action once, and then whenever any of its dependent state changes.
 * @param action An action that is affected by state changes.
 * @returns A BindingObserver which can be used to dispose of the effect.
 */
export function useEffect(action: () => void): BindingObserver {
    /* eslint prefer-const: 0 */
    let observer: BindingObserver;

    const subscriber = {
        handleChange() {
            observer.observe(effectModel);
        },
    };

    observer = Observable.binding(action, subscriber);
    observer.setMode(false);
    subscriber.handleChange();

    return observer;
}
