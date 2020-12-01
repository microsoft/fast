import { Subscriber } from "@microsoft/fast-element";
import { DI, InterfaceSymbol } from "../di";

// Thanks to https://github.com/microsoft/TypeScript/issues/13298#issuecomment-423390349
type ElementOf<T> = T extends (infer E)[] ? E : T;

/**
 * A static design token value
 * @public
 */
export type StaticTokenValue<T extends {}, K extends keyof T> = T[K];

/**
 * A design token value derived from other design token values
 * @public
 */
export interface DerivedTokenValue<T extends {}, K, D extends Array<keyof T>> {
    dependencies?: D;
    derive(values: Pick<T, ElementOf<D>>): K;
}

/**
 * @public
 */
export interface DesignTokenLibrary<T extends {}> {
    /**
     * Gets the composed value associated to a key. This method will ask any
     * upstream DesignSystem for the value if a local value does not exist.
     * @param key - The key from which to retrieve an associated value
     */
    get<K extends keyof T>(key: K): T[K] | void;

    /**
     * Sets a value on an instance for a key.
     * @param key - The key for which to set the value
     * @param value - The value to set
     */
    set<K extends keyof T>(key: K, value: T[K]): void;

    set<K extends keyof T, D extends Array<keyof T>>(
        key: K,
        value: DerivedTokenValue<T, T[K], D>
    ): void;

    /**
     * Determines if a value exists in the library for a provided key.
     * @param key - The key for which to check if a value exists.
     */
    has<K extends keyof T>(key: K): boolean; // TODO can we get some type-guarding here so TS knows T[K] exists?

    /**
     * Deletes a value from an instance.
     *
     * @param key - The key for which to delete the value
     */
    delete<K extends keyof T>(key: K): void;

    /**
     * Subscribes an instance to changes to the design token library
     * @param subscriber - The subscriber to notify when properties change
     * @param keys - The list of token keys to subscribe to. If omitted, all
     * tokens will be subscribed to
     */
    subscribe(subscriber: Subscriber, ...keys: Array<keyof T>): void;

    /**
     * Un-subscribes an instance to changes to the design token library
     * @param subscriber - The subscriber to notify when properties change
     */
    unsubscribe(subscriber: Subscriber, ...keys: Array<keyof T>): void;

    /**
     * Returns keys for all values that have been set on the DesignTokenLibrary
     */
    keys<K extends keyof T>(): Array<K>;
}

/**
 * @public
 */
export interface InheritableDesignTokenLibrary<T extends {}>
    extends DesignTokenLibrary<T> {
    /**
     * The upstream object an InheritableDesignTokenLibrary should inherit from.
     */
    upstream: DesignTokenLibrary<T> | null;

    /**
     * Determines if a value exists locally in the library for a provided key.
     * @param key - The key for which to check if a local value exists.
     */
    hasLocal<K extends keyof T>(key: K): boolean; // TODO can we get some type-guarding here so TS knows T[K] exists?
}

/**
 * An implementation of {@link InheritableDesignTokenLibrary} for managing application design tokens
 * @public
 */
export class DesignTokenLibraryImpl<T> implements InheritableDesignTokenLibrary<T> {
    private static isDerived<T extends {}, K extends keyof T, D extends Array<keyof T>>(
        value: StaticTokenValue<T, K> | DerivedTokenValue<T, T[K], D>
    ): value is DerivedTokenValue<T, T[K], D> {
        return (
            value && typeof (value as DerivedTokenValue<T, T[K], D>).derive === "function"
        );
    }

    #local = new Map();
    #subscribers = new Map<this | keyof T, Set<Subscriber>>();
    #upstream: InheritableDesignTokenLibrary<T> | null = null;
    // TODO is there a better way to get K than an IIFE?
    #derivedProperties = (<K extends keyof T>() =>
        new Map<K, Subscriber & DerivedTokenValue<T, T[K], Array<keyof T>>>())();

    /**
     * {@inheritdoc InheritableDesignTokenLibrary.upstream}
     */
    public get upstream(): InheritableDesignTokenLibrary<T> | null {
        return this.#upstream;
    }

    public set upstream(target: InheritableDesignTokenLibrary<T> | null) {
        const prev = this.#upstream;
        this.#upstream = target;

        if (prev !== null) {
            prev.unsubscribe(this.handleUpstreamChange);
        }

        if (target) {
            target.subscribe(this.handleUpstreamChange);
        }
    }

    /**
     *
     * @param init - The values to initialize the token library with
     */
    constructor(init?: T) {
        if (init) {
            for (const key in init) {
                this.set(key, init[key]);
            }
        }
    }

    private getOrCreateSubscriberSet(
        container: Map<this | keyof T, Set<Subscriber>>,
        key: this | keyof T
    ): Set<Subscriber> {
        if (container.has(key)) {
            return container.get(key)!;
        }

        const set = new Set<Subscriber>();
        container.set(key, set);
        return set;
    }

    /**
     * Invoked when any upstream values change.
     * @param source - the upstream source object
     * @param keys  - the keys that were changed
     */
    private handleUpstreamChange = {
        handleChange: <K extends keyof T>(
            source: DesignTokenLibrary<T>,
            keys: Array<K>
        ): void => {
            if (this.#subscribers.size) {
                const changed = keys.filter(key => !this.#local.has(key));

                if (changed.length) {
                    this.getOrCreateSubscriberSet(this.#subscribers, this).forEach(x => {
                        x.handleChange(this, changed);
                    });
                }
            }
        },
    };

    /**
     * {@inheritdoc DesignTokenLibrary.get}
     */
    public get<K extends keyof T>(key: K): T[K] | void {
        return this.#local.has(key) ? this.#local.get(key) : this.upstream?.get(key);
    }

    /**
     * {@inheritdoc DesignTokenLibrary.set}
     */
    public set<K extends keyof T, D extends Array<keyof T>>(
        key: K,
        value: DerivedTokenValue<T, T[K], D>
    ): void;
    public set<K extends keyof T>(key: K, value: T[K]): void;
    public set<K extends keyof T, D extends Array<keyof T>>(
        key: K,
        value: DerivedTokenValue<T, T[K], D> | T[K]
    ): void {
        if (this.#derivedProperties.has(key)) {
            const derived = this.#derivedProperties.get(key)!;
            const { dependencies } = derived;

            if (dependencies) {
                this.unsubscribeDerived(key, dependencies, derived);
            }
        }

        DesignTokenLibraryImpl.isDerived(value)
            ? this.setDerived(key, value)
            : this.setStatic(key, value);
    }

    /**
     * {@inheritdoc DesignTokenLibrary.setDerived}
     */
    private setDerived<K extends keyof T, D extends Array<keyof T>>(
        key: K,
        value: DerivedTokenValue<T, T[K], D>
    ): void {
        const subscriber = {
            ...value,
            handleChange(source: DesignTokenLibrary<T>, keys: Array<keyof T>) {
                const depChanged =
                    value.dependencies && keys.some(x => value.dependencies!.includes(x));

                if (depChanged) {
                    this.commitChange();
                }
            },
            commitChange: () => {
                const args = value.dependencies
                    ? value.dependencies.reduce((prev, next) => {
                          return {
                              ...prev,
                              [next]:
                                  key === next
                                      ? this.upstream?.get(next)
                                      : this.get(next),
                          };
                      }, {})
                    : {};

                const v = value.derive(args as any);
                if (this.#local.get(key) !== v) {
                    this.#local.set(key, v);

                    this.notify([key]);
                }
            },
        };

        this.#derivedProperties.set(key, subscriber);
        if (value.dependencies !== undefined) {
            this.subscribeDerived(key, value.dependencies, subscriber);
        }
        subscriber.commitChange();
    }

    private setStatic<K extends keyof T>(key: K, value: T[K]): void {
        const prev = this.get(key) || undefined;
        this.#local.set(key, value);

        if (prev !== value) {
            this.notify([key]);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.has}
     */
    public has<K extends keyof T>(key: K): boolean {
        return (
            this.hasLocal(key) || (this.upstream ? this.upstream.hasLocal(key) : false)
        );
    }

    /**
     * {@inheritdoc InheritableDesignTokenLibrary.hasLocal}
     */
    public hasLocal<K extends keyof T>(key: K): boolean {
        return this.#local.has(key);
    }

    /**
     * {@inheritdoc DesignTokenLibrary.delete}
     */
    public delete<K extends keyof T>(key: K): void {
        const prev = this.get(key) || undefined;
        this.#local.delete(key);

        if (this.get(key) !== prev) {
            this.notify([key]);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.subscribe}
     */
    public subscribe(subscriber: Subscriber, ...tokens: Array<keyof T>): void {
        const container = this.#subscribers;

        if (tokens.length) {
            tokens.forEach(x =>
                this.getOrCreateSubscriberSet(container, x).add(subscriber)
            );
        } else {
            this.getOrCreateSubscriberSet(container, this).add(subscriber);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.unsubscribe}
     */
    public unsubscribe(subscriber: Subscriber, ...tokens: Array<keyof T>): void {
        tokens.length
            ? tokens.forEach(x =>
                  this.getOrCreateSubscriberSet(this.#subscribers, x).delete(subscriber)
              )
            : this.getOrCreateSubscriberSet(this.#subscribers, this).delete(subscriber);
    }

    /**
     * {@inheritdoc DesignTokenLibrary.keys}
     */
    public keys<K extends keyof T>(): K[] {
        const localKeys = this.#local.keys();
        const upstreamKeys = this.upstream ? this.upstream.keys() : [];

        return Array.from(new Set([...localKeys, ...upstreamKeys]));
    }

    /**
     * Notifies all subscribers of a change to all the provided keys
     */
    private notify<K extends keyof T>(keys: K[]) {
        const container = this.#subscribers;

        ([this] as Array<this | K>).concat(keys).forEach(x => {
            const set = this.getOrCreateSubscriberSet(container, x);

            if (set.size) {
                const k = x === this ? keys : [x];
                set.forEach(y => {
                    y.handleChange(this, k);
                });
            }
        });
    }

    private subscribeDerived<K extends keyof T, D extends Array<keyof T>>(
        key: K,
        dependencies: D,
        subscriber: Subscriber
    ): void {
        dependencies.forEach(x => {
            x === key
                ? this.upstream?.subscribe(subscriber, x)
                : this.subscribe(subscriber, x);
        });
    }

    private unsubscribeDerived<K extends keyof T, D extends Array<keyof T>>(
        key: K,
        dependencies: D,
        subscriber: Subscriber
    ): void {
        dependencies.forEach(x => {
            x === key
                ? this.upstream?.unsubscribe(subscriber, x)
                : this.unsubscribe(subscriber, x);
        });
    }
}

/**
 * Dependency injection interface for {@link DesignTokenLibraryImpl}
 * @public
 */
export const DIDesignTokens: InterfaceSymbol<DesignTokenLibraryImpl<
    any
>> = DI.createInterface<DesignTokenLibraryImpl<any>>({
    friendlyName: "DesignTokens",
    respectConnection: true,
}).noDefault();
