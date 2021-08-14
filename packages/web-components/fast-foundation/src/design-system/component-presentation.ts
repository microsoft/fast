import {
    ComposableStyles,
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
} from "@microsoft/fast-element";
import { Container, DI, Registration } from "../di/di";

/**
 * Applies presentation details, such as template and styles, to a component instance.
 * @public
 */
export interface ComponentPresentation {
    /**
     * Applies the presentation details to the specified element.
     * @param element - The element to apply the presentation details to.
     * @public
     */
    applyTo(element: FASTElement): void;
}

function presentationKeyFromTag(tagName: string): string {
    return `${tagName.toLowerCase()}:presentation`;
}

const presentationRegistry = new Map<string, ComponentPresentation | false>();

/**
 * An API gateway to component presentation features.
 * @public
 */
export const ComponentPresentation = Object.freeze({
    /**
     * Defines a component presentation for an element.
     * @param tagName - The element name to define the presentation for.
     * @param presentation - The presentation that will be applied to matching elements.
     * @param container - The dependency injection container to register the configuration in.
     * @public
     */
    define(
        tagName: string,
        presentation: ComponentPresentation,
        container: Container
    ): void {
        const key = presentationKeyFromTag(tagName);
        const existing = presentationRegistry.get(key);

        if (existing === void 0) {
            presentationRegistry.set(key, presentation);
        } else {
            // false indicates that we have more than one presentation
            // registered for a tagName and we must resolve through DI
            presentationRegistry.set(key, false);
        }

        container.register(Registration.instance(key, presentation));
    },

    /**
     * Finds a component presentation for the specified element name,
     * searching the DOM hierarchy starting from the provided element.
     * @param tagName - The name of the element to locate the presentation for.
     * @param element - The element to begin the search from.
     * @returns The component presentation or null if none is found.
     * @public
     */
    forTag(tagName: string, element: HTMLElement): ComponentPresentation | null {
        const key = presentationKeyFromTag(tagName);
        const existing = presentationRegistry.get(key);

        if (existing === false) {
            const container = DI.findResponsibleContainer(element);
            return container.get<ComponentPresentation>(key);
        }

        return existing || null;
    },
});

/**
 * The default implementation of ComponentPresentation, used by FoundationElement.
 * @public
 */
export class DefaultComponentPresentation implements ComponentPresentation {
    /**
     * The styles to apply to the element.
     * @public
     */
    public readonly styles: ElementStyles | null;

    /**
     * The template to apply to the element.
     * @public
     */
    public readonly template: ElementViewTemplate | null;

    /**
     * Creates an instance of DefaultComponentPresentation.
     * @param template - The template to apply to the element.
     * @param styles - The styles to apply to the element.
     * @public
     */
    public constructor(
        template?: ElementViewTemplate,
        styles?: ComposableStyles | ComposableStyles[]
    ) {
        this.template = template || null;
        this.styles =
            styles === void 0
                ? null
                : Array.isArray(styles)
                ? ElementStyles.create(styles)
                : styles instanceof ElementStyles
                ? styles
                : ElementStyles.create([styles]);
    }

    /**
     * Applies the presentation details to the specified element.
     * @param element - The element to apply the presentation details to.
     * @public
     */
    applyTo(element: FASTElement) {
        const controller = element.$fastController;

        if (controller.template === null) {
            controller.template = this.template;
        }

        if (controller.styles === null) {
            controller.styles = this.styles;
        }
    }
}
