import type { Notifier } from "@microsoft/fast-element";
import { Observable } from "@microsoft/fast-element/observable.js";

/**
 * A map of object paths to their corresponding proxies and observers
 */
interface ObserverMapEntry {
    proxy: any;
    notifier: Notifier;
    originalObject: any;
    path: string;
}

/**
 * ObserverMap provides functionality for defining observable properties on class prototypes
 * and creating proxies to watch for changes on dot syntax binding paths
 */
export class ObserverMap {
    private observerEntries = new Map<string, ObserverMapEntry>();
    private propertyDefinitions = new WeakMap<any, Set<string>>();
    private cachedPaths = new Set<string>();
    private classPrototype: any;

    constructor(classPrototype: any) {
        this.classPrototype = classPrototype;
    }

    /**
     * Caches a binding path for later use
     * @param path - The path to cache
     */
    public cachePath(path: string): void {
        this.cachedPaths.add(path);
    }

    /**
     * Gets all cached paths
     * @returns Set of cached paths
     */
    public getCachedPaths(): Set<string> {
        return new Set(this.cachedPaths);
    }

    /**
     * Defines an observable property on the class prototype
     * @param propertyName - The name of the property to define
     */
    public defineProperty(propertyName: string): void {
        // Track defined properties for this prototype
        if (!this.propertyDefinitions.has(this.classPrototype)) {
            this.propertyDefinitions.set(this.classPrototype, new Set());
        }
        const propertySet = this.propertyDefinitions.get(this.classPrototype);
        if (propertySet) {
            propertySet.add(propertyName);
        }

        // Use fast-element's Observable.defineProperty
        Observable.defineProperty(this.classPrototype, propertyName);
    }

    /**
     * Creates a proxy to watch for changes on a dot syntax binding path
     * @param target - The target object to observe
     * @param path - The dot syntax path (e.g., "object.foo")
     * @returns A proxy object that intercepts property access
     */
    public createPathProxy(target: any, path: string): any {
        const key = `${target.constructor.name}:${path}`;

        // Return existing proxy if it exists
        const existingEntry = this.observerEntries.get(key);
        if (existingEntry) {
            return existingEntry.proxy;
        }

        const pathSegments = path.split(".");
        const rootProperty = pathSegments[0];

        // Ensure the root property is observable by defining it if needed
        this.defineProperty(rootProperty);

        // Create proxy that intercepts property access
        const proxy = this.createNestedProxy(target, pathSegments);

        // Store the observer entry
        this.observerEntries.set(key, {
            proxy,
            notifier: Observable.getNotifier(target),
            originalObject: target,
            path,
        });

        return proxy;
    }

    /**
     * Creates a nested proxy for deep property observation
     * @param target - The target object
     * @param pathSegments - Array of property names in the path
     * @returns Proxy object
     */
    private createNestedProxy(target: any, pathSegments: string[]): any {
        // Create a proxy for the target object
        return new Proxy(target, {
            set: (obj: any, prop: string | symbol, value: any) => {
                const oldValue = obj[prop];
                obj[prop] = value;

                // Notify of change if the value actually changed
                if (oldValue !== value && typeof prop === "string") {
                    Observable.notify(obj, prop);
                }

                return true;
            },
        });
    }

    /**
     * Removes observation for a specific path
     * @param target - The target object
     * @param path - The dot syntax path to stop observing
     */
    public removePathObserver(target: any, path: string): void {
        const key = `${target.constructor.name}:${path}`;
        const entry = this.observerEntries.get(key);

        if (entry) {
            this.observerEntries.delete(key);
        }
    }

    /**
     * Gets all defined properties for the class prototype
     * @returns Set of property names that have been defined as observable
     */
    public getDefinedProperties(): Set<string> {
        return this.propertyDefinitions.get(this.classPrototype) || new Set();
    }

    /**
     * Clears all observer entries and property definitions
     */
    public clear(): void {
        this.observerEntries.clear();
        this.propertyDefinitions = new WeakMap();
        this.cachedPaths.clear();
    }
}
