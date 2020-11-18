import { Subscriber } from "@microsoft/fast-element";
import { DI, InterfaceSymbol } from "../di";

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
    set<K extends keyof T>(key: K, value: T[K]);

    /**
     * Determines if a value exists in the library for a provided key.
     * @param key The key for which to check if a value exists.
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
     */
    subscribe(subscriber: Subscriber): void;

    /**
     * Un-subscribes an instance to changes to the design token library
     * @param subscriber - The subscriber to notify when properties change
     */
    unsubscribe(subscriber: Subscriber): void;

    /**
     * Returns keys for all values that have been set on the DesignTokenLibrary
     */
    keys<K extends keyof T>(): Array<K>;
}

export interface InheritableDesignTokenLibrary<T extends {}>
    extends DesignTokenLibrary<T> {
    /**
     * The upstream object an InheritableDesignTokenLibrary should inherit from.
     */
    upstream: DesignTokenLibrary<T> | null;

    /**
     * Invoked when any upstream values change.
     * @param source - the upstream source object
     * @param keys  - the keys that were changed
     */
    handleChange<K extends keyof T>(source, keys: Array<K>): void;

    /**
     * Determines if a value exists locally in the library for a provided key.
     * @param key The key for which to check if a local value exists.
     */
    hasLocal<K extends keyof T>(key: K): boolean; // TODO can we get some type-guarding here so TS knows T[K] exists?
}

export class DesignTokenLibraryImpl<T> implements InheritableDesignTokenLibrary<T> {
    #local = new Map();
    #subscribers = new Set<Subscriber>();

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
            prev.unsubscribe(this);
        }

        if (target) {
            target.subscribe(this);
        }
    }

    #upstream: InheritableDesignTokenLibrary<T> | null = null;

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

    /**
     * {@inheritdoc InheritableDesignTokenLibrary.handleChange}
     */
    public handleChange<K extends keyof T>(
        source: DesignTokenLibrary<T>,
        keys: Array<K>
    ): void {
        if (this.#subscribers.size) {
            const changed = keys.filter(key => !this.#local.has(key));

            if (changed.length) {
                this.#subscribers.forEach(x => {
                    x.handleChange(this, changed);
                });
            }
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.get}
     */
    public get<K extends keyof T>(key: K): T[K] | void {
        return this.#local.has(key) ? this.#local.get(key) : this.upstream?.get(key);
    }

    /**
     * {@inheritdoc DesignTokenLibrary.set}
     */
    public set<K extends keyof T>(key: K, value: T[K]): void {
        const prev = this.get(key) || undefined;
        this.#local.set(key, value);

        if (prev !== value) {
            this.notifyAll([key]);
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
            this.notifyAll([key]);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.subscribe}
     */
    public subscribe(subscriber: Subscriber): void {
        this.#subscribers.add(subscriber);
        const keys = this.keys();

        if (keys.length) {
            subscriber.handleChange(this, keys);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.unsubscribe}
     */
    public unsubscribe(subscriber: Subscriber): void {
        this.#subscribers.delete(subscriber);
        subscriber.handleChange(this, this.keys());
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
    private notifyAll<K extends keyof T>(keys: K[]) {
        if (this.#subscribers.size) {
            this.#subscribers.forEach(x => {
                x.handleChange(this, keys);
            });
        }
    }
}

export const DIDesignTokens: InterfaceSymbol<DesignTokenLibraryImpl<
    any
>> = DI.createInterface<DesignTokenLibraryImpl<any>>({
    friendlyName: "DesignTokens",
    respectConnection: true,
}).noDefault();
