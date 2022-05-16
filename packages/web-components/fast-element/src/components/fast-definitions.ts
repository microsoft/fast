import { FAST, KernelServiceId } from "../platform.js";
import { Observable } from "../observation/observable.js";
import { ComposableStyles, ElementStyles } from "../styles/element-styles.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { AttributeConfiguration, AttributeDefinition } from "./attributes.js";

const defaultShadowOptions: ShadowRootInit = { mode: "open" };
const defaultElementOptions: ElementDefinitionOptions = {};
const fastRegistry = FAST.getById(KernelServiceId.elementRegistry, () => {
    const typeToDefinition = new Map<Function, FASTElementDefinition>();

    return Object.freeze({
        register(definition: FASTElementDefinition): boolean {
            if (typeToDefinition.has(definition.type)) {
                return false;
            }

            typeToDefinition.set(definition.type, definition);
            return true;
        },
        getByType<TType extends Function>(key: TType): FASTElementDefinition | undefined {
            return typeToDefinition.get(key);
        },
    });
});

/**
 * Represents metadata configuration for a custom element.
 * @public
 */
export interface PartialFASTElementDefinition {
    /**
     * The name of the custom element.
     */
    readonly name: string;

    /**
     * The template to render for the custom element.
     */
    readonly template?: ElementViewTemplate;

    /**
     * The styles to associate with the custom element.
     */
    readonly styles?: ComposableStyles | ComposableStyles[];

    /**
     * The custom attributes of the custom element.
     */
    readonly attributes?: (AttributeConfiguration | string)[];

    /**
     * Options controlling the creation of the custom element's shadow DOM.
     */
    readonly shadowOptions?: Partial<ShadowRootInit> | null;

    /**
     * Options controlling how the custom element is defined with the platform.
     */
    readonly elementOptions?: ElementDefinitionOptions;
}

/**
 * Defines metadata for a FASTElement.
 * @public
 */
export class FASTElementDefinition<TType extends Function = Function> {
    private observedAttributes: string[];

    /**
     * The type this element definition describes.
     */
    public readonly type: TType;

    /**
     * Indicates if this element has been defined in at least one registry.
     */
    public get isDefined(): boolean {
        return !!fastRegistry.getByType(this.type);
    }

    /**
     * The name of the custom element.
     */
    public readonly name: string;

    /**
     * The custom attributes of the custom element.
     */
    public readonly attributes: ReadonlyArray<AttributeDefinition>;

    /**
     * A map enabling lookup of attribute by associated property name.
     */
    public readonly propertyLookup: Record<string, AttributeDefinition>;

    /**
     * A map enabling lookup of property by associated attribute name.
     */
    public readonly attributeLookup: Record<string, AttributeDefinition>;

    /**
     * The template to render for the custom element.
     */
    public readonly template?: ElementViewTemplate;

    /**
     * The styles to associate with the custom element.
     */
    public readonly styles?: ElementStyles;

    /**
     * Options controlling the creation of the custom element's shadow DOM.
     */
    public readonly shadowOptions?: ShadowRootInit;

    /**
     * Options controlling how the custom element is defined with the platform.
     */
    public readonly elementOptions?: ElementDefinitionOptions;

    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrConfig - The name of the element to define or a config object
     * that describes the element to define.
     */
    public constructor(
        type: TType,
        nameOrConfig: PartialFASTElementDefinition | string = (type as any).definition
    ) {
        if (typeof nameOrConfig === "string") {
            nameOrConfig = { name: nameOrConfig };
        }

        this.type = type;
        this.name = nameOrConfig.name;
        this.template = nameOrConfig.template;

        const attributes = AttributeDefinition.collect(type, nameOrConfig.attributes);
        const observedAttributes = new Array<string>(attributes.length);
        const propertyLookup = {};
        const attributeLookup = {};

        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
        }

        this.attributes = attributes;
        this.observedAttributes = observedAttributes;
        this.propertyLookup = propertyLookup;
        this.attributeLookup = attributeLookup;

        this.shadowOptions =
            nameOrConfig.shadowOptions === void 0
                ? defaultShadowOptions
                : nameOrConfig.shadowOptions === null
                ? void 0
                : { ...defaultShadowOptions, ...nameOrConfig.shadowOptions };

        this.elementOptions =
            nameOrConfig.elementOptions === void 0
                ? defaultElementOptions
                : { ...defaultElementOptions, ...nameOrConfig.elementOptions };

        this.styles =
            nameOrConfig.styles === void 0
                ? void 0
                : Array.isArray(nameOrConfig.styles)
                ? ElementStyles.create(nameOrConfig.styles)
                : nameOrConfig.styles instanceof ElementStyles
                ? nameOrConfig.styles
                : ElementStyles.create([nameOrConfig.styles]);
    }

    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     */
    public define(registry: CustomElementRegistry = customElements): this {
        const type = this.type;

        if (fastRegistry.register(this)) {
            const attributes = this.attributes;
            const proto = type.prototype;

            for (let i = 0, ii = attributes.length; i < ii; ++i) {
                Observable.defineProperty(proto, attributes[i]);
            }

            Reflect.defineProperty(type, "observedAttributes", {
                value: this.observedAttributes,
                enumerable: true,
            });
        }

        if (!registry.get(this.name)) {
            registry.define(this.name, type as any, this.elementOptions);
        }

        return this;
    }

    /**
     * Gets the element definition associated with the specified type.
     * @param type - The custom element type to retrieve the definition for.
     */
    static readonly forType = fastRegistry.getByType;
}
