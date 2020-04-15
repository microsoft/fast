import { customElement } from "@microsoft/fast-element";
import { Switch } from "./switch";
import { SwitchTemplate as template } from "./switch.template";
import { SwitchStyles as styles } from "./switch.styles";

@customElement({
    name: "fast-switch",
    template,
    styles,
})
export class FASTSwitch extends Switch {}
export * from "./switch.template";
export * from "./switch.styles";
export * from "./switch";
