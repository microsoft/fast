import {
    ComposableStyles,
    ElementStyles,
    html,
    ViewTemplate,
} from "@microsoft/fast-element";

export type LayoutDefinition = {
    template?: ViewTemplate | null;
    styles?: ComposableStyles | ComposableStyles[] | null;
};

export type Layout = {
    template: ViewTemplate | null;
    styles: ElementStyles | null;
};

export const Layout = Object.freeze({
    default: {
        template: html`
            <slot></slot>
        `,
        styles: null,
    } as Layout,
});
