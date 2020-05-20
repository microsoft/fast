---
id: fast-menu-item
title: fast-menu-item
sidebar_label: fast-menu-item
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/menu-item/README.md
---

## Applying Custom Styles

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