import { Subscriber } from "@microsoft/fast-element";

interface DesignTokenLibrary<T extends {}> {
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

interface InheritableDesignTokenLibrary<T extends {}> extends DesignTokenLibrary<T> {
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
}

export class FASTDesignTokens<T> implements InheritableDesignTokenLibrary<T> {
    private local = new Map();
    private subscribers = new Set<Subscriber>();

    /**
     * {@inheritdoc InheritableDesignTokenLibrary.upstream}
     */
    public get upstream(): DesignTokenLibrary<T> | null {
        return this._upstream;
    }

    public set upstream(target: DesignTokenLibrary<T> | null) {
        const prev = this._upstream;
        this._upstream = target;

        if (prev !== null) {
            prev.unsubscribe(this);
        }

        if (target) {
            target.subscribe(this);
        }
    }

    private _upstream: DesignTokenLibrary<T> | null = null;

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
        if (this.subscribers.size) {
            const changed = keys.filter(key => !this.local.has(key));

            if (changed.length) {
                this.subscribers.forEach(x => {
                    x.handleChange(this, changed);
                });
            }
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.get}
     */
    public get<K extends keyof T>(key: K): T[K] | void {
        return this.local.has(key) ? this.local.get(key) : this.upstream?.get(key);
    }

    /**
     * {@inheritdoc DesignTokenLibrary.set}
     */
    public set<K extends keyof T>(key: K, value: T[K]): void {
        const prev = this.get(key);
        this.local.set(key, value);

        if (prev !== value) {
            this.notifyAll([key]);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.delete}
     */
    public delete<K extends keyof T>(key: K): void {
        const prev = this.get(key);
        this.local.delete(key);

        if (this.get(key) !== prev) {
            this.notifyAll([key]);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.subscribe}
     */
    public subscribe(subscriber: Subscriber): void {
        this.subscribers.add(subscriber);
        const keys = this.keys();

        if (keys.length) {
            subscriber.handleChange(this, keys);
        }
    }

    /**
     * {@inheritdoc DesignTokenLibrary.unsubscribe}
     */
    public unsubscribe(subscriber: Subscriber): void {
        this.subscribers.delete(subscriber);
        subscriber.handleChange(this, this.keys());
    }

    /**
     * {@inheritdoc DesignTokenLibrary.keys}
     */
    public keys<K extends keyof T>(): K[] {
        const localKeys = this.local.keys();
        const upstreamKeys = this.upstream ? this.upstream.keys() : [];

        return Array.from(new Set([...localKeys, ...upstreamKeys]));
    }

    /**
     * Notifies all subscribers of a change to all the provided keys
     */
    private notifyAll<K extends keyof T>(keys: Array<K>) {
        if (this.subscribers.size) {
            this.subscribers.forEach(x => {
                x.handleChange(this, keys);
            });
        }
    }
}
