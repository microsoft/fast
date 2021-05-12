---
id: menu
title: fast-menu
sidebar_label: menu
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/menu/README.md
---

The menu is a widget that offers a list of choices to the user, such as a set of actions or functions. While any DOM content is permissible as a child of the menu, only `fast-menu-item`'s and slotted content with a role of `menuitem`, `menuitemcheckbox`, or `menuitemradio` will receive keyboard support.

`fast-menu` applies `fast-menu-item`'s `startColumnCount` property based on an evaluation of all of the `fast-menu-items` so the content text vertically aligns across all `fast-menu-items`. If any `fast-menu-item` does not have a roll of `checkbox` or `radio` or the `start` slot is not passed, `startColumnCount` is set to 0 which applies a `indent-0` class to all the `fast-menu-item`s. If any `fast-menu-item` has a roll of `checkbox` or `radio` or the `start` slot exists, `startColumnCount` is set to 1 which applies a `indent-1` class to all the `fast-menu-item`s. Or if any `fast-menu-item` has a roll of `checkbox` or `radio` and the `start` slot exists, `startColumnCount` is set to 2 which applies a `indent-2` class to all the `fast-menu-item`s.

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