# Usage
```ts
import { customElement } from "@microsoft/fast-element";
import { MyAnchorStyles as styles } from "./anchor.styles";
import { Anchor, AnchorTemplate as template } from "@microsoft/fast-foundation";

@customElement({
    name: "fast-anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTAnchor extends Anchor {}
```