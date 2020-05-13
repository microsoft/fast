import { customElement } from "@microsoft/fast-element";
import { AnchorStyles as styles } from "./anchor.styles";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-foundation";

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
