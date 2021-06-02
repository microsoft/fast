import {
    ComposableStyles,
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
} from "@microsoft/fast-element";
import { Container, DI, InterfaceSymbol, Registration } from "../di/di";

const presentationKeys = new Map<string, InterfaceSymbol<ComponentPresentation>>();

/**
 * @alpha
 * Applies presentation details, such as template and styles, to a component instance.
 */
export interface ComponentPresentation {
    applyTo(element: FASTElement): void;
}

function presentationKeyFromTag(tagName: string): string {
    return `${tagName.toLowerCase()}:presentation`;
}

const presentationRegistry = new Map<string, ComponentPresentation | false>();

/**
 * @alpha
 * A gateway for utilities associated with component presentation.
 */
export const ComponentPresentation = Object.freeze({
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
 * @alpha
 * The default implementation of ComponentPresentation, used by FoundationElement.
 */
export class DefaultComponentPresentation implements ComponentPresentation {
    public readonly styles: ElementStyles | null;
    public readonly template: ElementViewTemplate | null;

    constructor(
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
