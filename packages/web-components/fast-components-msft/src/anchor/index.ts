import { customElement } from "@microsoft/fast-element";
import { AnchorStyles as styles } from "./anchor.styles";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-components";

// Anchor
@customElement({
    name: "msft-anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class MSFTAnchor extends Anchor {}
