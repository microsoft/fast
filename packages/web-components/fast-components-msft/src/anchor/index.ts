import { customElement } from "@microsoft/fast-element";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-components";
import { AnchorStyles as styles } from "./anchor.styles";

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
