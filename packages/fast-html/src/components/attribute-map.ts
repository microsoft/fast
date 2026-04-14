import type { FASTElementDefinition } from "@microsoft/fast-element";
import { AttributeDefinition, Observable } from "@microsoft/fast-element";
import type { Schema } from "./schema.js";

/**
 * AttributeMap provides functionality for detecting simple (leaf) properties in
 * a generated JSON schema and defining them as @attr properties on a class prototype.
 *
 * A property is a candidate for @attr when its schema entry has no nested `properties`,
 * no `type`, and no `anyOf` — i.e. it is a plain binding like {{foo}} or id="{{foo-bar}}".
 *
 * Attribute names are **not** normalized — the binding key as written in the template
 * is used as both the attribute name and the property name. Because HTML attributes are
 * case-insensitive, binding keys should be lowercase (optionally dash-separated).
 * For example, {{foo-bar}} results in attribute `foo-bar` and property `foo-bar`.
 */
export class AttributeMap {
    private schema: Schema;
    private classPrototype: any;
    private definition: FASTElementDefinition | undefined;

    constructor(classPrototype: any, schema: Schema, definition?: FASTElementDefinition) {
        this.classPrototype = classPrototype;
        this.schema = schema;
        this.definition = definition;
    }

    public defineProperties(): void {
        const propertyNames = this.schema.getRootProperties();
        const existingAccessorNames = new Set(
            Observable.getAccessors(this.classPrototype).map(a => a.name),
        );

        for (const propertyName of propertyNames) {
            const propertySchema = this.schema.getSchema(propertyName);

            // Only create @attr for leaf properties:
            // - no nested properties (not a dot-syntax path)
            // - no type (not an explicitly typed value like an array)
            // - no anyOf (not a child element reference)
            if (
                !propertySchema ||
                propertySchema.properties ||
                propertySchema.type ||
                propertySchema.anyOf
            ) {
                continue;
            }

            // Skip if the property already has an accessor (from @attr or @observable)
            if (existingAccessorNames.has(propertyName)) {
                continue;
            }

            const attrDef = new AttributeDefinition(
                this.classPrototype.constructor,
                propertyName,
                propertyName,
            );

            Observable.defineProperty(this.classPrototype, attrDef);

            // Mutate the existing observedAttributes array on the class.
            // FAST's FASTElementDefinition sets observedAttributes via
            // Reflect.defineProperty with a concrete array value (non-configurable,
            // non-writable), so the descriptor cannot be replaced. However, the
            // array itself is mutable, and pushing into it works because
            // registry.define() — which causes the browser to snapshot
            // observedAttributes — is called AFTER this method runs.
            const existingObservedAttrs: string[] | undefined = (
                this.classPrototype.constructor as any
            ).observedAttributes;
            if (
                Array.isArray(existingObservedAttrs) &&
                !existingObservedAttrs.includes(propertyName)
            ) {
                existingObservedAttrs.push(propertyName);
            }

            if (this.definition) {
                (this.definition.attributeLookup as Record<string, AttributeDefinition>)[
                    propertyName
                ] = attrDef;
                (this.definition.propertyLookup as Record<string, AttributeDefinition>)[
                    propertyName
                ] = attrDef;

                const attrs = (this.definition as any).attributes;
                if (
                    Array.isArray(attrs) &&
                    !attrs.some(
                        (existing: AttributeDefinition) =>
                            existing.name === attrDef.name ||
                            existing.attribute === attrDef.attribute,
                    )
                ) {
                    attrs.push(attrDef);
                }
            }
        }
    }
}
