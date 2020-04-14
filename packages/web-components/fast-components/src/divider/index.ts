import { customElement } from "@microsoft/fast-element";
import { designSystemConsumer } from "../design-system-consumer";
import { neutralDividerRest } from "../styles/recipes";
import { Divider } from "./divider";
import { DividerTemplate as template } from "./divider.template";
import { DividerStyles as styles } from "./divider.styles";

@customElement({
    name: "fast-divider",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [neutralDividerRest],
})
export class FASTDivider extends Divider {}
export * from "./divider.template";
export * from "./divider.styles";
export * from "./divider";
