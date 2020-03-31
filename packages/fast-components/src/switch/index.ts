import { customElement } from "@microsoft/fast-element";
import { Switch } from "./switch";
import { SwitchTemplate as template } from "./switch.template";
import { SwitchStyles as styles } from "./switch.styles";
import { designSystemConsumer } from "../design-system-provider/design-system-consumer";
import {
    accentfillrest,
    accentforegroundcutrest,
    neutralfillinputactive,
    neutralfillinputhover,
    neutralfillinputrest,
    neutralforegroundrest,
    neutraloutlineactive,
    neutraloutlinehover,
    neutraloutlinerest,
} from "../styles/recipes";

@customElement({
    name: "fast-switch",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [
        neutralfillinputrest,
        neutraloutlinerest,
        neutralfillinputhover,
        neutraloutlinehover,
        neutralfillinputactive,
        neutraloutlineactive,
        neutralforegroundrest,
        accentforegroundcutrest,
        accentfillrest,
    ],
})
export class FASTSwitch extends Switch {}
export * from "./switch.template";
export * from "./switch.styles";
export * from "./switch";
