// Inspired by https://www.starbeamjs.com/

import { Disposable, isFunction, isString } from "../interfaces.js";
import type { Subscriber } from "../observation/notifier.js";
import { ExpressionNotifier, Observable } from "../observation/observable.js";
import { reactive } from "./reactive.js";

export type StateOptions = {
    deep?: boolean;
    description?: string;
};

const defaultStateOptions: StateOptions = {
    deep: false
};

export type ReadonlyState<T> = {
    (): T;
    readonly current: T;
};

export type State<T> = ReadonlyState<T> & {
    current: T;
    set(value: T): void;
    asReadonly(): ReadonlyState<T>;
}

export function state<T>(
    value: T,
    options: string | StateOptions = defaultStateOptions
): State<T> {
    if (isString(options)) {
        options = { deep: false, description: options }
    }

    const host = reactive({ value }, options.deep);
    const state = (() => host.value) as State<T>;

    Object.defineProperty(state, "current", {
        get: () => host.value,
        set: (value: T) => host.value = value
    });

    Object.defineProperty(state, "name", {
        value: options.description ?? "SharedState"
    });

    state.set = (value: T) => host.value = value;
    state.asReadonly = () => {
        const readonlyState = (() => host.value) as ReadonlyState<T>;

        Object.defineProperty(readonlyState, "current", {
            get: () => host.value,
        });

        Object.defineProperty(readonlyState, "name", {
            value: `${state.name} (Readonly)`
        });

        return Object.freeze(readonlyState);
    };

    return state;
}

export type ReadonlyOwnedState<T> = {
    (owner: any): T;
}

export type OwnedState<T> = ReadonlyOwnedState<T> & {
    set(owner: any, value: T): void;
    asReadonly(): ReadonlyOwnedState<T>;
}

export function ownedState<T>(
    value: T | (() => T),
    options: string | StateOptions = defaultStateOptions
): OwnedState<T> {
    if (isString(options)) {
        options = { deep: false, description: options }
    }

    if (!isFunction(value)) {
        const v = value;
        value = () => v;
    }

    const storage = new WeakMap<any, { value: T }>();
    const getHost = (owner: any) => {
        let host = storage.get(owner);

        if (host === void 0) {
            host = reactive(
                { value: (value as () => T)() },
                (options as StateOptions).deep
            );

            storage.set(owner, host);
        }

        return host;
    }

    const state = ((owner: any) =>
        getHost(owner).value) as OwnedState<T>;

    Object.defineProperty(state, "name", {
        value: options.description ?? "OwnedState"
    });

    state.set = (owner: any, value: T) => getHost(owner).value = value;

    state.asReadonly = () => {
        const readonlyState = ((owner: any) =>
            getHost(owner).value) as OwnedState<T>;

        Object.defineProperty(readonlyState, "name", {
            value: `${state.name} (Readonly)`
        });

        return Object.freeze(readonlyState);
    };

    return state;
}

export type ComputedState<T> = ReadonlyState<T> & Disposable & {
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     */
     subscribe(subscriber: Subscriber): void;

     /**
      * Unsubscribes from notification of changes in an object's state.
      * @param subscriber - The object that is unsubscribing from change notification.
      */
     unsubscribe(subscriber: Subscriber): void;
};

export type ComputedSetupCallback = {
    (): () => void;
};

export type ComputedBuilder = {
    on: {
        setup(callback: ComputedSetupCallback): void
    }
};

export type ComputedInitializer<T> = {
    (controller: ComputedBuilder): () => T;
};

export function computedState<T>(
    initialize: ComputedInitializer<T>,
    description = "ComputedState"
) {
    let setupCallback: ComputedSetupCallback | null = null;
    const builder: ComputedBuilder  = {
        on: {
            setup(callback: ComputedSetupCallback) {
                setupCallback = callback;
            }
        }
    };

    const computer = initialize(builder);
    const host = reactive<any>({ value: null }, false);
    const output: ComputedState<T> = (() => host.value) as any;

    Object.defineProperty(output, "current", {
        get: () => host.value,
    });

    Object.defineProperty(output, "name", {
        value: description
    });

    // eslint-disable-next-line prefer-const
    let computedNotifier: ExpressionNotifier;
    const computedSubscriber = {
        handleChange() {
            host.value = computedNotifier.observe(null);
        },
    };

    computedNotifier = Observable.binding(computer, computedSubscriber);
    computedNotifier.setMode(false);

    let cleanup;
    let setupNotifier: ExpressionNotifier;

    if (setupCallback) {
        const setupSubscriber = {
            handleChange() {
                if (cleanup) {
                    cleanup();
                }

                cleanup = setupNotifier.observe(null);
                host.value = computer();
            },
        };

        setupNotifier = Observable.binding(setupCallback, setupSubscriber);
        setupNotifier.setMode(false);
        cleanup = setupNotifier.observe(null);
    }

    host.value = computedNotifier.observe(null);

    output.dispose = () => {
        if (cleanup) {
            cleanup();
        }

        if (setupNotifier) {
            setupNotifier.dispose();
        }

        computedNotifier.dispose();
    };

    output.subscribe = (subscriber: Subscriber) => {
        computedNotifier.subscribe(subscriber);
    };

    output.unsubscribe = (subscriber: Subscriber) => {
        computedNotifier.unsubscribe(subscriber);
    };

    return output;
}

// const time = computedState(x => {
//     const time = state(new Date());

//     x.on.setup(() => {
//         const interval = setInterval(() => {
//           time.set(new Date());
//         });

//         return () => clearInterval(interval);
//     });

//     return () => {
//         const now = time.current;

//         return new Intl.DateTimeFormat("en-US", {
//             hour: "numeric",
//             minute: "numeric",
//             second: "numeric",
//             hour12: false,
//         }).format(now);
//     };
// });
