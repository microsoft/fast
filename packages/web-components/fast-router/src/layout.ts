import {
    ComposableStyles,
    ElementStyles,
    html,
    ViewTemplate,
} from "@microsoft/fast-element";
import { isFASTElementHost } from "./router";

export interface Layout {
    beforeTransition(routerElement: HTMLElement): Promise<void>;
    afterTransition(routerElement: HTMLElement): Promise<void>;
}

export class FASTElementLayout implements Layout {
    public styles: ElementStyles | null;

    constructor(
        public readonly template: ViewTemplate | null = null,
        styles: ComposableStyles | ComposableStyles[] | null = null
    ) {
        this.styles =
            styles === void 0 || styles === null
                ? null
                : Array.isArray(styles)
                ? ElementStyles.create(styles)
                : styles instanceof ElementStyles
                ? styles
                : ElementStyles.create([styles]);
    }

    async beforeTransition(routerElement: HTMLElement) {
        if (isFASTElementHost(routerElement)) {
            if (routerElement.$fastController.template !== this.template) {
                routerElement.$fastController.template = this.template!;
            }

            if (routerElement.$fastController.styles !== this.styles) {
                routerElement.$fastController.styles = this.styles!;
            }
        }
    }

    async afterTransition(routerElement: HTMLElement) {}
}

export const Layout = Object.freeze({
    default: new FASTElementLayout(
        html`
            <slot></slot>
        `
    ),
});
