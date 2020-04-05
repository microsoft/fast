import { customElement } from "@microsoft/fast-element";
import { Button, buttonTemplate } from "./button";
import { Anchor, anchorTemplate } from "./anchor";
import { ButtonStyles as styles } from "./button.styles";
import { designSystemConsumer } from "../design-system-consumer";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundCutRest,
    accentForegroundHover,
    accentForegroundRest,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../styles/recipes";

// Button
@customElement({
    name: "fast-button",
    template: buttonTemplate,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
@designSystemConsumer({
    recipes: [
        accentFillActive,
        accentFillHover,
        accentFillRest,
        accentForegroundActive,
        accentForegroundCutRest,
        accentForegroundHover,
        accentForegroundRest,
        neutralFillActive,
        neutralFillFocus,
        neutralFillHover,
        neutralFillRest,
        neutralFillStealthActive,
        neutralFillStealthHover,
        neutralFillStealthRest,
        neutralFocus,
        neutralFocusInnerAccent,
        neutralForegroundRest,
        neutralOutlineActive,
        neutralOutlineHover,
        neutralOutlineRest,
    ],
})
export class FASTButton extends Button {}
export * from "./button";

// Anchor
@customElement({
    name: "fast-anchor",
    template: anchorTemplate,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
@designSystemConsumer({
    recipes: [
        accentFillActive,
        accentFillHover,
        accentFillRest,
        accentForegroundActive,
        accentForegroundCutRest,
        accentForegroundHover,
        accentForegroundRest,
        neutralFillActive,
        neutralFillFocus,
        neutralFillHover,
        neutralFillRest,
        neutralFillStealthActive,
        neutralFillStealthHover,
        neutralFillStealthRest,
        neutralFocus,
        neutralFocusInnerAccent,
        neutralForegroundRest,
        neutralOutlineActive,
        neutralOutlineHover,
        neutralOutlineRest,
    ],
})

/* tslint:disable-next-line:max-classes-per-file */
export class FASTAnchor extends Anchor {}
export * from "./anchor";

export * from "./button.styles";
