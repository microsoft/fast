# usage
```ts
import { customElement } from "@microsoft/fast-element";
import { Badge, BadgeTemplate as template } from "@microsoft/fast-foundation";
import { BadgeStyles as styles } from "./badge.styles";

@customElement({
    name: "fast-badge",
    template,
    styles,
})
export class FASTBadge extends Badge {}
```