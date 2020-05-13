# Usage
```ts
import { customElement } from "@microsoft/fast-element";
import { Menu, MenuTemplate as template } from "@microsoft/fast-foundation";
import { MenuStyles as styles } from "./menu.styles";

@customElement({
    name: "fast-menu",
    template,
    styles,
})
export class FASTMenu extends Menu {}
```