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
import { Container, Registration, Registry } from "../di";

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
    @Container
    private container: Container;
    private _presentation: ComponentPresentation | null = null;

    /**
     * A property which resolves the ComponentPresentation instance
     * for the current component.
     */
    protected get $presentation(): ComponentPresentation {
        if (this._presentation === null) {
            this._presentation = this.container.get(
                ComponentPresentation.keyFrom(this.tagName)
            );
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
        T extends FoundationElementDefinition = FoundationElementDefinition
    >(
        elementDefinition: T
    ): (overrideDefinition?: OverrideFoundationElementDefinition<T>) => Registry {
        return (
            overrideDefinition: OverrideFoundationElementDefinition<T> = {}
        ): Registry =>
            new FoundationElementRegistry(
                this === FoundationElement ? class extends FoundationElement {} : this,
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

class FoundationElementRegistry<T extends FoundationElementDefinition> {
    constructor(
        private type: Constructable<FoundationElement>,
        private elementDefinition: T,
        private overrideDefinition: OverrideFoundationElementDefinition<T>
    ) {}

    public register(container: Container) {
        const definition = {
            ...this.elementDefinition,
            ...this.overrideDefinition,
        } as OverrideFoundationElementDefinition<T>;

        const context = container.get(DesignSystemRegistrationContext);
        const prefix = definition.prefix || context.elementPrefix;
        const name = `${prefix}-${definition.baseName}`;

        context.tryDefineElement(name, this.type, x => {
            const presentation = new DefaultComponentPresentation(
                resolveOption(definition.template, x, definition),
                resolveOption(definition.styles, x, definition)
            );

            x.container.register(
                Registration.instance(ComponentPresentation.keyFrom(x.name), presentation)
            );

            x.defineElement({
                elementOptions: resolveOption(definition.elementOptions, x, definition),
                shadowOptions: resolveOption(definition.shadowOptions, x, definition),
                attributes: resolveOption(definition.attributes, x, definition),
            });
        });
    }
}
