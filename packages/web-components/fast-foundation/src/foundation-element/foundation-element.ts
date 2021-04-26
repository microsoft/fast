import { ElementStyles, FASTElement, observable } from "@microsoft/fast-element";
import type {
    AttributeConfiguration,
    ComposableStyles,
    Constructable,
    ElementViewTemplate,
} from "@microsoft/fast-element";
import {
    ComponentPresentation,
    DefaultComponentPresentation,
    DesignSystemRegistrationContext,
    ElementDefinitionContext,
} from "../design-system";
import type { Container, Registry } from "../di";

type LazyFoundationOption<T, K extends FoundationElementDefinition> = (
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<K>
) => T;

type EagerOrLazyFoundationOption<T, K extends FoundationElementDefinition> =
    | T
    | LazyFoundationOption<T, K>;

/**
 * An element definition used to define a FoundationElement when registered through the design
 * system registry.
 * @alpha
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
 * @alpha
 */
export type OverrideFoundationElementDefinition<
    T extends FoundationElementDefinition
> = Partial<Omit<T, "type">> & { prefix?: string };

/**
 * Defines a foundation element class that:
 * 1. Connects the element to its ComponentPresentation
 * 2. Allows resolving the element template from the instance or ComponentPresentation
 * 3. Allows resolving the element styles from the instance or ComponentPresentation
 *
 * @alpha
 */
export class FoundationElement extends FASTElement {
    private _presentation: ComponentPresentation | null = null;

    /**
     * A property which resolves the ComponentPresentation instance
     * for the current component.
     */
    protected get $presentation(): ComponentPresentation {
        if (this._presentation === null) {
            this._presentation = ComponentPresentation.forTag(this.tagName, this);
        }

        return this._presentation;
    }

    /**
     * Sets the template of the element instance. When undefined,
     * the element will attempt to resolve the template from
     * the $fastProvider
     */
    @observable
    public template: ElementViewTemplate | void | null;
    protected templateChanged(): void {
        if (this.template !== undefined) {
            this.$fastController.template = this.template;
        }
    }

    /**
     * Sets the default styles for the element instance. When undefined,
     * the element will attempt to resolve default styles from
     * the $fastProvider
     */
    @observable
    public styles: ElementStyles | void | null;
    protected stylesChanged(): void {
        if (this.styles !== undefined) {
            this.$fastController.styles = this.styles;
        }
    }

    /**
     * The connected callback for this FASTElement.
     * @remarks
     * This method is invoked by the platform whenever this FoundationElement
     * becomes connected to the document.
     */
    connectedCallback() {
        this.$presentation.applyTo(this);
        super.connectedCallback();
    }

    /**
     * Defines an element registry function with a set of element definition defaults.
     * @param elementDefinition - The definition of the element to create the registry
     * function for.
     */
    public static compose<
        T extends FoundationElementDefinition = FoundationElementDefinition,
        K extends Constructable<FoundationElement> = Constructable<FoundationElement>
    >(
        this: K,
        elementDefinition: T
    ): (
        overrideDefinition?: OverrideFoundationElementDefinition<T>
    ) => FoundationElementRegistry<T, K> {
        return (overrideDefinition: OverrideFoundationElementDefinition<T> = {}) =>
            new FoundationElementRegistry<T, K>(
                (this as any) === FoundationElement
                    ? class extends FoundationElement {}
                    : this,
                elementDefinition,
                overrideDefinition
            );
    }
}

function resolveOption<T, K extends FoundationElementDefinition>(
    option: EagerOrLazyFoundationOption<T, K>,
    context: ElementDefinitionContext,
    definition: OverrideFoundationElementDefinition<K>
): T {
    if (typeof option === "function") {
        return (option as LazyFoundationOption<T, K>)(context, definition);
    }

    return option;
}

/**
 * Registry capable of defining presentation properties for a DOM Container hierarchy.
 *
 * @alpha
 */
export class FoundationElementRegistry<
    TDefinition extends FoundationElementDefinition,
    TType
> implements Registry {
    public readonly definition: OverrideFoundationElementDefinition<TDefinition>;

    constructor(
        public readonly type: Constructable<FoundationElement>,
        private elementDefinition: TDefinition,
        private overrideDefinition: OverrideFoundationElementDefinition<TDefinition>
    ) {
        this.definition = {
            ...this.elementDefinition,
            ...this.overrideDefinition,
        } as OverrideFoundationElementDefinition<TDefinition>;
    }

    public register(container: Container) {
        const definition = this.definition;
        const context = container.get(DesignSystemRegistrationContext);
        const prefix = definition.prefix || context.elementPrefix;
        const name = `${prefix}-${definition.baseName}`;

        context.tryDefineElement(name, this.type, x => {
            const presentation = new DefaultComponentPresentation(
                resolveOption(definition.template, x, definition),
                resolveOption(definition.styles, x, definition)
            );

            x.definePresentation(presentation);

            x.defineElement({
                elementOptions: resolveOption(definition.elementOptions, x, definition),
                shadowOptions: resolveOption(definition.shadowOptions, x, definition),
                attributes: resolveOption(definition.attributes, x, definition),
            });
        });
    }
}
