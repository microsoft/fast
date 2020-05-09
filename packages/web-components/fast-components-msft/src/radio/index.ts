import { customElement } from "@microsoft/fast-element";
// update the below imports once #3091 is merged
import { Radio, RadioTemplate as template } from "@microsoft/fast-components/dist/radio";
import { RadioStyles as styles } from "./radio.styles";

@customElement({
    name: "msft-radio",
    template,
    styles,
})
export class MSFTRadio extends Radio {}
