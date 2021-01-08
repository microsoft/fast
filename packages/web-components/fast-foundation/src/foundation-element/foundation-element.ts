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
    DefineElement,
    ElementPrefix,
} from "../design-system";
import { Container, Registration, Registry } from "../di";

/**
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
 * @alpha
 */
export type OverrideFoundationElementDefinition = Partial<
    Omit<FoundationElementDefinition, "type">
> & { prefix?: string };

/**
 * Defines a foundation element class that:
 * 1. Connects the element to Configuration
 * 2. Allows resolving the element template from the instance or Configuration
 * 3. Allows resolving the element styles from the instance or Configuration
 *
 * @alpha
 */
export class FoundationElement extends FASTElement {
    @Container
    private container: Container;
    private _presentation: ComponentPresentation | null = null;

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

    connectedCallback() {
        this.$presentation.applyTo(this);
        super.connectedCallback();
    }

    public static configuration(
        elementDefinition: FoundationElementDefinition
    ): (overrideDefinition?: OverrideFoundationElementDefinition) => Registry {
        return (
            overrideDefinition: OverrideFoundationElementDefinition = {}
        ): Registry => {
            const definition = {
                ...elementDefinition,
                ...overrideDefinition,
            };

            return {
                register(container: Container) {
                    const prefix = definition.prefix || container.get(ElementPrefix);
                    const defineElement = container.get(DefineElement);
                    const name = `${prefix}-${definition.baseName}`;
                    const presentation = new DefaultComponentPresentation(
                        definition.template,
                        definition.styles
                    );

                    container.register(
                        Registration.instance(
                            ComponentPresentation.keyFrom(name),
                            presentation
                        )
                    );

                    defineElement(elementDefinition.type, {
                        name,
                        elementOptions: definition.elementOptions,
                        shadowOptions: definition.shadowOptions,
                        attributes: definition.attributes,
                    });
                },
            };
        };
    }
}
