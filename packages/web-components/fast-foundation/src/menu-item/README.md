# usage
```ts
import { customElement } from "@microsoft/fast-element";
import { MenuItem, MenuItemTemplate as template } from "@microsoft/fast-foundation";
import { MenuItemStyles as styles } from "./menu-item.styles";

@customElement({
    name: "fast-menu-item",
    template,
    styles,
})
export class FASTMenuItem extends MenuItem {}
```