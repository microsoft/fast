import {
    ComposableStyles,
    ElementStyles,
    ElementViewTemplate,
    FASTElement,
} from "@microsoft/fast-element";
import { DI, InterfaceSymbol } from "../di/di";

const presentationKeys = new Map<string, InterfaceSymbol<ComponentPresentation>>();

export interface ComponentPresentation {
    applyTo(element: FASTElement): void;
}

export const ComponentPresentation = Object.freeze({
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
