import { AttributeDefinition } from "../components/attributes.js";
import { setDefinitionSchemaTransform } from "../components/definition-schema-transforms.js";
import {
    type FASTElementDefinition,
    type FASTElementExtension,
    hasFASTElementTemplateResolver,
    trackLateAttributeDefinition,
} from "../components/fast-definitions.js";
import type { Schema } from "../components/schema.js";
import { Observable } from "../observation/observable.js";

export {
    type AccessCachedPath,
    type CachedPath,
    type CachedPathCommon,
    type CachedPathMap,
    type ChildrenMap,
    type DefaultCachedPath,
    type EventCachedPath,
    type JSONSchema,
    type JSONSchemaCommon,
    type JSONSchemaDefinition,
    type RegisterPathConfig,
    type RepeatCachedPath,
    Schema,
    schemaRegistry,
} from "../components/schema.js";

/**
 * Configuration object for the attributeMap extension.
 * Omitting all fields uses the default attribute-mapping behavior.
 * @public
 */
export interface AttributeMapConfig {
    /**
     * Strategy for mapping template binding keys to HTML attribute names.
     *
     * - `"camelCase"` (default): the binding key is treated as a camelCase property
     *   name and the attribute name is derived by converting it to
     *   kebab-case (e.g. `{{fooBar}}` → property `fooBar`, attribute
     *   `foo-bar`). This matches the build-time `attribute-name-strategy`
     *   option in `@microsoft/fast-build`.
     * - `"none"`: the binding key is used as-is for both the
     *   property name and the attribute name (e.g. `{{foo-bar}}` →
     *   property `foo-bar`, attribute `foo-bar`).
     */
    "attribute-name-strategy"?: "none" | "camelCase";
}

const attributeMapSchemaTransformKey = "attribute-map";
const attributeMapSchemaTransformPriority = 0;

function defineAttributeMap(
    definition: FASTElementDefinition,
    schema: Schema,
    config: AttributeMapConfig,
): void {
    new AttributeMap(
        definition.type.prototype,
        schema,
        definition,
        config,
    ).defineProperties();
}

/**
 * Creates a FAST element extension that enables schema-driven attribute mapping
 * for the resolved definition. When called without arguments, uses the default
 * attribute-mapping behavior. The extension uses `definition.schema` immediately
 * for manual schemas, or the schema generated/augmented by `declarativeTemplate()`.
 * @public
 */
export function attributeMap(config: AttributeMapConfig = {}): FASTElementExtension {
    return definition => {
        if (definition.schema && !hasFASTElementTemplateResolver(definition)) {
            defineAttributeMap(definition, definition.schema, config);
            return;
        }

        setDefinitionSchemaTransform(
            definition,
            attributeMapSchemaTransformKey,
            ({ definition, schema }) => defineAttributeMap(definition, schema, config),
            attributeMapSchemaTransformPriority,
        );
    };
}

/**
 * Converts a camelCase string to kebab-case.
 *
 * @example camelToKebab("fooBar")       // "foo-bar"
 * @example camelToKebab("myCustomProp") // "my-custom-prop"
 * @example camelToKebab("label")        // "label"
 */
function camelToKebab(str: string): string {
    return str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
}

/**
 * AttributeMap provides functionality for detecting simple (leaf) properties in
 * a generated JSON schema and defining them as attr properties on a class prototype.
 *
 * A property is a candidate for attr when its schema entry has no nested `properties`,
 * no `type`, and no `anyOf` — for example, a plain `foo` binding.
 *
 * When `attribute-name-strategy` is `"camelCase"` (the default), the binding key is treated as a
 * camelCase property name and the HTML attribute name is derived by converting it to
 * kebab-case (e.g. property `fooBar` → attribute `foo-bar`). This matches the
 * build-time `attribute-name-strategy` option in `@microsoft/fast-build`.
 *
 * When `attribute-name-strategy` is `"none"`, the binding key is used
 * as both the attribute name and property name — no normalization is applied.
 *
 * Properties already decorated with `attr` or `observable` on the class are left
 * untouched.
 * @public
 */
export class AttributeMap {
    private schema: Schema;
    private classPrototype: any;
    private definition: FASTElementDefinition | undefined;
    private config: AttributeMapConfig | undefined;

    constructor(
        classPrototype: any,
        schema: Schema,
        definition?: any,
        config?: AttributeMapConfig,
    ) {
        this.classPrototype = classPrototype;
        this.schema = schema;
        this.definition = definition;
        this.config = config;
    }

    public defineProperties(): void {
        const propertyNames = this.schema.getRootProperties();
        const existingAccessorNames = new Set(
            Observable.getAccessors(this.classPrototype).map(a => a.name),
        );
        const strategy = this.config?.["attribute-name-strategy"] ?? "camelCase";

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

            // Derive the HTML attribute name from the property name.
            // With "camelCase" strategy, convert camelCase to kebab-case
            // (e.g. fooBar → foo-bar). With "none", use the property name as-is.
            const attributeName =
                strategy === "camelCase" ? camelToKebab(propertyName) : propertyName;

            const attrDef = new AttributeDefinition(
                this.classPrototype.constructor,
                propertyName,
                attributeName,
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
                !existingObservedAttrs.includes(attributeName)
            ) {
                existingObservedAttrs.push(attributeName);
            }

            if (this.definition) {
                (this.definition.attributeLookup as Record<string, AttributeDefinition>)[
                    attributeName
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

                if (this.definition.isDefined) {
                    trackLateAttributeDefinition(this.definition, attrDef);
                }
            }
        }
    }
}
