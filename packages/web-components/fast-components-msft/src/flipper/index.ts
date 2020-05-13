import { customElement } from "@microsoft/fast-element";
import { Flipper, FlipperTemplate as template } from "@microsoft/fast-components";
import { FlipperStyles as styles } from "./flipper.styles";

@customElement({
    name: "fast-flipper",
    template,
    styles,
})
export class FASTFlipper extends Flipper {}
