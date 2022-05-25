import type { Disposable } from "./interfaces";
import { ExecutionContext, Observable } from "./observation/observable.js";
import { makeObservable } from "./utilities.js";

export type State<T> = [() => T, (newValue: T) => void];

export function useState<T>(value: T, deep = false): State<T> {
    const host = makeObservable({ value }, deep); // new helper

    function getValue() {
        return host.value;
    }

    function setValue(newValue) {
        host.value = newValue;
    }

    return [getValue, setValue];
}

const effectModel = Object.freeze({});

export function useEffect(action: () => void): Disposable {
    /* eslint prefer-const: 0 */
    let observer;
    const subscriber = {
        handleChange() {
            observer.observe(effectModel, ExecutionContext.default);
        },
    };

    observer = Observable.binding(action, subscriber);
    subscriber.handleChange();

    return observer;
}
