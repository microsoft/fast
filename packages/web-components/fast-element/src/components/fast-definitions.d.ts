import { ComposableStyles, ElementStyles } from "../styles/element-styles";
import type { ElementViewTemplate } from "../templating/template";
import { AttributeConfiguration, AttributeDefinition } from "./attributes";
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
export declare class FASTElementDefinition<TType extends Function = Function> {
    private observedAttributes;
    /**
     * The type this element definition describes.
     */
    readonly type: TType;
    /**
     * Indicates if this element has been defined in at least one registry.
     */
    readonly isDefined: boolean;
    /**
     * The name of the custom element.
     */
    readonly name: string;
    /**
     * The custom attributes of the custom element.
     */
    readonly attributes: ReadonlyArray<AttributeDefinition>;
    /**
     * A map enabling lookup of attribute by associated property name.
     */
    readonly propertyLookup: Record<string, AttributeDefinition>;
    /**
     * A map enabling lookup of property by associated attribute name.
     */
    readonly attributeLookup: Record<string, AttributeDefinition>;
    /**
     * The template to render for the custom element.
     */
    readonly template?: ElementViewTemplate;
    /**
     * The styles to associate with the custom element.
     */
    readonly styles?: ElementStyles;
    /**
     * Options controlling the creation of the custom element's shadow DOM.
     */
    readonly shadowOptions?: ShadowRootInit;
    /**
     * Options controlling how the custom element is defined with the platform.
     */
    readonly elementOptions?: ElementDefinitionOptions;
    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrConfig - The name of the element to define or a config object
     * that describes the element to define.
     */
    constructor(type: TType, nameOrConfig?: PartialFASTElementDefinition | string);
    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     */
    define(registry?: CustomElementRegistry): this;
    /**
     * Gets the element definition associated with the specified type.
     * @param type - The custom element type to retrieve the definition for.
     */
    static forType<TType extends Function>(
        type: TType
    ): FASTElementDefinition | undefined;
}
