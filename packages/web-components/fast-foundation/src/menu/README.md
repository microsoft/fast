---
id: fast-menu
title: fast-menu
sidebar_label: fast-menu
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/menu/README.md
---

## Applying Custom Styles

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