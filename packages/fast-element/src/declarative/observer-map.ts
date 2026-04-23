import { Observable } from "../observation/observable.js";
import type { JSONSchema, Schema } from "./schema.js";
import { assignObservables, deepMerge } from "./utilities.js";

/**
 * Values for the observerMap element option.
 */
export const ObserverMapOption = {
    all: "all",
} as const;

/**
 * A node in the observer-map path tree.
 *
 * - `true`  → observe this path and all descendants (unless overridden by children).
 * - `false` → do NOT observe this path or its descendants (unless overridden by children).
 * - `ObserverMapPathNode` → configure child paths individually;
 *       the node itself is observed if `$observe` is true (default when parent is observed).
 */
export type ObserverMapPathEntry = boolean | ObserverMapPathNode;

/**
 * A node object in the observer-map path tree.
 *
 * `$observe` controls whether this node itself is observed.
 * When omitted the value is inherited from the nearest ancestor
 * that explicitly sets `$observe`. At the root level the default is `true`.
 *
 * Child property overrides are keyed by property name.
 */
export interface ObserverMapPathNode {
    $observe?: boolean;
    [propertyName: string]: ObserverMapPathEntry | undefined;
}

/**
 * Configuration object for the observerMap element option.
 * When `properties` is omitted (i.e. `observerMap: {}`), behaves like `"all"` —
 * every root property is observed. When `properties` is present, only listed
 * root properties participate in observer-map observation.
 */
export interface ObserverMapConfig {
    /**
     * Per-root-property observation control.
     * Keys are root property names discovered in the template schema.
     * Only root properties listed here participate in observer-map observation.
     * Omitting this field is equivalent to `"all"`.
     */
    properties?: {
        [rootProperty: string]: ObserverMapPathEntry;
    };
}

/**
 * Type for the observerMap element option.
 * Accepts `"all"` or a configuration object.
 */
export type ObserverMapOption =
    | (typeof ObserverMapOption)[keyof typeof ObserverMapOption]
    | ObserverMapConfig;

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
 * Stamps `$observe` flags onto schema nodes based on the config tree.
 * After this one-time pass the proxy system can check `schema.$observe`
 * instead of needing a separate config parameter threaded through every call.
 *
 * @param schema - A schema node (must have `properties` to recurse)
 * @param entry  - The corresponding config path entry
 * @param inherited - The inherited `$observe` value from the parent
 */
function applyConfigToSchema(
    schema: any,
    entry: ObserverMapPathEntry,
    inherited: boolean = true,
): void {
    if (entry === false) {
        stampObserveFalse(schema);
        return;
    }

    if (entry === true) {
        // Explicitly observed — no stamp needed (default is observed)
        return;
    }

    // ObserverMapPathNode
    const nodeObserve = entry.$observe ?? inherited;

    if (!nodeObserve) {
        schema.$observe = false;
    }

    if (!schema?.properties) {
        return;
    }

    for (const key of Object.keys(entry)) {
        if (key === "$observe") {
            continue;
        }

        const childEntry = entry[key];
        const childSchema = schema.properties[key];

        // Paths in config but not in schema are silently ignored
        if (childEntry !== undefined && childSchema) {
            applyConfigToSchema(childSchema, childEntry, nodeObserve);
        }
    }

    // For properties in the schema that are NOT listed in the config,
    // they inherit the parent's $observe value
    if (!nodeObserve) {
        for (const key of Object.keys(schema.properties)) {
            if (!(key in entry) && schema.properties[key]) {
                stampObserveFalse(schema.properties[key]);
            }
        }
    }
}

/**
 * Recursively stamps `$observe: false` on a schema node and all its descendants.
 */
function stampObserveFalse(schema: any): void {
    if (!schema) {
        return;
    }

    schema.$observe = false;

    if (schema.properties) {
        for (const key of Object.keys(schema.properties)) {
            stampObserveFalse(schema.properties[key]);
        }
    }
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

            // Stamp $observe flags onto the schema so the proxy system
            // can check schema nodes directly without a separate config tree
            const rootSchema = this.schema.getSchema(propertyName);

            if (configEntry && rootSchema) {
                applyConfigToSchema(rootSchema, configEntry);
            }

            // Skip if property already has an accessor (from `@attr` or `@observable` decorator)
            if (!existingAccessors.some(accessor => accessor.name === propertyName)) {
                Observable.defineProperty(this.classPrototype, propertyName);
            }

            const changedMethodName = `${propertyName}Changed`;
            const existingChangedMethod = this.classPrototype[changedMethodName];

            this.classPrototype[changedMethodName] = this.defineChanged(
                propertyName,
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
     * @returns A proxy that triggers notifications on property mutations
     */
    private getAndAssignObservables(
        target: any,
        rootProperty: string,
        object: any,
        schema: Schema,
    ): typeof Proxy {
        let proxiedObject = object;

        proxiedObject = assignObservables(
            schema.getSchema(rootProperty) as JSONSchema,
            schema.getSchema(rootProperty) as JSONSchema,
            proxiedObject,
            target,
            rootProperty,
        );

        return proxiedObject;
    }

    /**
     * Creates a property change handler function for observable properties
     * This handler is called when an observable property transitions from undefined to a defined value
     * @param propertyName - The name of the property for which to create the change handler
     * @param existingChangedMethod - Optional existing changed method to call after the instance resolver logic
     * @returns A function that handles property changes and sets up proxies for object values
     */
    private defineChanged = (
        propertyName: string,
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
