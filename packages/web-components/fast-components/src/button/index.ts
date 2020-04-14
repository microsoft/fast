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
import { Button } from "./button";
import { ButtonTemplate as template } from "./button.template";
import { ButtonStyles as styles } from "./button.styles";

// Button
@customElement({
    name: "fast-button",
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
export class FASTButton extends Button {}
export * from "./button";
