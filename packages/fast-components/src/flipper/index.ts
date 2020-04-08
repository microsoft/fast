import { customElement } from "@microsoft/fast-element";
import { Flipper } from "./flipper";
import { FlipperTemplate as template } from "./flipper.template";
import { FlipperStyles as styles } from "./flipper.styles";
import { designSystemConsumer } from "../design-system-consumer";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../styles/recipes";

@customElement({
    name: "fast-flipper",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [
        neutralFillStealthRest,
        neutralFillStealthHover,
        neutralFillStealthActive,
        neutralForegroundRest,
        neutralFocus,
        neutralOutlineActive,
        neutralOutlineHover,
        neutralOutlineRest,
    ],
})
export class FASTFlipper extends Flipper {}
export * from "./flipper.template";
export * from "./flipper.styles";
export * from "./flipper";
