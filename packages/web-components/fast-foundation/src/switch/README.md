# Usage
```ts
import { customElement } from "@microsoft/fast-element";
import { Switch, SwitchTemplate as template } from "@microsoft/fast-foundation";
import { SwitchStyles as styles } from "./switch.styles";

@customElement({
    name: "fast-switch",
    template,
    styles,
})
export class FASTSwitch extends Switch {}
```