import { customElement } from "@microsoft/fast-element";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-foundation";
import { AnchorStyles as styles } from "./anchor.styles.js";

// Anchor
@customElement({
    name: "fast-anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAnchor extends Anchor {}
