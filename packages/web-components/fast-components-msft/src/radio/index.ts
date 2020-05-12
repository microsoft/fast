import { customElement } from "@microsoft/fast-element";
import { Radio, RadioTemplate as template } from "@microsoft/fast-components";
import { RadioStyles as styles } from "./radio.styles.js";

@customElement({
    name: "msft-radio",
    template,
    styles,
})
export class MSFTRadio extends Radio {}
