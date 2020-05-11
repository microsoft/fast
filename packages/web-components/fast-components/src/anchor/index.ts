import { customElement } from "@microsoft/fast-element";
import { AnchorStyles as styles } from "./anchor.styles";
import { Anchor } from "./anchor";
import { AnchorTemplate as template } from "./anchor.template";

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
export * from "./anchor.template";
export * from "./anchor.styles";
export * from "./anchor";
