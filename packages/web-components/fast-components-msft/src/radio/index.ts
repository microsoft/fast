import { customElement } from "@microsoft/fast-element";
import { Radio, RadioTemplate as template } from "@microsoft/fast-components";
import { RadioStyles as styles } from "./radio.styles";

@customElement({
    name: "fast-radio",
    template,
    styles,
})
export class FASTRadio extends Radio {}
