import { Observable } from "@microsoft/fast-element/observable.js";

/**
 * ObserverMap provides functionality for caching binding paths, extracting root properties,
 * and defining observable properties on class prototypes
 */
export class ObserverMap {
    // where the key is the root property and the value is a set of paths
    private propertyDefinitions = new Map<string, Set<string>>();
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
     * Gets the class prototype
     * @returns The class prototype for this instance
     */
    public getClassPrototype(): any {
        return this.classPrototype;
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
        if (!this.propertyDefinitions.has(propertyName)) {
            // store sub-paths belonging to this property definition
            const paths = new Set<string>();
            this.getCachedPaths().forEach(value => {
                if (value.startsWith(`${propertyName}.`)) {
                    paths.add(value.split(".").slice(1).join("."));
                }
            });

            this.propertyDefinitions.set(propertyName, paths);

            Observable.defineProperty(this.classPrototype, propertyName);
            this.classPrototype[`${propertyName}Changed`] =
                this.defineChanged(propertyName);
        }
    }

    /**
     * Evaluates cached paths and creates proxies for nested objects that match the current path context
     * @param target - The target instance that owns the root property
     * @param rootProperty - The name of the root property being evaluated
     * @param object - The current object being evaluated for proxy creation
     * @param currentPath - The current path context (null for root level)
     */
    private evaluatePaths = (
        target: any,
        rootProperty: string,
        object: any,
        currentPath: string | null
    ): void => {
        (this.propertyDefinitions?.get(rootProperty) || []).forEach(value => {
            if (
                currentPath === null ||
                (currentPath !== null && value.startsWith(`${currentPath}.`))
            ) {
                // Create the path to traverse from current position
                const pathToTraverse =
                    currentPath === null
                        ? value.split(".")
                        : value.substring(currentPath.length + 1).split(".");

                // Traverse the path and create proxies for nested objects
                this.traverseAndProxyPath(
                    target,
                    rootProperty,
                    object,
                    currentPath,
                    pathToTraverse
                );
            }
        });
    };

    /**
     * Recursively traverses a path and creates proxies for nested objects at each level
     * @param target - The target instance that owns the root property
     * @param rootProperty - The name of the root property being evaluated
     * @param currentObject - The current object being traversed
     * @param currentPath - The current path context (null for root level)
     * @param remainingPath - Array of remaining path segments to traverse
     */
    private traverseAndProxyPath = (
        target: any,
        rootProperty: string,
        currentObject: any,
        currentPath: string | null,
        remainingPath: string[]
    ): void => {
        if (remainingPath.length === 0) {
            return;
        }

        const [nextSegment, ...restOfPath] = remainingPath;

        if (
            currentObject &&
            typeof currentObject[nextSegment] === "object" &&
            currentObject[nextSegment] !== null
        ) {
            const newPath = this.getCurrentPath(currentPath, nextSegment);

            // Create proxy for this object
            currentObject[nextSegment] = this.getProxyForObject(
                target,
                rootProperty,
                currentObject[nextSegment],
                newPath,
                this.getCurrentPath,
                this.evaluatePaths
            );

            // Continue traversing deeper if there are more segments
            if (restOfPath.length > 0) {
                this.traverseAndProxyPath(
                    target,
                    rootProperty,
                    currentObject[nextSegment],
                    newPath,
                    restOfPath
                );
            }
        }
    };

    /**
     * Constructs a path string by combining the current path with a new path item
     * @param currentPath - The current path context (null for root level)
     * @param pathItem - The path segment to append
     * @returns The combined path string
     */
    private getCurrentPath(currentPath: string | null, pathItem: string): string {
        return `${currentPath !== null ? `${currentPath}.` : ""}${pathItem as string}`;
    }

    /**
     * Creates a proxy for an object that intercepts property mutations and triggers Observable notifications
     * @param target - The target instance that owns the root property
     * @param rootProperty - The name of the root property for notification purposes
     * @param object - The object to wrap with a proxy
     * @param currentPath - The current path context for this object
     * @param getCurrentPath - Function to construct path strings
     * @param evaluatePaths - Function to evaluate and create proxies for nested objects
     * @returns A proxy that triggers notifications on property mutations
     */
    private getProxyForObject(
        target: any,
        rootProperty: string,
        object: any,
        currentPath: string | null,
        getCurrentPath: (currentPath: string | null, pathItem: string) => string,
        evaluatePaths: (
            target: any,
            rootProperty: string,
            object: any,
            currentPath: string | null
        ) => void
    ): typeof Proxy {
        // Create a proxy for the object that triggers Observable.notify on mutations
        return new Proxy(object, {
            set: (obj: any, prop: string | symbol, value: any) => {
                obj[prop] = value;

                if (typeof prop === "string") {
                    const newPath = getCurrentPath(currentPath, prop);

                    // If the new value is an object, evaluate paths for it
                    if (typeof value === "object" && value !== null) {
                        evaluatePaths(target, rootProperty, obj, newPath);
                    }
                }

                // Trigger notification for property changes
                Observable.notify(target, rootProperty);

                return true;
            },
            deleteProperty: (obj: any, prop: string | symbol) => {
                if (prop in obj) {
                    delete obj[prop];

                    // Trigger notification for property deletion
                    Observable.notify(target, rootProperty);

                    return true;
                }
                return false;
            },
        });
    }

    /**
     * Creates a property change handler function for observable properties
     * This handler is called when an observable property transitions from undefined to a defined value
     * @param propertyName - The name of the property for which to create the change handler
     * @returns A function that handles property changes and sets up proxies for object values
     */
    private defineChanged = (propertyName: string): ((prev: any, next: any) => void) => {
        const evaluatePathsAlias = this.evaluatePaths;
        const getProxyForObjectAlias = this.getProxyForObject;
        const getCurrentPathAlias = this.getCurrentPath;

        function instanceResolverChanged(this: any, prev: any, next: any): void {
            if (
                prev === undefined &&
                next !== undefined &&
                typeof next === "object" &&
                next !== null
            ) {
                const proxy = getProxyForObjectAlias(
                    this,
                    propertyName,
                    next,
                    null,
                    getCurrentPathAlias,
                    evaluatePathsAlias
                );
                evaluatePathsAlias(this, propertyName, proxy, null);
                this[propertyName] = proxy;
            }
        }

        return instanceResolverChanged;
    };

    /**
     * Gets all defined properties for the class prototype
     * @returns Set of property names that have been defined as observable
     */
    public getDefinedProperties(): IterableIterator<string> {
        return this.propertyDefinitions.keys();
    }
}
