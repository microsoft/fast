import type { FASTElementDefinition } from "@microsoft/fast-element";
import { AttributeDefinition, Observable } from "@microsoft/fast-element";
import type { Schema } from "./schema.js";

/**
 * AttributeMap provides functionality for detecting simple (leaf) properties in
 * a generated JSON schema and defining them as @attr properties on a class prototype.
 *
 * A property is a candidate for @attr when its schema entry has no nested `properties`,
 * no `type`, and no `anyOf` — i.e. it is a plain binding like {{foo}} or id="{{bar}}".
 *
 * camelCase property names are converted to dash-case attribute names (e.g. fooBar → foo-bar).
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
        const existingAccessors = Observable.getAccessors(this.classPrototype);

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
            if (existingAccessors.some(accessor => accessor.name === propertyName)) {
                continue;
            }

            const attributeName = this.camelCaseToDashCase(propertyName);
            const attrDef = new AttributeDefinition(
                this.classPrototype.constructor,
                propertyName,
                attributeName,
            );

            Observable.defineProperty(this.classPrototype, attrDef);

            if (this.definition) {
                (this.definition.attributeLookup as Record<string, AttributeDefinition>)[
                    attributeName
                ] = attrDef;
                (this.definition.propertyLookup as Record<string, AttributeDefinition>)[
                    propertyName
                ] = attrDef;
            }
        }
    }

    /**
     * Converts a camelCase string to dash-case.
     * e.g. fooBar → foo-bar
     */
    private camelCaseToDashCase(str: string): string {
        return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    }
}
