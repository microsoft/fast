import { ElementViewTemplate } from "./template";
import { ElementStyles, css, ComposableStyles } from "./styles";
import { AttributeConfiguration, AttributeDefinition } from "./attributes";

/**
 * Defines metadata for a FASTElement.
 * @public
 */
export class FASTElementDefinition {
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
     * The styles to associated with the custom element.
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
     * @param name - The name of the custom element.
     * @param attributes - The custom attributes of the custom element.
     * @param propertyLookup - A map enabling lookup of attribute by associated property name.
     * @param attributeLookup - A map enabling lookup of property by associated attribute name.
     * @param template - The template to render for the custom element.
     * @param styles - The styles to associated with the custom element.
     * @param shadowOptions - Options controlling the creation of the custom element's shadow DOM.
     * @param elementOptions - Options controlling how the custom element is defined with the platform.
     */
    public constructor(
        name: string,
        attributes: ReadonlyArray<AttributeDefinition>,
        propertyLookup: Record<string, AttributeDefinition>,
        attributeLookup: Record<string, AttributeDefinition>,
        template?: ElementViewTemplate,
        styles?: ComposableStyles,
        shadowOptions?: ShadowRootInit,
        elementOptions?: ElementDefinitionOptions
    ) {
        this.name = name;
        this.attributes = attributes;
        this.propertyLookup = propertyLookup;
        this.attributeLookup = attributeLookup;
        this.template = template;
        this.shadowOptions = shadowOptions;
        this.elementOptions = elementOptions;
        this.styles =
            styles !== void 0 && !(styles instanceof ElementStyles)
                ? css`
                      ${styles}
                  `
                : styles;
    }
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
     * The styles to associated with the custom element.
     */
    readonly styles?: ComposableStyles;

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

/** @internal */
export const fastDefinitions = new Map<Function, FASTElementDefinition>();
