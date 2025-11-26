import { Observable } from "@microsoft/fast-element/observable.js";
import { assignObservables } from "./utilities.js";
import type { JSONSchema, Schema } from "./schema.js";

/**
 * ObserverMap provides functionality for caching binding paths, extracting root properties,
 * and defining observable properties on class prototypes
 */
export class ObserverMap {
    private schema: Schema;
    private classPrototype: any;

    constructor(classPrototype: any, schema: Schema) {
        this.classPrototype = classPrototype;
        this.schema = schema;
    }

    public defineProperties(): void {
        const propertyNames = this.schema.getRootProperties();
        const existingAccessors = Observable.getAccessors(this.classPrototype);

        for (const propertyName of propertyNames) {
            // Skip if property already has an accessor (from `@attr` or `@observable` decorator)
            if (!existingAccessors.some(accessor => accessor.name === propertyName)) {
                Observable.defineProperty(this.classPrototype, propertyName);
            }

            const changedMethodName = `${propertyName}Changed`;
            const existingChangedMethod = this.classPrototype[changedMethodName];

            this.classPrototype[changedMethodName] = this.defineChanged(
                propertyName,
                existingChangedMethod
            );
        }
    }

    /**
     * Creates a proxy for an object that intercepts property mutations and triggers Observable notifications
     * @param target - The target instance that owns the root property
     * @param rootProperty - The name of the root property for notification purposes
     * @param object - The object to wrap with a proxy
     * @returns A proxy that triggers notifications on property mutations
     */
    private getAndAssignObservables(
        target: any,
        rootProperty: string,
        object: any,
        schema: Schema
    ): typeof Proxy {
        let proxiedObject = object;

        proxiedObject = assignObservables(
            schema.getSchema(rootProperty) as JSONSchema,
            schema.getSchema(rootProperty) as JSONSchema,
            proxiedObject,
            target,
            rootProperty
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
        existingChangedMethod?: (prev: any, next: any) => void
    ): ((prev: any, next: any) => void) => {
        const getAndAssignObservablesAlias = this.getAndAssignObservables;
        const schema = this.schema;

        function instanceResolverChanged(this: any, prev: any, next: any): void {
            if (next === null || typeof next !== "object") {
                this[propertyName] = next;
            } else if (
                prev === undefined ||
                (prev?.$isProxy && !next?.$isProxy) ||
                (Array.isArray(prev) &&
                    Array.isArray(next) &&
                    !(next as any)?.$fastController)
            ) {
                this[propertyName] = getAndAssignObservablesAlias(
                    this,
                    propertyName,
                    next,
                    schema
                );
            }

            existingChangedMethod?.call(this, prev, next);
        }

        return instanceResolverChanged;
    };
}
