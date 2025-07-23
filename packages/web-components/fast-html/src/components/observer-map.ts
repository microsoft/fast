import { Observable } from "@microsoft/fast-element/observable.js";

/**
 * ObserverMap provides functionality for caching binding paths, extracting root properties,
 * and defining observable properties on class prototypes
 */
export class ObserverMap {
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
    }

    /**
     * Gets all defined properties for the class prototype
     * @returns Set of property names that have been defined as observable
     */
    public getDefinedProperties(): Set<string> {
        return this.propertyDefinitions.get(this.classPrototype) || new Set();
    }
}
