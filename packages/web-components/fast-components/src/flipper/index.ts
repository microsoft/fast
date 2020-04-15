import { customElement } from "@microsoft/fast-element";
import { Flipper } from "./flipper";
import { FlipperTemplate as template } from "./flipper.template";
import { FlipperStyles as styles } from "./flipper.styles";

@customElement({
    name: "fast-flipper",
    template,
    styles,
})
export class FASTFlipper extends Flipper {}
export * from "./flipper.template";
export * from "./flipper.styles";
export * from "./flipper";
