import { customElement } from "@microsoft/fast-element";
import { AnchorStyles as styles } from "./anchor.styles";
import { Anchor } from "@microsoft/fast-components";
// update the below once #3091 is merged
import { AnchorTemplate as template } from "@microsoft/fast-components/dist/anchor/anchor.template";

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
