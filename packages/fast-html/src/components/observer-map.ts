import { Observable } from "@microsoft/fast-element/observable.js";
import type { JSONSchema, Schema } from "./schema.js";
import type { ObserverMapConfig, ObserverMapPathEntry } from "./template.js";
import { assignObservables, deepMerge } from "./utilities.js";

/**
 * Determines whether a config entry (or any of its descendants) enables observation.
 * Used to decide whether a root property needs an observable accessor and change handler.
 */
function hasObservedPath(entry: ObserverMapPathEntry): boolean {
    if (typeof entry === "boolean") {
        return entry;
    }

    // ObserverMapPathNode
    if (entry.$observe === true) {
        return true;
    }

    for (const key of Object.keys(entry)) {
        if (key === "$observe") {
            continue;
        }

        const child = entry[key];

        if (child !== undefined && hasObservedPath(child)) {
            return true;
        }
    }

    // A node with no explicit $observe and no observed children:
    // at the root level the default $observe is true, so a node like `{ }` (no children)
    // is observed. But a node with `$observe: false` and no observed children is not.
    return entry.$observe !== false;
}

/**
 * ObserverMap provides functionality for caching binding paths, extracting root properties,
 * and defining observable properties on class prototypes
 */
export class ObserverMap {
    private schema: Schema;
    private classPrototype: any;
    private config: ObserverMapConfig | undefined;

    constructor(classPrototype: any, schema: Schema, config?: ObserverMapConfig) {
        this.classPrototype = classPrototype;
        this.schema = schema;
        this.config = config;
    }

    public defineProperties(): void {
        const propertyNames = this.schema.getRootProperties();
        const existingAccessors = Observable.getAccessors(this.classPrototype);
        const configProperties = this.config?.properties;

        for (const propertyName of propertyNames) {
            // When `properties` is present, skip root properties not listed in the config
            if (configProperties && !(propertyName in configProperties)) {
                continue;
            }

            // Resolve the config entry for this root property
            const configEntry: ObserverMapPathEntry | undefined =
                configProperties?.[propertyName];

            // Skip root properties explicitly set to `false` with no observed descendants
            if (configEntry === false) {
                continue;
            }

            // Skip ObserverMapPathNode entries with no observed descendants
            if (
                typeof configEntry === "object" &&
                configEntry !== null &&
                !hasObservedPath(configEntry)
            ) {
                continue;
            }

            // Skip if property already has an accessor (from `@attr` or `@observable` decorator)
            if (!existingAccessors.some(accessor => accessor.name === propertyName)) {
                Observable.defineProperty(this.classPrototype, propertyName);
            }

            const changedMethodName = `${propertyName}Changed`;
            const existingChangedMethod = this.classPrototype[changedMethodName];

            this.classPrototype[changedMethodName] = this.defineChanged(
                propertyName,
                configEntry,
                existingChangedMethod,
            );
        }
    }

    /**
     * Creates a proxy for an object that intercepts property mutations and triggers Observable notifications
     * @param target - The target instance that owns the root property
     * @param rootProperty - The name of the root property for notification purposes
     * @param object - The object to wrap with a proxy
     * @param schema - The schema for the element
     * @param configEntry - The path config entry for this root property
     * @returns A proxy that triggers notifications on property mutations
     */
    private getAndAssignObservables(
        target: any,
        rootProperty: string,
        object: any,
        schema: Schema,
        configEntry: ObserverMapPathEntry | undefined,
    ): typeof Proxy {
        let proxiedObject = object;

        proxiedObject = assignObservables(
            schema.getSchema(rootProperty) as JSONSchema,
            schema.getSchema(rootProperty) as JSONSchema,
            proxiedObject,
            target,
            rootProperty,
            configEntry,
        );

        return proxiedObject;
    }

    /**
     * Creates a property change handler function for observable properties
     * This handler is called when an observable property transitions from undefined to a defined value
     * @param propertyName - The name of the property for which to create the change handler
     * @param configEntry - The path config entry for this root property
     * @param existingChangedMethod - Optional existing changed method to call after the instance resolver logic
     * @returns A function that handles property changes and sets up proxies for object values
     */
    private defineChanged = (
        propertyName: string,
        configEntry: ObserverMapPathEntry | undefined,
        existingChangedMethod?: (prev: any, next: any) => void,
    ): ((prev: any, next: any) => void) => {
        const getAndAssignObservablesAlias = this.getAndAssignObservables;
        const schema = this.schema;

        function instanceResolverChanged(this: any, prev: any, next: any): void {
            const isObjectAssignment = next !== null && typeof next === "object";
            const isManagedArray = Array.isArray(next) && (next as any)?.$fastController;
            const shouldAssignProxy =
                isObjectAssignment && !next?.$isProxy && !isManagedArray;
            const hasExistingProxy =
                prev !== null && typeof prev === "object" && prev.$isProxy;

            if (shouldAssignProxy) {
                if (hasExistingProxy) {
                    deepMerge(prev, next);
                    this[`_${propertyName}`] = prev;
                } else {
                    this[propertyName] = getAndAssignObservablesAlias(
                        this,
                        propertyName,
                        next,
                        schema,
                        configEntry,
                    );
                }
            } else if (!isObjectAssignment) {
                this[propertyName] = next;
            }

            existingChangedMethod?.call(this, prev, next);
        }

        return instanceResolverChanged;
    };
}
