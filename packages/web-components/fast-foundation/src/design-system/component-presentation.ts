import {
    ComposableStyles,
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
} from "@microsoft/fast-element";
import { DI, InterfaceSymbol } from "../di/di";

const presentationKeys = new Map<string, InterfaceSymbol<ComponentPresentation>>();

/**
 * @alpha
 * Applies presentation details, such as template and styles, to a component instance.
 */
export interface ComponentPresentation {
    applyTo(element: FASTElement): void;
}

/**
 * @alpha
 * A gateway for utilities associated with component presentation.
 */
export const ComponentPresentation = Object.freeze({
    /**
     * @alpha
     * Creates element-specific DI keys for resolving component presentations.
     */
    keyFrom(tagName: string): InterfaceSymbol<ComponentPresentation> {
        const lookup = tagName.toLowerCase();
        let key = presentationKeys.get(lookup);

        if (key === void 0) {
            key = DI.createInterface<ComponentPresentation>(`${lookup}:presentation`);
            presentationKeys.set(lookup, key);
        }

        return key;
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
