import { Observable } from "@microsoft/fast-element/observable.js";
import { PathType } from "./utilities.js";

const reservedIndexPlaceholder = "__index__";

type AccessCachedPathType = "access";

export interface AccessCachedPath {
    type: AccessCachedPathType;
    relativePath: string;
    absolutePath: string;
}

type DefaultCachedPathType = "default";

export interface DefaultCachedPath {
    type: DefaultCachedPathType;
    paths: Record<string, CachedPath>; // where the key is the relativePath
}

type EventCachedPathType = "event";

export interface EventCachedPath {
    type: EventCachedPathType;
    relativePath: string;
    absolutePath: string;
}

type RepeatCachedPathType = "repeat";

export interface RepeatCachedPath {
    type: RepeatCachedPathType;
    context: string | null;
    paths: Record<string, CachedPath>;
}

export type CachedPath =
    | DefaultCachedPath
    | RepeatCachedPath
    | AccessCachedPath
    | EventCachedPath;

export type CachedPathMap = Record<string, CachedPath>;

interface ContextCache {
    /**
     * The path to this context
     */
    absolutePath: string; // users
    /**
     * The self string of that context
     */
    context: string; // user

    /**
     * The parent of this context
     */
    parent: string | null;
}

// TODO: remove this
const tempPaths: CachedPathMap = {
    users: {
        type: "repeat",
        context: "user",
        paths: {
            "user.id": {
                type: "access",
                relativePath: "user.id",
                absolutePath: "users.__index__.id",
            },
            "user.posts": {
                type: "repeat",
                context: "post",
                paths: {
                    "post.title": {
                        type: "access",
                        relativePath: "post.title",
                        absolutePath: "users.__index__.posts.__index__.title",
                    },
                },
            },
        },
    },
    stats: {
        type: "default",
        paths: {
            "stats.totalUsers": {
                type: "access",
                relativePath: "stats.totalUsers",
                absolutePath: "totalUsers",
            },
            "stats.metrics.engagement.daily": {
                type: "access",
                relativePath: "stats.metrics.engagement.daily",
                absolutePath: "stats.metrics.engagement.daily",
            },
        },
    },
};

/**
 * ObserverMap provides functionality for caching binding paths, extracting root properties,
 * and defining observable properties on class prototypes
 */
export class ObserverMap {
    private tempCachePaths: CachedPathMap = {};
    private tempContextCache: Array<ContextCache> = [];

    // Where the key is the root property and the value is a set of paths on that property
    private propertyDefinitions = new Map<string, Set<string>>();
    // Where the key is a path that belongs to a property definition or another contextPaths parent
    // and the value is any paths belonging on that path, this does not account for same-name
    // contexts
    private contextPathDefinitions = new Map<string, Set<string>>();
    private cachedPaths = new Set<string>();
    private classPrototype: any;
    // Cache for root properties to avoid recomputation
    private rootPropertiesCache: Set<string> | null = null;
    // Track if paths have been modified since last root properties calculation
    private pathsCacheDirty = false;

    constructor(classPrototype: any) {
        this.classPrototype = classPrototype;
    }

    /**
     * Caches a binding path for later use
     * @param path - The path to cache
     */
    public cachePath(
        path: string,
        self: boolean,
        parentContext: string | null,
        contextPath: string | null,
        type: PathType
    ): void {
        if (self && contextPath) {
            if (parentContext) {
                if (!this.contextPathDefinitions.has(parentContext)) {
                    const paths = new Set<string>();
                    paths.add(contextPath);
                    this.contextPathDefinitions.set(parentContext, paths);
                } else {
                    const paths = this.contextPathDefinitions.get(
                        parentContext
                    ) as Set<string>;
                    paths.add(contextPath);
                    this.contextPathDefinitions.set(parentContext, paths);
                }
            }
        }

        if (!this.cachedPaths.has(path)) {
            this.cachedPaths.add(path);
            this.pathsCacheDirty = true;
        }
    }

    private getRootProperty(
        path: string,
        self: boolean,
        parentContext: string | null,
        contextPath: string | null,
        type: PathType
    ): string {
        const splitPath = path.split(".");

        if (self) {
            const contextCacheItem = this.tempContextCache.find(contextCacheItem => {
                return contextCacheItem.context === parentContext;
            });

            if (contextCacheItem) {
                if (contextCacheItem.parent) {
                    return this.getRootProperty(
                        path,
                        true,
                        contextCacheItem.parent,
                        contextPath,
                        type
                    );
                }
                return contextCacheItem.absolutePath.split(".")[0];
            }
        }

        return self ? (parentContext as string) : splitPath[0];
    }

    /**
     * Caches a binding path with context information for later use in generating observable properties
     * @param path - The binding path to cache (e.g., "item.name", "users")
     * @param self - Whether this path refers to a context item (true for array items)
     * @param parentContext - The parent context name (e.g., "user" for items in a users array)
     * @param contextPath - The context path name (e.g., "item" for the current context)
     * @param type - The type of path ("access", "repeat", or "event")
     * @param level - The nesting level for relative path resolution
     */
    public cachePathWithContext(
        path: string,
        self: boolean,
        parentContext: string | null,
        contextPath: string | null,
        type: PathType,
        level: number
    ): void {
        const rootPath = this.getRootProperty(
            path,
            self,
            parentContext,
            contextPath,
            type
        );
        this.resolveRootAndContextPath(type, path, rootPath, contextPath);

        switch (type) {
            case "access":
                this.handleAccessPath(
                    path,
                    self,
                    parentContext,
                    contextPath,
                    level,
                    rootPath
                );
                break;
            case "event":
                // Event handling not implemented yet
                break;
            case "repeat":
                this.handleRepeatPath(
                    path,
                    self,
                    parentContext,
                    contextPath,
                    level,
                    rootPath
                );
                break;
        }
    }

    /**
     * Handles caching of access-type paths (property bindings)
     */
    private handleAccessPath(
        path: string,
        self: boolean,
        parentContext: string | null,
        contextPath: string | null,
        level: number,
        rootPath: string
    ): void {
        if (contextPath === null && parentContext === null) {
            this.cacheSimpleAccessPath(path, self, level, parentContext, rootPath);
            return;
        }

        const context = this.findContextInCache(parentContext);
        if (!context) {
            this.cacheSimpleAccessPath(path, self, level, parentContext, rootPath);
            return;
        }

        // Try to place this access path under an existing repeat structure
        if (this.tryPlaceInExistingRepeat(path, context)) {
            return;
        }

        // Create new repeat structure or place under existing context
        this.cacheAccessPathWithContext(
            path,
            self,
            level,
            parentContext,
            rootPath,
            context
        );
    }

    /**
     * Handles caching of repeat-type paths (array/loop contexts)
     */
    private handleRepeatPath(
        path: string,
        self: boolean,
        parentContext: string | null,
        contextPath: string | null,
        level: number,
        rootPath: string
    ): void {
        // Add to context cache first
        this.tempContextCache.push({
            absolutePath: this.getAbsolutePath(
                path,
                self,
                level,
                parentContext,
                contextPath,
                "repeat"
            ),
            context: contextPath as string,
            parent: parentContext,
        });

        // Create path structure if this is a nested repeat
        if (self && parentContext) {
            this.createNestedRepeatStructure(path, parentContext, contextPath, rootPath);
        }
    }

    /**
     * Caches a simple access path without context complexity
     */
    private cacheSimpleAccessPath(
        path: string,
        self: boolean,
        level: number,
        parentContext: string | null,
        rootPath: string
    ): void {
        const tempCachePaths = [rootPath, path];
        this.resolveContextPath(tempCachePaths, {
            type: "access",
            relativePath: path,
            absolutePath: this.getAbsolutePath(
                path,
                self,
                level,
                parentContext,
                null,
                "access"
            ),
        });
    }

    /**
     * Finds a context item in the temporary context cache
     */
    private findContextInCache(parentContext: string | null): ContextCache | undefined {
        return this.tempContextCache.find(item => item.context === parentContext);
    }

    /**
     * Attempts to place an access path under an existing repeat structure
     * @returns true if successfully placed, false otherwise
     */
    private tryPlaceInExistingRepeat(path: string, context: ContextCache): boolean {
        const contextName = context.context;

        for (const [rootKey, rootValue] of Object.entries(this.tempCachePaths)) {
            if (this.searchAndPlaceInRepeat(rootValue, [rootKey], path, contextName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Recursively searches for and places access paths in matching repeat structures
     */
    private searchAndPlaceInRepeat(
        pathObj: any,
        currentPath: string[],
        path: string,
        contextName: string
    ): boolean {
        for (const [pathKey, pathValue] of Object.entries(pathObj.paths || {})) {
            const typedPathValue = pathValue as CachedPath;

            if (this.isMatchingRepeatStructure(typedPathValue, contextName)) {
                this.placeAccessInRepeat(currentPath, pathKey, path, contextName);
                return true;
            }

            // Recursively search nested paths
            if (this.canSearchNested(typedPathValue)) {
                if (
                    this.searchAndPlaceInRepeat(
                        typedPathValue,
                        [...currentPath, pathKey],
                        path,
                        contextName
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Checks if a cached path is a repeat structure with matching context
     */
    private isMatchingRepeatStructure(
        pathValue: CachedPath,
        contextName: string
    ): boolean {
        return (
            pathValue.type === "repeat" &&
            (pathValue as RepeatCachedPath).context === contextName
        );
    }

    /**
     * Determines if a cached path can be searched for nested structures
     */
    private canSearchNested(pathValue: CachedPath): boolean {
        return pathValue.type === "repeat" || pathValue.type === "default";
    }

    /**
     * Places an access path within an existing repeat structure
     */
    private placeAccessInRepeat(
        currentPath: string[],
        pathKey: string,
        path: string,
        contextName: string
    ): void {
        const tempCachePaths = [...currentPath, pathKey, path];
        const absolutePath = this.buildNestedRepeatAbsolutePath(
            currentPath,
            pathKey,
            path,
            contextName
        );

        this.resolveContextPath(tempCachePaths, {
            type: "access",
            relativePath: path,
            absolutePath: absolutePath,
        });
    }

    /**
     * Builds absolute paths for nested repeat access patterns
     * @example "root.items.__index__.subitems.__index__.title"
     */
    private buildNestedRepeatAbsolutePath(
        currentPath: string[],
        pathKey: string,
        path: string,
        contextName: string
    ): string {
        let absolutePath = "root";

        // Build path through the hierarchy
        for (let i = 1; i < currentPath.length; i++) {
            const segment = currentPath[i];
            if (i === 1) {
                absolutePath += `.${segment}`;
            } else {
                absolutePath += `.__index__.${segment}`;
            }
        }

        // Add the final repeat and property
        const contextPrefix = `${contextName}.`;
        const pathWithoutContext = path.startsWith(contextPrefix)
            ? path.substring(contextPrefix.length)
            : path;
        
        // If the path is just the context name itself, don't append anything after __index__
        if (path === contextName) {
            absolutePath += `.__index__.${pathKey}.__index__`;
        } else {
            absolutePath += `.__index__.${pathKey}.__index__.${pathWithoutContext}`;
        }

        return absolutePath;
    }

    /**
     * Caches access paths that have context information
     */
    private cacheAccessPathWithContext(
        path: string,
        self: boolean,
        level: number,
        parentContext: string | null,
        rootPath: string,
        context: ContextCache
    ): void {
        const contextPathRelative = this.getRelativeContextPath(context);

        // Create repeat structure if needed
        this.ensureRepeatStructureExists(rootPath, contextPathRelative, context);

        if (self && contextPathRelative !== "") {
            const tempCachePaths = [rootPath, contextPathRelative, path];
            this.resolveContextPath(tempCachePaths, {
                type: "access",
                relativePath: path,
                absolutePath: this.getAbsolutePath(
                    path,
                    self,
                    level,
                    parentContext,
                    null,
                    "access"
                ),
            });
        } else {
            this.cacheSimpleAccessPath(path, self, level, parentContext, rootPath);
        }
    }

    /**
     * Extracts the relative path from a context's absolute path
     * For nested contexts, this should match the cache structure path
     */
    private getRelativeContextPath(context: ContextCache): string {
        // For nested repeats, we need to find the path in the cache structure
        // The cache is organized as: root.items.users.badges
        // But the absolute path might be: root.items.__index__.users.__index__.badges.__index__
        
        const absolutePathSplit = context.absolutePath.split(".");
        absolutePathSplit.shift(); // Remove root
        
        // Remove __index__ placeholders and the final __index__ if present
        const cleanedPath = absolutePathSplit.filter(segment => segment !== "__index__");
        
        // Remove the last segment as it represents the current context position, not the parent path
        if (cleanedPath.length > 1) {
            cleanedPath.pop();
        }
        
        return cleanedPath.join(".");
    }

    /**
     * Ensures a repeat structure exists in the cache
     */
    private ensureRepeatStructureExists(
        rootPath: string,
        contextPathRelative: string,
        context: ContextCache
    ): void {
        if (contextPathRelative !== "") {
            const rootCachedPath = this.tempCachePaths[rootPath] as DefaultCachedPath;
            if (!rootCachedPath.paths[contextPathRelative]) {
                rootCachedPath.paths[contextPathRelative] = {
                    type: "repeat",
                    context: context.context,
                    paths: {},
                };
            }
        }
    }

    /**
     * Creates the cache structure for nested repeat patterns
     */
    private createNestedRepeatStructure(
        path: string,
        parentContext: string,
        contextPath: string | null,
        rootPath: string
    ): void {
        const context = this.findContextInCache(parentContext);
        if (!context) return;

        // For nested repeats, we need to find where the parent context was placed
        // in the cache structure, not use the absolute path calculation
        const parentRepeatPath = this.findParentRepeatPath(parentContext, rootPath);
        const pathSegment = path.split(".").pop() as string;

        const tempCachePaths = parentRepeatPath 
            ? [...parentRepeatPath, pathSegment]
            : [rootPath, pathSegment];

        this.resolveContextPath(tempCachePaths, {
            type: "repeat",
            context: contextPath,
            paths: {},
        });
    }

    /**
     * Finds the cache path where a parent context's repeat structure is located
     */
    private findParentRepeatPath(parentContext: string, rootPath: string): string[] | null {
        // Search through the cache structure to find where this context is defined
        const searchInStructure = (obj: any, currentPath: string[]): string[] | null => {
            if (obj.type === "repeat" && obj.context === parentContext) {
                return currentPath;
            }
            
            if (obj.paths) {
                for (const [key, value] of Object.entries(obj.paths)) {
                    const result = searchInStructure(value, [...currentPath, key]);
                    if (result) return result;
                }
            }
            
            return null;
        };

        return searchInStructure(this.tempCachePaths[rootPath], [rootPath]);
    }

    public getCachedPathsWithContext(): CachedPathMap {
        return this.tempCachePaths;
    }

    private resolveContextPath(tempCachePaths: string[], cachePath: CachedPath): void {
        const tempCachePathLastItem = tempCachePaths.length - 1;
        tempCachePaths.reduce(
            (previousValue: any, tempCachePath: string, index: number) => {
                if (index === tempCachePathLastItem) {
                    // Ensure the previous value has a paths property
                    if (!previousValue.paths) {
                        previousValue.paths = {};
                    }
                    previousValue.paths[tempCachePath] = cachePath;
                    return previousValue;
                }
                
                // Navigate to the next level
                const nextValue = index === 0
                    ? previousValue[tempCachePath]
                    : previousValue.paths?.[tempCachePath];
                
                // Ensure the next value exists and has paths property if needed
                if (!nextValue) {
                    throw new Error(`Cannot resolve context path: missing intermediate path at '${tempCachePath}'`);
                }
                
                return nextValue;
            },
            this.tempCachePaths
        );
    }

    private resolveRootAndContextPath(
        type: PathType,
        path: string,
        rootPath: string,
        contextPath: string | null
    ): void {
        switch (type) {
            case "access":
                {
                    const containsContext = this.tempContextCache.find(
                        contextCacheItem => {
                            return contextCacheItem.context === rootPath;
                        }
                    );
                    // add a root path if one has not been assigned
                    if (!this.tempCachePaths[rootPath] && !containsContext) {
                        this.tempCachePaths[rootPath] = {
                            type: "default",
                            paths: {},
                        };
                    }
                }
                break;
            case "repeat":
                {
                    // add a context path if one has not been assigned
                    // add a root path if one has not been assigned
                    if (rootPath === path) {
                        (this.tempCachePaths[rootPath] as RepeatCachedPath) = {
                            type: "repeat",
                            context: contextPath,
                            paths: {},
                        };
                    }
                }
                break;
        }
    }

    public getAbsolutePath(
        path: string,
        self: boolean,
        level: number,
        parentContext: string | null,
        contextPath: string | null,
        type: PathType
    ): string {
        const splitPath: string[] = [];
        const contextSplitPath: string[] = contextPath ? contextPath.split(".") : [];

        // Split path by "../" and handle each part
        const pathParts = path.split("../");
        pathParts.forEach(pathItem => {
            if (pathItem === "") {
                splitPath.unshift("../");
            } else {
                splitPath.push(...pathItem.split("."));
            }
        });

        // Handle level-based path resolution
        for (let i = level; i > 0; i--) {
            if (splitPath[0] === "../") {
                splitPath.shift();
            } else {
                contextSplitPath.pop();
            }
        }

        const contextPathUpdated = contextSplitPath.join(".");

        if (self) {
            // For array items, remove the context prefix and build full path
            splitPath.shift();

            // Build the full path by recursively traversing tempContextCache
            const fullContextPath = this.getPathFromCachedContext(
                parentContext,
                contextPath
            );

            const pathSuffix = splitPath.join(".");
            if (fullContextPath) {
                return `${fullContextPath}.${reservedIndexPlaceholder}.${pathSuffix}`;
            } else {
                return `${reservedIndexPlaceholder}.${pathSuffix}`;
            }
        }

        if (type === "repeat") {
            return splitPath.join(".");
        }

        const pathSuffix = splitPath.join(".");
        if (contextPathUpdated) {
            return `${contextPathUpdated}.${pathSuffix}`;
        } else {
            return pathSuffix;
        }
    }

    /**
     * Builds the full context path by looking up parent contexts in tempContextCache
     * @param parentContext - The immediate parent context to start from
     * @param contextPath - The current context path (like "items")
     * @returns The full absolute path including all parent contexts
     */
    private getPathFromCachedContext(
        parentContext: string | null,
        contextPath: string | null
    ): string {
        if (!parentContext) {
            return contextPath || "";
        }

        // Find the parent context in tempContextCache
        const parentContextItem = this.tempContextCache.find(
            item => item.context === parentContext
        );

        if (!parentContextItem) {
            return contextPath || "";
        }

        // The parent's absolutePath is the base path we want to use
        // For array access, we add __index__ between parent and child paths
        const parentAbsolutePath = parentContextItem.absolutePath;

        if (contextPath) {
            // If we have a contextPath, add it to the parent path with __index__
            // Remove trailing dot if present
            const cleanParentPath = parentAbsolutePath.endsWith(".")
                ? parentAbsolutePath.slice(0, -1)
                : parentAbsolutePath;
            return `${cleanParentPath}.${reservedIndexPlaceholder}.${contextPath}`;
        } else {
            // If no contextPath, just return the parent's path - this is the base context
            // Remove trailing dot if present
            return parentAbsolutePath.endsWith(".")
                ? parentAbsolutePath.slice(0, -1)
                : parentAbsolutePath;
        }
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
        if (this.rootPropertiesCache && !this.pathsCacheDirty) {
            return this.rootPropertiesCache;
        }

        const rootProperties = new Set<string>();
        for (const path of this.cachedPaths) {
            const dotIndex = path.indexOf(".");
            const rootProperty = dotIndex === -1 ? path : path.substring(0, dotIndex);
            rootProperties.add(rootProperty);
        }

        this.rootPropertiesCache = rootProperties;
        this.pathsCacheDirty = false;
        return rootProperties;
    }

    /**
     * Defines an observable property on the class prototype
     * @param propertyName - The name of the property to define
     */
    public defineProperty(propertyName: string): void {
        if (!this.propertyDefinitions.has(propertyName)) {
            const paths = new Set<string>();
            const propertyPrefix = `${propertyName}.`;

            for (const value of this.cachedPaths) {
                if (value.startsWith(propertyPrefix)) {
                    paths.add(value.substring(propertyPrefix.length));
                }
            }

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
        const propertyPaths = this.propertyDefinitions.get(rootProperty);
        if (!propertyPaths) return;

        for (const value of propertyPaths) {
            if (currentPath === null || value.startsWith(`${currentPath}.`)) {
                // Create the path to traverse from current position
                const pathToTraverse =
                    currentPath === null
                        ? value.split(".")
                        : value.substring(currentPath.length + 1).split(".");

                // Only traverse if we have segments to process
                if (pathToTraverse.length > 0 && pathToTraverse[0] !== "") {
                    this.traverseAndProxyPath(
                        target,
                        rootProperty,
                        object,
                        currentPath,
                        pathToTraverse
                    );
                }
            }
        }
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
        if (remainingPath.length === 0 || !currentObject) {
            return;
        }

        const [nextSegment, ...restOfPath] = remainingPath;
        const nextObject = currentObject[nextSegment];

        if (nextObject && typeof nextObject === "object" && nextObject !== null) {
            const newPath = currentPath ? `${currentPath}.${nextSegment}` : nextSegment;

            // Create proxy for this object
            currentObject[nextSegment] = this.getProxyForObject(
                target,
                rootProperty,
                nextObject,
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
        return currentPath ? `${currentPath}.${pathItem}` : pathItem;
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
