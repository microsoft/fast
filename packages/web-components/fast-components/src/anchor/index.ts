import { customElement } from "@microsoft/fast-element";
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
import { designSystemConsumer } from "../design-system-consumer";
import { AnchorStyles as styles } from "./anchor.styles";
import { Anchor } from "./anchor";
import { AnchorTemplate as template } from "./anchor.template";

// Anchor
@customElement({
    name: "fast-anchor",
    template,
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
export * from "./anchor.styles";
