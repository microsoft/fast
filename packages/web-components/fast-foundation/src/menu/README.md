---
id: menu
title: fast-menu
sidebar_label: menu
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/menu/README.md
---

The menu is a widget that offers a list of choices to the user, such as a set of actions or functions. While any DOM content is permissible as a child of the menu, only `fast-menu-item`'s and slotted content with a role of `menuitem`, `menuitemcheckbox`, or `menuitemradio` will receive keyboard support.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-menu>
        <fast-menu-item>Menu item 1</fast-menu-item>
        <fast-menu-item>Menu item 2</fast-menu-item>
        <fast-menu-item>Menu item 3</fast-menu-item>
        <fast-divider></fast-divider>
        <fast-menu-item role="menuitemradio">Menu item 4</fast-menu-item>
        <fast-menu-item role="menuitemradio">Menu item 5</fast-menu-item>
    </fast-menu>
</fast-design-system-provider>
```

## Applying custom styles

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