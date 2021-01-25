import {
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
    observable,
    PartialFASTElementDefinition,
} from "@microsoft/fast-element";
import {
    ComponentPresentation,
    DefaultComponentPresentation,
    DesignSystemConfigurationContext,
} from "../design-system";
import { Container, Registration, Registry } from "../di";

/**
 * An element definition used to define a FoundationElement when registered through the design
 * system registry.
 * @alpha
 */
export type FoundationElementDefinition = Omit<PartialFASTElementDefinition, "name"> & {
    /**
     * The non-prefixed name of the component.
     */
    baseName: string;

    /**
     * The element constructor
     */
    type: typeof FASTElement;
};

/**
 * A set of properties which the component consumer can override during the element registration process.
 * @alpha
 */
export type OverrideFoundationElementDefinition = Partial<
    Omit<FoundationElementDefinition, "type">
> & { prefix?: string };

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
     * Creates an element registry configuration function with a set of element definition defaults.
     * @param elementDefinition The definition of the element to create the registry configuration
     * function for.
     */
    public static configuration(
        elementDefinition: FoundationElementDefinition
    ): (overrideDefinition?: OverrideFoundationElementDefinition) => Registry {
        return (overrideDefinition: OverrideFoundationElementDefinition = {}): Registry =>
            new FoundationElementRegistry(elementDefinition, overrideDefinition);
    }
}

class FoundationElementRegistry {
    constructor(
        private elementDefinition: FoundationElementDefinition,
        private overrideDefinition: OverrideFoundationElementDefinition
    ) {}

    public register(container: Container) {
        const definition = {
            ...this.elementDefinition,
            ...this.overrideDefinition,
        };

        const context = container.get(DesignSystemConfigurationContext);
        const prefix = definition.prefix || context.elementPrefix;
        const name = `${prefix}-${definition.baseName}`;
        const presentation = new DefaultComponentPresentation(
            definition.template,
            definition.styles
        );

        container.register(
            Registration.instance(ComponentPresentation.keyFrom(name), presentation)
        );

        context.defineElement(this.elementDefinition.type, {
            name,
            elementOptions: definition.elementOptions,
            shadowOptions: definition.shadowOptions,
            attributes: definition.attributes,
        });
    }
}
