import { Observable } from "@microsoft/fast-element/observable.js";
import { assignProxiesToObjects, getNextProperty } from "./utilities.js";
import type {
    CachedPath,
    CachedPathMap,
    ContextCache,
    DefaultCachedPath,
    PathType,
    RepeatCachedPath,
} from "./utilities.js";

const reservedIndexPlaceholder = "__index__";

/**
 * ObserverMap provides functionality for caching binding paths, extracting root properties,
 * and defining observable properties on class prototypes
 */
export class ObserverMap {
    private cachePaths: CachedPathMap = {};
    private contextCache: Array<ContextCache> = [];
    private classPrototype: any;

    constructor(classPrototype: any) {
        this.classPrototype = classPrototype;
    }

    private getRootProperty(
        path: string,
        self: boolean,
        parentContext: string | null,
        contextPath: string | null,
        type: PathType
    ): string {
        if (self) {
            const contextCacheItem = this.contextCache.find(contextCacheItem => {
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
                return getNextProperty(contextCacheItem.absolutePath);
            }
        }

        return self ? (parentContext as string) : getNextProperty(path);
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
        // Handle relative path navigation with "../"
        if (path.includes("../")) {
            this.handleRelativePathCaching(path, parentContext, type);
            return;
        }

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
     * Handles caching of paths with relative navigation ("../")
     * Determines the correct context level and caches the path accordingly
     */
    private handleRelativePathCaching(
        path: string,
        parentContext: string | null,
        type: PathType
    ): void {
        // Count the number of "../" to determine how many levels to go up
        const upLevels = this.countRelativeNavigationLevels(path);

        // Extract the property name after all the "../" sequences
        const propertyName = this.extractPropertyNameFromRelativePath(path);

        // Determine the target context based on navigation level
        const targetContext = this.getTargetContextForRelativePath(
            parentContext,
            upLevels
        );

        // Create the absolute path based on where we end up
        const absolutePath =
            targetContext === null ? propertyName : `${targetContext}.${propertyName}`;

        // Cache the path at the determined context level
        if (targetContext === null) {
            // Cache at root level
            this.cacheAtRootLevel(propertyName, propertyName, type);
        } else {
            // Cache at the specified context level
            this.cacheAtContextLevel(propertyName, absolutePath, targetContext, type);
        }
    }

    /**
     * Counts the number of "../" sequences in a path without using regex
     */
    private countRelativeNavigationLevels(path: string): number {
        let count = 0;
        let index = 0;

        while (index < path.length) {
            const foundIndex = path.indexOf("../", index);
            if (foundIndex === -1) {
                break;
            }
            count++;
            index = foundIndex + 3; // Move past the current "../"
        }

        return count;
    }

    /**
     * Extracts the property name from a relative path, removing all "../" sequences
     */
    private extractPropertyNameFromRelativePath(path: string): string {
        // Remove all "../" sequences and get the remaining path
        const cleaned = path.replace(/\.\.\//g, "");
        return cleaned;
    }

    /**
     * Determines the target context after navigating up the specified number of levels
     */
    private getTargetContextForRelativePath(
        currentContext: string | null,
        upLevels: number
    ): string | null {
        if (currentContext === null) {
            return null;
        }

        let targetContext: string | null = currentContext;

        // Navigate up the context hierarchy
        for (let i = 0; i < upLevels; i++) {
            const contextItem = this.contextCache.find(
                item => item.context === targetContext
            );
            if (contextItem?.parent) {
                targetContext = contextItem.parent;
            } else {
                // Reached root level
                targetContext = null;
                break;
            }
        }

        return targetContext;
    }

    /**
     * Caches a path at the root level
     */
    private cacheAtRootLevel(
        propertyName: string,
        absolutePath: string,
        type: PathType
    ): void {
        // For access type, cache the property directly as an access path
        if (type === "access") {
            this.cachePaths[propertyName] = {
                type,
                relativePath: propertyName,
                absolutePath: absolutePath,
            };
        }
    }

    /**
     * Caches a path at a specific context level
     */
    private cacheAtContextLevel(
        propertyName: string,
        absolutePath: string,
        targetContext: string,
        type: PathType
    ): void {
        // Find the context in cache to determine where to place this
        const contextItem = this.contextCache.find(
            item => item.context === targetContext
        );
        if (!contextItem) {
            // Fallback to root level if context not found
            this.cacheAtRootLevel(propertyName, absolutePath, type);
            return;
        }

        // For now, cache at root level since the context structure is complex
        // This could be enhanced to place at the exact context level if needed
        this.cacheAtRootLevel(propertyName, absolutePath, type);
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
        this.contextCache.push({
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
        const cachePaths = [rootPath, path];
        this.resolveContextPath(cachePaths, {
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
        return this.contextCache.find(item => item.context === parentContext);
    }

    /**
     * Attempts to place an access path under an existing repeat structure
     * @returns true if successfully placed, false otherwise
     */
    private tryPlaceInExistingRepeat(path: string, context: ContextCache): boolean {
        const contextName = context.context;

        for (const [rootKey, rootValue] of Object.entries(this.cachePaths)) {
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
        const cachePaths = [...currentPath, pathKey, path];
        const absolutePath = this.buildNestedRepeatAbsolutePath(
            currentPath,
            pathKey,
            path,
            contextName
        );

        this.resolveContextPath(cachePaths, {
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

            absolutePath +=
                i === 1 ? `.${segment}` : `.${reservedIndexPlaceholder}.${segment}`;
        }

        // Add the final repeat and property
        const contextPrefix = `${contextName}.`;
        const pathWithoutContext = path.startsWith(contextPrefix)
            ? path.substring(contextPrefix.length)
            : path;

        // If the path is just the context name itself, don't append anything after __index__
        absolutePath +=
            path === contextName
                ? `.${reservedIndexPlaceholder}.${pathKey}.${reservedIndexPlaceholder}`
                : `.${reservedIndexPlaceholder}.${pathKey}.${reservedIndexPlaceholder}.${pathWithoutContext}`;

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
            const cachePaths = [rootPath, contextPathRelative, path];
            this.resolveContextPath(cachePaths, {
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
        const cleanedPath = absolutePathSplit.filter(
            segment => segment !== reservedIndexPlaceholder
        );

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
            const rootCachedPath = this.cachePaths[rootPath] as DefaultCachedPath;
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

        const cachePaths = parentRepeatPath
            ? [...parentRepeatPath, pathSegment]
            : [rootPath, pathSegment];

        this.resolveContextPath(cachePaths, {
            type: "repeat",
            context: contextPath as string,
            paths: {},
        });
    }

    /**
     * Finds the cache path where a parent context's repeat structure is located
     */
    private findParentRepeatPath(
        parentContext: string,
        rootPath: string
    ): string[] | null {
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

        return searchInStructure(this.cachePaths[rootPath], [rootPath]);
    }

    public getCachedPathsWithContext(): CachedPathMap {
        return this.cachePaths;
    }

    private resolveContextPath(cachePaths: string[], cachePath: CachedPath): void {
        const tempCachePathLastItem = cachePaths.length - 1;
        cachePaths.reduce((previousValue: any, tempCachePath: string, index: number) => {
            if (index === tempCachePathLastItem) {
                // Ensure the previous value has a paths property
                if (!previousValue.paths) {
                    previousValue.paths = {};
                }
                previousValue.paths[tempCachePath] = cachePath;
                return previousValue;
            }

            // Navigate to the next level
            const nextValue =
                index === 0
                    ? previousValue[tempCachePath]
                    : previousValue.paths?.[tempCachePath];

            // Ensure the next value exists and has paths property if needed
            if (!nextValue) {
                throw new Error(
                    `Cannot resolve context path: missing intermediate path at '${tempCachePath}'`
                );
            }

            return nextValue;
        }, this.cachePaths);
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
                    const containsContext = this.contextCache.find(contextCacheItem => {
                        return contextCacheItem.context === rootPath;
                    });
                    // add a root path if one has not been assigned
                    if (!this.cachePaths[rootPath] && !containsContext) {
                        this.cachePaths[rootPath] = {
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
                        (this.cachePaths[rootPath] as RepeatCachedPath) = {
                            type: "repeat",
                            context: contextPath as string,
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

            // Build the full path by recursively traversing contextCache
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
     * Builds the full context path by looking up parent contexts in contextCache
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

        // Find the parent context in contextCache
        const parentContextItem = this.contextCache.find(
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

    public defineProperties(): void {
        console.log("defineProperties", this.cachePaths, this.contextCache);
        Object.keys(this.cachePaths).forEach(propertyName => {
            Observable.defineProperty(this.classPrototype, propertyName);

            this.classPrototype[`${propertyName}Changed`] =
                this.defineChanged(propertyName);
        });
    }

    /**
     * Creates a proxy for an object that intercepts property mutations and triggers Observable notifications
     * @param target - The target instance that owns the root property
     * @param rootProperty - The name of the root property for notification purposes
     * @param object - The object to wrap with a proxy
     * @returns A proxy that triggers notifications on property mutations
     */
    private getAndAssignProxies(
        target: any,
        rootProperty: string,
        object: any,
        cachePaths: CachedPathMap,
        contextCache: Array<ContextCache>
    ): typeof Proxy {
        let proxiedObject = object;

        if (cachePaths[rootProperty]) {
            proxiedObject = assignProxiesToObjects(
                cachePaths[rootProperty],
                contextCache,
                proxiedObject,
                target,
                rootProperty
            );
        }

        return proxiedObject;

        // Create a proxy for the object that triggers Observable.notify on mutations
        // return new Proxy(proxiedObject, {
        //     set: (obj: any, prop: string | symbol, value: any) => {
        //         obj[prop] = value;

        //         // TODO: determine if this changes any paths
        //         console.log("does this change any paths");

        //         // Trigger notification for property changes
        //         Observable.notify(target, rootProperty);

        //         return true;
        //     },
        //     deleteProperty: (obj: any, prop: string | symbol) => {
        //         if (prop in obj) {
        //             delete obj[prop];

        //             // Trigger notification for property deletion
        //             Observable.notify(target, rootProperty);

        //             return true;
        //         }
        //         return false;
        //     },
        // });
    }

    /**
     * Creates a property change handler function for observable properties
     * This handler is called when an observable property transitions from undefined to a defined value
     * @param propertyName - The name of the property for which to create the change handler
     * @returns A function that handles property changes and sets up proxies for object values
     */
    private defineChanged = (propertyName: string): ((prev: any, next: any) => void) => {
        const getAndAssignProxiesAlias = this.getAndAssignProxies;
        const cachePaths = this.cachePaths;
        const contextCache = this.contextCache;

        function instanceResolverChanged(this: any, prev: any, next: any): void {
            if (
                prev === undefined &&
                next !== undefined &&
                typeof next === "object" &&
                next !== null
            ) {
                const proxy = getAndAssignProxiesAlias(
                    this,
                    propertyName,
                    next,
                    cachePaths,
                    contextCache
                );

                this[propertyName] = proxy;
            }
        }

        return instanceResolverChanged;
    };
}
