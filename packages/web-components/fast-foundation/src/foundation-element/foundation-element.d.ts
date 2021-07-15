import { ElementStyles, FASTElement } from "@microsoft/fast-element";
import type {
    AttributeConfiguration,
    ComposableStyles,
    Constructable,
    ElementViewTemplate,
} from "@microsoft/fast-element";
import { ComponentPresentation, ElementDefinitionContext } from "../design-system";
import type { Container, Registry } from "../di";
declare type LazyFoundationOption<T, K extends FoundationElementDefinition> = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<K>
) => T;
declare type EagerOrLazyFoundationOption<T, K extends FoundationElementDefinition> =
    | T
    | LazyFoundationOption<T, K>;
/**
 * An element definition used to define a FoundationElement when registered through the design
 * system registry.
 * @public
 */
export interface FoundationElementDefinition {
    /**
     * The non-prefixed name of the component.
     */
    baseName: string;
    /**
     * The template to render for the custom element.
     */
    readonly template?: EagerOrLazyFoundationOption<ElementViewTemplate, this>;
    /**
     * The styles to associate with the custom element.
     */
    readonly styles?: EagerOrLazyFoundationOption<
        ComposableStyles | ComposableStyles[],
        this
    >;
    /**
     * The custom attributes of the custom element.
     */
    readonly attributes?: EagerOrLazyFoundationOption<
        (AttributeConfiguration | string)[],
        this
    >;
    /**
     * Options controlling the creation of the custom element's shadow DOM.
     */
    readonly shadowOptions?: EagerOrLazyFoundationOption<
        Partial<ShadowRootInit> | null,
        this
    >;
    /**
     * Options controlling how the custom element is defined with the platform.
     */
    readonly elementOptions?: EagerOrLazyFoundationOption<ElementDefinitionOptions, this>;
}
/**
 * A set of properties which the component consumer can override during the element registration process.
 * @public
 */
export declare type OverrideFoundationElementDefinition<
    T extends FoundationElementDefinition
> = Partial<Omit<T, "type">> & {
    /**
     * An element prefix that overrides the design system configuration.
     * @public
     */
    prefix?: string;
};
/**
 * Defines a foundation element class that:
 * 1. Connects the element to its ComponentPresentation
 * 2. Allows resolving the element template from the instance or ComponentPresentation
 * 3. Allows resolving the element styles from the instance or ComponentPresentation
 *
 * @public
 */
export declare class FoundationElement extends FASTElement {
    private _presentation;
    /**
     * A property which resolves the ComponentPresentation instance
     * for the current component.
     * @public
     */
    protected get $presentation(): ComponentPresentation | null;
    /**
     * Sets the template of the element instance. When undefined,
     * the element will attempt to resolve the template from
     * the associated presentation or custom element definition.
     * @public
     */
    template: ElementViewTemplate | void | null;
    protected templateChanged(): void;
    /**
     * Sets the default styles for the element instance. When undefined,
     * the element will attempt to resolve default styles from
     * the associated presentation or custom element definition.
     * @public
     */
    styles: ElementStyles | void | null;
    protected stylesChanged(): void;
    /**
     * The connected callback for this FASTElement.
     * @remarks
     * This method is invoked by the platform whenever this FoundationElement
     * becomes connected to the document.
     * @public
     */
    connectedCallback(): void;
    /**
     * Defines an element registry function with a set of element definition defaults.
     * @param elementDefinition - The definition of the element to create the registry
     * function for.
     * @public
     */
    static compose<
        T extends FoundationElementDefinition = FoundationElementDefinition,
        K extends Constructable<FoundationElement> = Constructable<FoundationElement>
    >(
        this: K,
        elementDefinition: T
    ): (
        overrideDefinition?: OverrideFoundationElementDefinition<T>
    ) => FoundationElementRegistry<T, K>;
}
/**
 * Registry capable of defining presentation properties for a DOM Container hierarchy.
 *
 * @internal
 */
export declare class FoundationElementRegistry<
    TDefinition extends FoundationElementDefinition,
    TType
> implements Registry {
    readonly type: Constructable<FoundationElement>;
    private elementDefinition;
    private overrideDefinition;
    readonly definition: OverrideFoundationElementDefinition<TDefinition>;
    constructor(
        type: Constructable<FoundationElement>,
        elementDefinition: TDefinition,
        overrideDefinition: OverrideFoundationElementDefinition<TDefinition>
    );
    register(container: Container): void;
}
export {};
