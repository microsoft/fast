import { customElement } from "@microsoft/fast-element";
import { Flipper, FlipperTemplate as template } from "@microsoft/fast-components";
import { FlipperStyles as styles } from "./flipper.styles.js";

@customElement({
    name: "msft-flipper",
    template,
    styles,
})
export class MSFTFlipper extends Flipper {}
