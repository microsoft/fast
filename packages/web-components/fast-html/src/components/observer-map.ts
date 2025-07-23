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
        return this.cachedPaths;
    }

    /**
     * Gets the root properties from all cached paths
     * @returns Set of root property names extracted from cached paths
     */
    public getCachedRootProperties(): Set<string> {
        const rootProperties = new Set<string>();

        for (const path of this.cachedPaths) {
            const rootProperty = path.split(".")[0];
            rootProperties.add(rootProperty);
        }

        return rootProperties;
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

        // Set up notification handling for the property
        const notifier = Observable.getNotifier(this.classPrototype);
        notifier.subscribe(
            {
                handleChange: (source: any, args: any) =>
                    this.handlePropertyChange(source, args, propertyName),
            },
            propertyName
        );
    }

    /**
     * Handles property changes and creates path proxies when properties change from undefined to defined
     * @param source - The source object that changed
     * @param args - The change arguments containing property name and values
     * @param rootProperty - The root property name that was defined
     */
    private handlePropertyChange(source: any, args: any, rootProperty: string): void {
        if (args && args.oldValue === undefined && args.newValue !== undefined) {
            // Find all cached paths that match this root property
            const matchingPaths = Array.from(this.cachedPaths).filter(
                path => path.startsWith(rootProperty + ".") || path === rootProperty
            );

            // Create path proxies for all matching paths
            matchingPaths.forEach(path => {
                this.createPathProxy(source, path);
            });
        }
    }

    /**
     * Creates a proxy to watch for changes on a dot syntax binding path
     * @param target - The target object to observe
     * @param path - The dot syntax path (e.g., "object.foo")
     * @returns A proxy object that intercepts property access
     */
    private createPathProxy(target: any, path: string): any {
        // Return existing proxy if it exists
        const existingEntry = this.observerEntries.get(path);
        if (existingEntry) {
            return existingEntry.proxy;
        }

        // Create proxy that intercepts property access
        const proxy = this.createObservableProxy(target);

        // Store the observer entry
        this.observerEntries.set(path, {
            proxy,
            notifier: Observable.getNotifier(target),
            originalObject: target,
            path,
        });

        return proxy;
    }

    /**
     * Creates a proxy that makes property changes observable
     * @param target - The target object
     * @returns Proxy object that notifies on property changes
     */
    private createObservableProxy(target: any): any {
        // Create a proxy for the target object
        return new Proxy(target, {
            set: (obj: any, prop: string | symbol, value: any) => {
                const oldValue = obj[prop];
                obj[prop] = value;

                // Notify of change if the value actually changed
                if (oldValue !== value && typeof prop === "string") {
                    Observable.notify(obj, prop);

                    // If property is set to undefined or null, clean up related observer entries
                    if (value === undefined || value === null) {
                        this.cleanupObserverEntries(prop);
                    }
                }

                return true;
            },
            deleteProperty: (obj: any, prop: string | symbol) => {
                if (typeof prop === "string" && prop in obj) {
                    delete obj[prop];
                    Observable.notify(obj, prop);

                    // Clean up related observer entries when property is deleted
                    this.cleanupObserverEntries(prop);

                    return true;
                }
                return false;
            },
        });
    }

    /**
     * Cleans up observer entries for paths that start with the given property
     * @param propertyName - The property name that was set to undefined/null or deleted
     */
    private cleanupObserverEntries(propertyName: string): void {
        // Find all observer entries that start with this property
        const entriesToRemove: string[] = [];

        for (const path of this.observerEntries.keys()) {
            if (path.startsWith(propertyName + ".") || path === propertyName) {
                entriesToRemove.push(path);
            }
        }

        // Remove the entries
        entriesToRemove.forEach(path => {
            this.observerEntries.delete(path);
        });
    }

    /**
     * Gets all defined properties for the class prototype
     * @returns Set of property names that have been defined as observable
     */
    public getDefinedProperties(): Set<string> {
        return this.propertyDefinitions.get(this.classPrototype) || new Set();
    }

    /**
     * Checks if a path proxy exists and the path is valid in the target object
     * @param target - The target object to check
     * @param path - The property path to check
     * @returns True if a proxy exists AND the path is traversable
     */
    public hasPathProxy(target: any, path: string): boolean {
        // First check if we have an observer entry for this path
        if (!this.observerEntries.has(path)) {
            return false;
        }

        // Then verify the path is actually traversable in the target object
        const pathSegments = path.split(".");
        let current = target;

        for (const segment of pathSegments) {
            // Check if current is null, undefined, or doesn't have the property
            if (current == null || typeof current !== "object") {
                return false;
            }

            if (!(segment in current)) {
                return false;
            }

            current = current[segment];
        }

        return true;
    }

    /**
     * Manually processes cached paths for a target object (primarily for testing)
     * @param target - The target object to process cached paths for
     * @param rootProperty - The root property that was defined
     */
    public processCachedPaths(target: any, rootProperty: string): void {
        // Find all cached paths that match this root property
        const matchingPaths = Array.from(this.cachedPaths).filter(
            path => path.startsWith(rootProperty + ".") || path === rootProperty
        );

        // Create path proxies for all matching paths
        matchingPaths.forEach(path => {
            this.createPathProxy(target, path);
        });
    }
}
