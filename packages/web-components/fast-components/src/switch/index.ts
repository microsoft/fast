import { customElement } from "@microsoft/fast-element";
import { designSystemConsumer } from "../design-system-consumer";
import {
    accentFillRest,
    accentForegroundCutRest,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../styles/recipes";
import { Switch } from "./switch";
import { SwitchTemplate as template } from "./switch.template";
import { SwitchStyles as styles } from "./switch.styles";

@customElement({
    name: "fast-switch",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [
        neutralFillInputRest,
        neutralOutlineRest,
        neutralFillInputHover,
        neutralOutlineHover,
        neutralFillInputActive,
        neutralOutlineActive,
        neutralForegroundRest,
        accentForegroundCutRest,
        accentFillRest,
    ],
})
export class FASTSwitch extends Switch {}
export * from "./switch.template";
export * from "./switch.styles";
export * from "./switch";
