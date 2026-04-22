import { Observable } from "../observation/observable.js";
import {
    defsPropertyName,
    type JSONSchema,
    type JSONSchemaDefinition,
    refPropertyName,
    Schema,
} from "./schema.js";

interface ObservedTargetsAndProperties {
    target: any;
    rootProperty: string;
}

/**
 * A map of proxied objects
 */
const objectTargetsMap = new WeakMap<object, ObservedTargetsAndProperties[]>();

/**
 * A map of arrays being observed
 */
const observedArraysMap = new WeakMap<object, void>();

type DataType = "array" | "object" | "primitive";

/**
 * Determines the data type of the provided data
 * @param data - The data to analyze
 * @returns "array" for arrays, "object" for non-null objects, "primitive" for other types
 */
function getDataType(data: any): DataType {
    if (Array.isArray(data)) return "array";
    if (typeof data === "object" && data !== null) return "object";
    return "primitive";
}

/**
 * Get properties from an anyOf array
 * @param anyOf - The anyOf array in a JSON schema
 * @returns The array item matching a ref if it exists
 */
function getSchemaPropertiesFromAnyOf(anyOf: Array<any>): any | null {
    let propertiesFromAnyOf: any | null = null;

    for (const anyOfItem of anyOf) {
        if (anyOfItem[refPropertyName]) {
            const splitRef = anyOfItem[refPropertyName].split("/");
            const customElement = splitRef.slice(-2)[0];
            const attributeName = splitRef.slice(-1)[0].slice(0, -5);

            if (Schema.jsonSchemaMap.has(customElement)) {
                const customElementSchemaMap = Schema.jsonSchemaMap.get(
                    customElement,
                ) as Map<string, JSONSchema>;
                propertiesFromAnyOf = customElementSchemaMap.get(attributeName);
            }
        }
    }

    return propertiesFromAnyOf;
}

/**
 * Gets a properties definition if one exists
 * @param schema - The JSON schema to get properties from
 * @returns A JSON schema with properties or null
 */
function getSchemaProperties(schema: any): any | null {
    if (schema?.properties) {
        return schema.properties;
    } else if (schema?.anyOf) {
        return getSchemaPropertiesFromAnyOf(schema.anyOf);
    }

    return null;
}

/**
 * Checks whether a schema node (or any of its descendants) has observation enabled.
 * Returns false only when the node and ALL its descendants are stamped with `$observe: false`.
 */
function hasObservedSchemaDescendant(schema: any): boolean {
    if (schema?.$observe !== false) {
        return true;
    }

    const props = getSchemaProperties(schema);

    if (!props) {
        return false;
    }

    return Object.keys(props).some(k => hasObservedSchemaDescendant(props[k]));
}

/**
 * Checks whether a schema node is fully excluded from observation.
 * A node is excluded when it is stamped `$observe: false` AND none of
 * its descendants are observed (no re-included leaves beneath it).
 */
function isSchemaExcluded(schema: any): boolean {
    return schema?.$observe === false && !hasObservedSchemaDescendant(schema);
}

/**
 * Assigns Observable properties to items in an array and sets up change notifications
 * @param proxiedData - The array data to make observable
 * @param schema - The schema defining the structure of array items
 * @param rootSchema - The root schema for the entire data structure
 * @param target - The target element
 * @param rootProperty - The root property name
 * @returns The array with observable properties and change notifications
 */
function assignObservablesToArray(
    proxiedData: any,
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
    target: any,
    rootProperty: string,
): any {
    const schemaProperties = getSchemaProperties(schema);

    // If the schema has no properties, the array contains primitives (e.g. string[])
    // — observe the array for changes but skip per-item proxying.
    const data = schemaProperties
        ? proxiedData.map((item: any) => {
              const originalItem = Object.assign({}, item);

              assignProxyToItemsInArray(item, originalItem, schema, rootSchema);

              return Object.assign(item, originalItem);
          })
        : proxiedData;

    Observable.getNotifier(data).subscribe({
        handleChange(subject, args) {
            args.forEach((arg: any) => {
                if (arg.addedCount > 0) {
                    if (schemaProperties) {
                        for (let i = arg.addedCount - 1; i >= 0; i--) {
                            const item = subject[arg.index + i];
                            const originalItem = Object.assign({}, item);

                            assignProxyToItemsInArray(
                                item,
                                originalItem,
                                schema,
                                rootSchema,
                            );

                            Object.assign(item, originalItem);
                        }
                    }

                    // Notify observers of the target object's root property
                    Observable.notify(target, rootProperty);
                }
            });
        },
    });

    if (schemaProperties !== null) {
        return data;
    }

    // For primitive arrays, wrap in a Proxy so that direct index assignment
    // (e.g. arr[0] = value) triggers FAST's splice-based change tracking and
    // keeps repeat directives in sync. Object arrays are not wrapped because
    // their items are individually proxied, and FAST's own push/splice/etc.
    // already carry splice records — double-wrapping would produce duplicate
    // splice notifications.
    return new Proxy(data, {
        set: (arr: any, prop: string | symbol, value: any) => {
            const idx = typeof prop === "string" ? Number(prop) : NaN;

            if (typeof prop !== "symbol" && Number.isInteger(idx) && idx >= 0) {
                // splice() replaces the item in-place and creates the splice
                // record that FAST's ArrayObserver delivers to repeat directives.
                Array.prototype.splice.call(arr, idx, 1, value);
            } else {
                arr[prop] = value;
            }

            return true;
        },
    });
}

/**
 * Extracts the definition name from a JSON Schema $ref property
 * @param defName - The $ref string (e.g., "#/$defs/MyType")
 * @returns The definition name (e.g., "MyType")
 */
function getDefFromRef(defName: string): string {
    const splitName = defName.split("/");

    return splitName[splitName.length - 1] as string;
}

/**
 * Find a definition
 * This may exist as a $ref at the root or as a $ref in anyOf or not at all
 * if the Observer Map has not been enabled on a child component
 * @param schema - The JSON schema to find the ref in
 * @returns The definition or null
 * @public
 */
export function findDef(schema: JSONSchema | JSONSchemaDefinition): string | null {
    const defStartingString = "#/$defs";

    if (
        schema[refPropertyName] &&
        schema[refPropertyName].startsWith(defStartingString)
    ) {
        return getDefFromRef(schema[refPropertyName]);
    }

    if (schema.anyOf) {
        const index = schema.anyOf.findIndex((anyOfItem: JSONSchema) => {
            return (
                !!anyOfItem[refPropertyName] &&
                anyOfItem[refPropertyName].startsWith(defStartingString)
            );
        });

        if (index > -1) {
            const ref = schema.anyOf[index][refPropertyName];

            if (ref.startsWith(defStartingString)) {
                return getDefFromRef(ref);
            }
        }
    }

    return null;
}

/**
 * Subscribe to a notifier on data that is an observed array
 * @param data - The array being observed
 * @param updateArrayObservables - The function to call to update the array item
 */
function assignSubscribeToObservableArray(
    data: any,
    updateArrayObservables: () => void,
): void {
    Observable.getNotifier(data).subscribe({
        handleChange(subject, args) {
            args.forEach((arg: any) => {
                updateArrayObservables();
            });
        },
    });
}

/**
 * Assign observables to data
 * @param schema - The schema
 * @param rootSchema - The root schema mapping to the root property
 * @param data - The data
 * @param target - The target custom element
 * @param rootProperty - The root property
 * @returns
 * @public
 */
export function assignObservables(
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
    data: any,
    target: any,
    rootProperty: string,
): any {
    const dataType = getDataType(data);
    let proxiedData = data;

    switch (dataType) {
        case "array": {
            const context = findDef(schema);

            if (context) {
                proxiedData = assignObservablesToArray(
                    proxiedData,
                    (rootSchema as JSONSchema)[defsPropertyName]?.[
                        context
                    ] as JSONSchemaDefinition,
                    rootSchema,
                    target,
                    rootProperty,
                );

                if (!observedArraysMap.has(proxiedData)) {
                    observedArraysMap.set(
                        proxiedData,
                        assignSubscribeToObservableArray(proxiedData, () =>
                            assignObservablesToArray(
                                proxiedData,
                                (rootSchema as JSONSchema)[defsPropertyName]?.[
                                    context
                                ] as JSONSchemaDefinition,
                                rootSchema,
                                target,
                                rootProperty,
                            ),
                        ),
                    );
                }
            } else {
                // Primitive array (items have no schema $ref): wrap in a proxy so that
                // direct index assignments (e.g. arr[0] = value) use FAST's splice-based
                // change tracking and keep repeat directives in sync.
                proxiedData = assignObservablesToArray(
                    proxiedData,
                    schema,
                    rootSchema,
                    target,
                    rootProperty,
                );
            }

            break;
        }
        case "object": {
            proxiedData = assignProxyToItemsInObject(
                target,
                rootProperty,
                proxiedData,
                schema,
                rootSchema,
            );
            break;
        }
    }

    return proxiedData;
}

/**
 * Assign a proxy to items in an array
 * @param proxiableItem - The array item to proxy
 * @param originalItem - The original array item
 * @param schema - The schema mapping to the items in the array
 * @param rootSchema - The root schema assigned to the root property
 */
function assignProxyToItemsInArray(
    proxiableItem: any,
    originalItem: any,
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
): void {
    const schemaProperties = getSchemaProperties(schema);

    getObjectProperties(proxiableItem, schemaProperties).forEach(key => {
        const childSchema = schemaProperties[key];

        // Skip properties fully excluded from observation
        if (isSchemaExcluded(childSchema)) {
            return;
        }

        // Initialize the property as undefined if it doesn't exist
        if (!(key in originalItem)) {
            originalItem[key] = undefined;
        }

        // Assign the proxy first
        originalItem[key] = assignProxyToItemsInObject(
            proxiableItem,
            key,
            originalItem[key],
            schemaProperties[key],
            rootSchema,
        );

        // Then make the property observable
        Observable.defineProperty(proxiableItem, key);
    });
}

/**
 * Get an objects properties as agreed upon between the schema and data
 * @param data - The data
 * @param schemaProperties - The schema properties
 * @returns A list of strings the schema properties enumerate (includes properties not present in data)
 */
function getObjectProperties(data: any, schemaProperties: any): string[] {
    const dataKeys = Object.keys(data);
    const schemaPropertyKeys = Object.keys(schemaProperties ?? {});

    // Return all schema properties that are either in the data or in the schema
    // This ensures properties defined in schema but missing from data get initialized
    const allKeys = new Set([...dataKeys, ...schemaPropertyKeys]);

    return Array.from(allKeys).filter(function (key) {
        return schemaPropertyKeys.indexOf(key) !== -1;
    });
}

/**
 * Assign a proxy to items in an object
 * @param target - The target custom element
 * @param rootProperty - The root property
 * @param data - The data to proxy
 * @param schema - The schema for the data
 * @param rootSchema - The root schema for the root property
 * @returns a Proxy
 */
function assignProxyToItemsInObject(
    target: any,
    rootProperty: string,
    data: any,
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
): any | typeof Proxy {
    const type = getDataType(data);
    const schemaProperties = getSchemaProperties(schema);
    let proxiedData = data;

    if (type === "object" && schemaProperties) {
        // navigate through all items in the object
        getObjectProperties(proxiedData, schemaProperties).forEach(property => {
            const childSchema = schemaProperties[property];

            // Skip properties fully excluded from observation
            if (isSchemaExcluded(childSchema)) {
                return;
            }

            proxiedData[property] = assignProxyToItemsInObject(
                target,
                rootProperty,
                proxiedData[property],
                schemaProperties[property],
                rootSchema,
            );
        });

        // Assign a Proxy unless this level is fully excluded from observation
        if (!isSchemaExcluded(schema)) {
            proxiedData = assignProxy(
                schema,
                rootSchema,
                target,
                rootProperty,
                proxiedData,
            );

            // Add this target to the object's target list
            addTargetToObject(proxiedData, target, rootProperty);
        }
    } else if (type === "array") {
        const context = findDef((schema as JSONSchema).items);

        if (context) {
            const definition = (rootSchema as JSONSchema)[defsPropertyName]?.[context];

            if (definition?.type === "object") {
                proxiedData = assignObservablesToArray(
                    proxiedData,
                    definition as JSONSchemaDefinition,
                    rootSchema,
                    target,
                    rootProperty,
                );

                if (!observedArraysMap.has(proxiedData)) {
                    observedArraysMap.set(
                        proxiedData,
                        assignObservablesToArray(
                            proxiedData,
                            definition as JSONSchemaDefinition,
                            rootSchema,
                            target,
                            rootProperty,
                        ),
                    );
                }
            }
        }
    }

    return proxiedData;
}

/**
 * Add a target to an object's target list
 * @param object - The object to associate with the target
 * @param target - The target custom element
 * @param rootProperty - The root property name
 */
function addTargetToObject(object: any, target: any, rootProperty: string): void {
    if (!objectTargetsMap.has(object)) {
        objectTargetsMap.set(object, []);
    }

    const targets = objectTargetsMap.get(object) as ObservedTargetsAndProperties[];

    targets.push({ target, rootProperty });
}

/**
 * Get all targets for an object
 * @param object - The object to get targets for
 * @returns Array of target info objects
 */
function getTargetsForObject(object: any): ObservedTargetsAndProperties[] {
    return objectTargetsMap.get(object) || [];
}

/**
 * Notify any observables mapped to the object
 * @param targetObject The object that is mapped to a target and rootProperty
 */
function notifyObservables(targetObject: any) {
    getTargetsForObject(targetObject).forEach(
        (targetItem: ObservedTargetsAndProperties) => {
            // Trigger notification for property changes
            Observable.notify(targetItem.target, targetItem.rootProperty);
        },
    );
}

/**
 * Assign a proxy to an object
 * @param schema - The current schema
 * @param rootSchema - The root schema for the root property
 * @param target - The target custom element
 * @param rootProperty - The root property
 * @param object - The object to assign the proxy to
 * @returns Proxy object
 * @public
 */
export function assignProxy(
    schema: JSONSchema | JSONSchemaDefinition,
    rootSchema: JSONSchema,
    target: any,
    rootProperty: string,
    object: any,
): any {
    if (!object.$isProxy) {
        const schemaProperties = getSchemaProperties(schema);

        // Create a proxy for the object that triggers Observable.notify on mutations
        const proxy = new Proxy(object, {
            set: (obj: any, prop: string | symbol, value: any) => {
                const currentValue = obj[prop];

                if (deepEqual(currentValue, value)) {
                    return true;
                }

                const propName = typeof prop === "string" ? prop : String(prop);
                const childSchema = schemaProperties?.[propName];

                // If the property is fully excluded, assign without proxying or notifying
                if (isSchemaExcluded(childSchema)) {
                    obj[prop] = value;
                    return true;
                }

                obj[prop] = assignObservables(
                    schema,
                    rootSchema,
                    value,
                    target,
                    rootProperty,
                );

                notifyObservables(proxy);

                return true;
            },
            get: (target, key) => {
                if (key !== "$isProxy") {
                    return target[key];
                }

                return true;
            },
            deleteProperty: (obj: any, prop: string | symbol) => {
                if (prop in obj) {
                    const propName = typeof prop === "string" ? prop : String(prop);
                    const childSchema = schemaProperties?.[propName];

                    delete obj[prop];

                    // Only suppress notification if fully excluded
                    if (isSchemaExcluded(childSchema)) {
                        return true;
                    }

                    notifyObservables(proxy);

                    return true;
                }
                return false;
            },
        });

        return proxy;
    }

    return object;
}

/**
 * Determine if an object has an observable accessor for a backing field
 * @param object - The object to check
 * @param backingField - The backing field name
 * @returns True if the object has an observable accessor for the backing field, false otherwise
 */
function hasObservableAccessor(object: any, backingField: string): boolean {
    const accessors = Observable.getAccessors(object);

    if (!accessors) {
        return false;
    }

    return accessors.some((accessor: { name: string }) => accessor.name === backingField);
}

/**
 * Determine if a key should be skipped during deep comparison
 *
 * @param object - The object to check
 * @param key - The key to evaluate
 * @returns True if the key should be skipped during comparison, false otherwise
 */
function shouldSkipKey(object: any, key: string): boolean {
    if (key[0] !== "_" || key === "_") {
        return false;
    }

    return hasObservableAccessor(object, key.slice(1));
}

/**
 * Get comparable keys from an object, excluding those that should be skipped
 *
 * @param object - The object to extract keys from
 * @returns An array of keys that should be compared
 */
function getComparableKeys(object: any): string[] {
    const hasOwn = Object.prototype.hasOwnProperty;
    const keys: string[] = [];

    for (const key in object) {
        if (!hasOwn.call(object, key) || shouldSkipKey(object, key)) {
            continue;
        }

        keys.push(key);
    }

    return keys;
}

/**
 * Deeply compares two objects for equality.
 *
 * @param obj1 - First object to compare
 * @param obj2 - Second object to compare
 * @returns True if the objects are deeply equal, false otherwise
 * @public
 */
export function deepEqual(obj1: any, obj2: any): boolean {
    if (Object.is(obj1, obj2)) {
        return true;
    }

    if (obj1 == null || obj2 == null) {
        return false;
    }

    const type1 = typeof obj1;
    const type2 = typeof obj2;
    if (type1 !== type2 || type1 !== "object") {
        return false;
    }

    const isArray1 = Array.isArray(obj1);
    const isArray2 = Array.isArray(obj2);
    if (isArray1 !== isArray2) {
        return false;
    }

    if (isArray1) {
        const len = obj1.length;
        if (len !== obj2.length) {
            return false;
        }
        for (let i = 0; i < len; i++) {
            if (!deepEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
        return true;
    }

    const hasOwn = Object.prototype.hasOwnProperty;
    const obj1Keys = getComparableKeys(obj1);
    const obj2Keys = getComparableKeys(obj2);

    if (obj1Keys.length !== obj2Keys.length) {
        return false;
    }

    for (const key of obj1Keys) {
        if (!hasOwn.call(obj2, key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

/**
 * Checks if a value is a plain object (not an array, null, or other type).
 *
 * @param value - The value to check
 * @returns True if the value is a plain object, false otherwise
 * @public
 */
export function isPlainObject(value: any): value is Record<string, any> {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Deeply merges the source object into the target object.
 *
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns boolean indicating whether changes were made
 * @public
 */
export function deepMerge(target: any, source: any): boolean {
    const hasOwn = Object.prototype.hasOwnProperty;
    let hasChanges = false;

    for (const key in source as any) {
        if (!hasOwn.call(source, key)) {
            continue;
        }

        const sourceValue = (source as any)[key];

        if (sourceValue === void 0) {
            continue;
        }

        const targetValue = target[key];

        if (deepEqual(targetValue, sourceValue)) {
            continue;
        }

        hasChanges = true;

        if (Array.isArray(sourceValue)) {
            const isTargetArray = Array.isArray(targetValue);
            const clonedItems = sourceValue.map((item: unknown) =>
                isPlainObject(item) ? { ...item } : item,
            );

            if (isTargetArray) {
                // Use splice to maintain observable array tracking
                targetValue.splice(0, targetValue.length, ...clonedItems);
            } else {
                // Target isn't an array, replace it
                target[key] = clonedItems;
            }
            continue;
        }

        if (isPlainObject(sourceValue)) {
            const targetIsObject = isPlainObject(targetValue);
            const nextTarget = targetIsObject ? { ...targetValue } : {};
            const nestedChanged = deepMerge(nextTarget, sourceValue);

            if (!targetIsObject) {
                target[key] = nextTarget;
                continue;
            }

            if (nestedChanged) {
                target[key] = nextTarget;
            }
            continue;
        }

        target[key] = sourceValue;
    }

    return hasChanges;
}
