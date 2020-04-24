import { customElement } from "@microsoft/fast-element";
import { Radio } from "./radio";
import { RadioTemplate as template } from "./radio.template";
import { RadioStyles as styles } from "./radio.styles";

@customElement({
    name: "fast-radio",
    template,
    styles,
})
export class FASTRadio extends Radio {}
export * from "./radio.template";
export * from "./radio.styles";
export * from "./radio";
