// Inspired by https://www.starbeamjs.com/

import { Disposable, isFunction, isString } from "../interfaces.js";
import type { Subscriber } from "../observation/notifier.js";
import { ExpressionNotifier, Observable } from "../observation/observable.js";
import { reactive } from "./reactive.js";

/**
 * Options for creating state.
 * @beta
 */
export type StateOptions = {
    /**
     * Indicates whether to deeply make the state value observable.
     */
    deep?: boolean;

    /**
     * A friendly name for the state.
     */
    name?: string;
};

const defaultStateOptions: StateOptions = {
    deep: false,
};

/**
 * A readonly stateful value.
 * @beta
 */
export type ReadonlyState<T> = {
    /**
     * Gets the current state value.
     */
    (): T;

    /**
     * Gets the current state value.
     */
    readonly current: T;
};

/**
 * A read/write stateful value.
 * @beta
 */
export type State<T> = ReadonlyState<T> & {
    /**
     * Gets or sets the current state value.
     */
    current: T;

    /**
     * Sets the current state value.
     * @param value The new state value.
     */
    set(value: T): void;

    /**
     * Creates a readonly version of the state.
     */
    asReadonly(): ReadonlyState<T>;
};

/**
 * Creates a reactive state value.
 * @param value - The initial state value.
 * @param options - Options to customize the state or a friendly name.
 * @returns A State instance.
 * @beta
 */
export function state<T>(
    value: T,
    options: string | StateOptions = defaultStateOptions
): State<T> {
    if (isString(options)) {
        options = { deep: false, name: options };
    }

    const host = reactive({ value }, options.deep);
    const state = (() => host.value) as State<T>;

    Object.defineProperty(state, "current", {
        get: () => host.value,
        set: (value: T) => (host.value = value),
    });

    Object.defineProperty(state, "name", {
        value: options.name ?? "SharedState",
    });

    state.set = (value: T) => (host.value = value);
    state.asReadonly = () => {
        const readonlyState = (() => host.value) as ReadonlyState<T>;

        Object.defineProperty(readonlyState, "current", {
            get: () => host.value,
        });

        Object.defineProperty(readonlyState, "name", {
            value: `${state.name} (Readonly)`,
        });

        return Object.freeze(readonlyState);
    };

    return state;
}

/**
 * A readonly stateful value associated with an object owner.
 * @beta
 */
export type ReadonlyOwnedState<T> = {
    /**
     * Gets the current stateful value for the owner.
     */
    (owner: any): T;
};

/**
 * A read/write stateful value associated with an owner.
 * @beta
 */
export type OwnedState<T> = ReadonlyOwnedState<T> & {
    /**
     * Sets
     * @param owner - The object to set the state for the owner.
     * @param value - The new state value.
     */
    set(owner: any, value: T): void;

    /**
     * Creates a readonly version of the state.
     */
    asReadonly(): ReadonlyOwnedState<T>;
};

/**
 * Creates a reactive state that has its value associated with a specific owner.
 * @param value - The initial value or a factory that provides an initial value for each owner.
 * @param options - Options to customize the state or a friendly name.
 * @returns An OwnedState instance.
 * @beta
 */
export function ownedState<T>(
    value: T | (() => T),
    options: string | StateOptions = defaultStateOptions
): OwnedState<T> {
    if (isString(options)) {
        options = { deep: false, name: options };
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
    };

    const state = ((owner: any) => getHost(owner).value) as OwnedState<T>;

    Object.defineProperty(state, "name", {
        value: options.name ?? "OwnedState",
    });

    state.set = (owner: any, value: T) => (getHost(owner).value = value);

    state.asReadonly = () => {
        const readonlyState = ((owner: any) => getHost(owner).value) as OwnedState<T>;

        Object.defineProperty(readonlyState, "name", {
            value: `${state.name} (Readonly)`,
        });

        return Object.freeze(readonlyState);
    };

    return state;
}

/**
 * State whose value is computed from other dependencies.
 * @beta
 */
export type ComputedState<T> = ReadonlyState<T> &
    Disposable & {
        /**
         * Subscribes to notification of changes in the state.
         * @param subscriber - The object that is subscribing for change notification.
         */
        subscribe(subscriber: Subscriber): void;

        /**
         * Unsubscribes from notification of changes in the state.
         * @param subscriber - The object that is unsubscribing from change notification.
         */
        unsubscribe(subscriber: Subscriber): void;
    };

/**
 * A callback that enables computation setup.
 * @beta
 */
export type ComputedSetupCallback = () => (() => void) | void;

/**
 * Provides computed state capabilities.
 * @beta
 */
export type ComputedBuilder = {
    /**
     * Callbacks related to computed state.
     */
    on: {
        /**
         * Provides a setup callback for the computation.
         * @param callback The callback to run to setup the computation.
         */
        setup(callback: ComputedSetupCallback): void;
    };
};

/**
 * A callback that initializes the computation.
 * @beta
 */
export type ComputedInitializer<T> = (builder: ComputedBuilder) => () => T;

/**
 * Creates a ComputedState.
 * @param initialize - The initialization callback.
 * @param name - A friendly name for this computation.
 * @returns A ComputedState
 * @beta
 */
export function computedState<T>(
    initialize: ComputedInitializer<T>,
    name = "ComputedState"
): ComputedState<T> {
    let setupCallback: ComputedSetupCallback | null = null;
    const builder: ComputedBuilder = {
        on: {
            setup(callback: ComputedSetupCallback) {
                setupCallback = callback;
            },
        },
    };

    const computer = initialize(builder);
    const host = reactive<any>({ value: null }, false);
    const output: ComputedState<T> = (() => host.value) as any;

    Object.defineProperty(output, "current", {
        get: () => host.value,
    });

    Object.defineProperty(output, "name", {
        value: name,
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
