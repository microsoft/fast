---
id: menu-item
title: fast-menu-item
sidebar_label: menu-item
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/menu-item/README.md
---

The `fast-menu-item` is a custom element meant to be used with `fast-menu` and supports roles of `menuitem`, `menuitemcheckbox`, and `menuitemradio`.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-menu-item role="menuitemcheckbox" checked>Open in new window</fast-menu-item>
</fast-design-system-provider>
```

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