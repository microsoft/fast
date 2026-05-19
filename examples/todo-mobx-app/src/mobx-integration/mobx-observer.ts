import { reaction } from "mobx";
import { Observable } from "@microsoft/fast-element";

type MobxReactionDisposer = () => void;

type MobxObserverInstance = {
    _mobxReactionDisposers?: MobxReactionDisposer[];
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    [key: string]: any;
};

type MobxObserverConstructor = abstract new (...args: any[]) => any;

type MobxLifecycleCallback = (() => void) & {
    [mobxObserverWrapped]?: true;
};

const trackedMobxObservableKeys = new WeakMap<object, Set<string>>();
const mobxObserverWrapped = Symbol("mobx-observer-wrapped");
const mobxReactionDisposersProperty = "_mobxReactionDisposers";

function collectMobxObservableKeys(proto: object | null): Set<string> {
    const keys = new Set<string>();
    let current = proto;

    while (current !== null && current !== Object.prototype) {
        const currentKeys = trackedMobxObservableKeys.get(current);

        if (currentKeys !== void 0) {
            for (const key of currentKeys) {
                keys.add(key);
            }
        }

        current = Object.getPrototypeOf(current);
    }

    return keys;
}

function setMobxReactionDisposers(
    instance: MobxObserverInstance,
    disposers: MobxReactionDisposer[] | undefined,
): void {
    Object.defineProperty(instance, mobxReactionDisposersProperty, {
        configurable: true,
        enumerable: false,
        value: disposers,
        writable: true,
    });
}

function disposeMobxReactionDisposers(instance: MobxObserverInstance): void {
    const disposers = instance[mobxReactionDisposersProperty];

    if (disposers === void 0) {
        return;
    }

    for (const dispose of disposers) {
        dispose();
    }

    setMobxReactionDisposers(instance, void 0);
}

function markMobxObserverWrapped(callback: MobxLifecycleCallback): void {
    Object.defineProperty(callback, mobxObserverWrapped, {
        configurable: false,
        enumerable: false,
        value: true,
        writable: false,
    });
}

/**
 * Decorates a FASTElement getter so FAST template bindings track reads and
 * `@mobxObserver` can notify it when its MobX dependencies change.
 */
export function mobxObservableProperty(
    target: object,
    key: string,
    descriptor: PropertyDescriptor,
): PropertyDescriptor {
    const originalGetter = descriptor?.get;

    if (originalGetter === void 0) {
        throw new Error(
            `@mobxObservableProperty can only be applied to a getter. ` +
                `"${key}" does not define a getter.`,
        );
    }

    let keys = trackedMobxObservableKeys.get(target);

    if (keys === void 0) {
        keys = new Set<string>();
        trackedMobxObservableKeys.set(target, keys);
    }

    keys.add(key);

    descriptor.get = function (this: object) {
        Observable.track(this, key);
        return originalGetter.call(this);
    };

    return descriptor;
}

/**
 * Wires a FASTElement class to MobX by reacting to every
 * `@mobxObservableProperty` getter and notifying FAST when those values change.
 */
export function mobxObserver<T extends MobxObserverConstructor>(target: T): T {
    const prototype = target.prototype as MobxObserverInstance;
    const originalConnectedCallback = prototype.connectedCallback as
        | MobxLifecycleCallback
        | undefined;
    const originalDisconnectedCallback = prototype.disconnectedCallback as
        | MobxLifecycleCallback
        | undefined;

    if (originalConnectedCallback?.[mobxObserverWrapped] !== true) {
        const connectedCallback: MobxLifecycleCallback = function (
            this: MobxObserverInstance,
        ): void {
            originalConnectedCallback?.call(this);
            disposeMobxReactionDisposers(this);

            const mobxObservableKeys = collectMobxObservableKeys(
                Object.getPrototypeOf(this),
            );
            const disposers = Array.from(mobxObservableKeys, key =>
                reaction(
                    () => this[key],
                    () => Observable.notify(this, key),
                ),
            );

            setMobxReactionDisposers(this, disposers);
        };

        markMobxObserverWrapped(connectedCallback);

        Object.defineProperty(prototype, "connectedCallback", {
            configurable: true,
            enumerable: false,
            value: connectedCallback,
            writable: true,
        });
    }

    if (originalDisconnectedCallback?.[mobxObserverWrapped] !== true) {
        const disconnectedCallback: MobxLifecycleCallback = function (
            this: MobxObserverInstance,
        ): void {
            disposeMobxReactionDisposers(this);
            originalDisconnectedCallback?.call(this);
        };

        markMobxObserverWrapped(disconnectedCallback);

        Object.defineProperty(prototype, "disconnectedCallback", {
            configurable: true,
            enumerable: false,
            value: disconnectedCallback,
            writable: true,
        });
    }

    return target;
}
