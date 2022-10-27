import { Constructable, isString, KernelServiceId } from "../interfaces.js";
import { Observable } from "../observation/observable.js";
import { createTypeRegistry, FAST, TypeRegistry } from "../platform.js";
import { ComposableStyles, ElementStyles } from "../styles/element-styles.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { AttributeConfiguration, AttributeDefinition } from "./attributes.js";

const defaultShadowOptions: ShadowRootInit = { mode: "open" };
const defaultElementOptions: ElementDefinitionOptions = {};
const fastElementBaseTypes = new Set<Function>();

const fastElementRegistry: TypeRegistry<FASTElementDefinition> = FAST.getById(
    KernelServiceId.elementRegistry,
    () => createTypeRegistry<FASTElementDefinition>()
);

/**
 * Shadow root initialization options.
 * @public
 */
export interface ShadowRootOptions extends ShadowRootInit {
    /**
     * A registry that provides the custom elements visible
     * from within this shadow root.
     * @beta
     */
    registry?: CustomElementRegistry;
}

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
     * @remarks
     * If not provided, defaults to an open shadow root. Provide null
     * to render to the associated template to the light DOM instead.
     */
    readonly shadowOptions?: Partial<ShadowRootOptions> | null;

    /**
     * Options controlling how the custom element is defined with the platform.
     */
    readonly elementOptions?: ElementDefinitionOptions;

    /**
     * The registry to register this component in by default.
     * @remarks
     * If not provided, defaults to the global registry.
     */
    readonly registry?: CustomElementRegistry;
}

/**
 * Defines metadata for a FASTElement.
 * @public
 */
export class FASTElementDefinition<
    TType extends Constructable<HTMLElement> = Constructable<HTMLElement>
> {
    private platformDefined = false;

    /**
     * The type this element definition describes.
     */
    public readonly type: TType;

    /**
     * Indicates if this element has been defined in at least one registry.
     */
    public get isDefined(): boolean {
        return this.platformDefined;
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
    public readonly shadowOptions?: ShadowRootOptions;

    /**
     * Options controlling how the custom element is defined with the platform.
     */
    public readonly elementOptions: ElementDefinitionOptions;

    /**
     * The registry to register this component in by default.
     */
    readonly registry: CustomElementRegistry;

    private constructor(
        type: TType,
        nameOrConfig: PartialFASTElementDefinition | string = (type as any).definition
    ) {
        if (isString(nameOrConfig)) {
            nameOrConfig = { name: nameOrConfig };
        }

        this.type = type;
        this.name = nameOrConfig.name;
        this.template = nameOrConfig.template;
        this.registry = nameOrConfig.registry ?? customElements;

        const proto = type.prototype;
        const attributes = AttributeDefinition.collect(type, nameOrConfig.attributes);
        const observedAttributes = new Array<string>(attributes.length);
        const propertyLookup = {};
        const attributeLookup = {};

        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
            Observable.defineProperty(proto, current);
        }

        Reflect.defineProperty(type, "observedAttributes", {
            value: observedAttributes,
            enumerable: true,
        });

        this.attributes = attributes;
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

        this.styles = ElementStyles.normalize(nameOrConfig.styles);

        fastElementRegistry.register(this);
    }

    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     * @remarks
     * This operation is idempotent per registry.
     */
    public define(registry: CustomElementRegistry = this.registry): this {
        const type = this.type;

        if (!registry.get(this.name)) {
            this.platformDefined = true;
            registry.define(this.name, type as any, this.elementOptions);
        }

        return this;
    }

    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrDef - The name of the element to define or a config object
     * that describes the element to define.
     */
    public static compose<
        TType extends Constructable<HTMLElement> = Constructable<HTMLElement>
    >(
        type: TType,
        nameOrDef?: string | PartialFASTElementDefinition
    ): FASTElementDefinition<TType> {
        if (fastElementBaseTypes.has(type) || fastElementRegistry.getByType(type)) {
            return new FASTElementDefinition<TType>(class extends type {}, nameOrDef);
        }

        return new FASTElementDefinition<TType>(type, nameOrDef);
    }

    /**
     * Registers a FASTElement base type.
     * @param type - The type to register as a base type.
     * @internal
     */
    public static registerBaseType(type: Function) {
        fastElementBaseTypes.add(type);
    }

    /**
     * Gets the element definition associated with the specified type.
     * @param type - The custom element type to retrieve the definition for.
     */
    static readonly getByType = fastElementRegistry.getByType;

    /**
     * Gets the element definition associated with the instance.
     * @param instance - The custom element instance to retrieve the definition for.
     */
    static readonly getForInstance = fastElementRegistry.getForInstance;
}
