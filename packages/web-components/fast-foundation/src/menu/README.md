---
id: menu
title: fast-menu
sidebar_label: menu
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/menu/README.md
---

As defined by the W3C:

> A menu is a widget that offers a list of choices to the user, such as a set of actions or functions. Menu widgets behave like native operating system menus, such as the menus that pull down from the menubars commonly found at the top of many desktop application windows. A menu is usually opened, or made visible, by activating a menu button, choosing an item in a menu that opens a sub menu, or by invoking a command, such as Shift + F10 in Windows, that opens a context specific menu. When a user activates a choice in a menu, the menu usually closes unless the choice opened a submenu.

While any DOM content is permissible as a child of the menu, only `fast-menu-item`'s and slotted content with a role of `menuitem`, `menuitemcheckbox`, or `menuitemradio` will receive keyboard support.

`fast-menu` applies `fast-menu-item`'s `startColumnCount` property based on an evaluation of all of the `fast-menu-items` so the content text vertically aligns across all `fast-menu-items`. If any `fast-menu-item` does not have a roll of `checkbox` or `radio` or the `start` slot is not passed, `startColumnCount` is set to 0 which applies a `indent-0` class to all the `fast-menu-item`s. If any `fast-menu-item` has a roll of `checkbox` or `radio` or the `start` slot exists, `startColumnCount` is set to 1 which applies a `indent-1` class to all the `fast-menu-item`s. Or if any `fast-menu-item` has a roll of `checkbox` or `radio` and the `start` slot exists, `startColumnCount` is set to 2 which applies a `indent-2` class to all the `fast-menu-item`s.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastMenu,
    fastMenuItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastMenu(),
        fastMenuItem()
    );
```

### Customizing Indicators and Glyphs

```ts
import {
    provideFASTDesignSystem,
    fastMenu,
    fastMenuItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastMenu(),
        fastMenuItem({
            expandCollapseGlyph: `...your expand/collapse glyph...`,
            checkboxIndicator: `...your checkbox indicator...`,
            radioIndicator: `...your radio indicator...`,
        })
    );
```

## Usage

### Basic Usage

```html live
<fast-menu>
    <fast-menu-item>Menu item 1</fast-menu-item>
    <fast-menu-item>Menu item 2</fast-menu-item>
    <fast-menu-item>Menu item 3</fast-menu-item>
    <fast-divider></fast-divider>
    <fast-menu-item role="menuitemradio">Menu item 4</fast-menu-item>
    <fast-menu-item role="menuitemradio">Menu item 5</fast-menu-item>
</fast-menu>
```

### Nested Menus

```html live
<fast-menu>
    <fast-menu-item>
        Menu item 1
        <fast-menu>
            <fast-menu-item>Menu item 1.1</fast-menu-item>
            <fast-menu-item>Menu item 1.2</fast-menu-item>
            <fast-menu-item>Menu item 1.3</fast-menu-item>
        </fast-menu>
    </fast-menu-item>
    <fast-menu-item>
        Menu item 2
        <fast-menu>
            <fast-menu-item>Menu item 2.1</fast-menu-item>
            <fast-menu-item>Menu item 2.2</fast-menu-item>
            <fast-menu-item>Menu item 2.3</fast-menu-item>
        </fast-menu>
    </fast-menu-item>
    <fast-menu-item>
        Menu item 3
        <fast-menu>
            <fast-menu-item>Menu item 3.1</fast-menu-item>
            <fast-menu-item>Menu item 3.2</fast-menu-item>
            <fast-menu-item>Menu item 3.3</fast-menu-item>
        </fast-menu>
    </fast-menu-item>
</fast-menu>
```

## Create your own design

### Menu

```ts
import { Menu, menuTemplate as template } from "@microsoft/fast-foundation";
import { menuStyles as styles } from "./my-menu.styles";

export const myMenu = Menu.compose({
    baseName: "menu",
    template,
    styles,
});
```

### MenuItem

```ts
import {
    MenuItem,
    MenuItemOptions,
    menuItemTemplate as template,
} from "@microsoft/fast-foundation";
import { menuItemStyles as styles } from "./my-menu-item.styles";

export const myMenuItem = MenuItem.compose<MenuItemOptions>({
    baseName: "menu-item",
    template,
    styles,
    expandCollapseGlyph: `...default expand/collapse glyph...`,
    checkboxIndicator: `...default checkbox indicator...`,
    radioIndicator: `...default radio indicator...`,
});
```

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-menu)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/menu/menu.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#menu)