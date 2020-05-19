---
id: fast-switch
title: fast-switch
sidebar_label: fast-switch
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/switch/README.md
---

## Applying Custom Styles

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