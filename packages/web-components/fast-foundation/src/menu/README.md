---
id: menu
title: fast-menu
sidebar_label: menu
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/menu/README.md
description: fast-menu is a web component widget that offers a list of choices to the user, such as a set of actions or functions.
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

## API



### class: `FASTMenu`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Methods

| Name                   | Privacy   | Description                         | Parameters                                         | Return | Inherited From |
| ---------------------- | --------- | ----------------------------------- | -------------------------------------------------- | ------ | -------------- |
| `itemsChanged`         | protected |                                     | `oldValue: HTMLElement[], newValue: HTMLElement[]` | `void` |                |
| `focus`                | public    | Focuses the first item in the menu. |                                                    | `void` |                |
| `collapseExpandedItem` | public    | Collapses any expanded menu items.  |                                                    | `void` |                |

#### Slots

| Name | Description                         |
| ---- | ----------------------------------- |
|      | The default slot for the menu items |

<hr/>



### Variables

| Name           | Description       | Type                                                                                              |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| `MenuItemRole` | Menu items roles. | `{ menuitem: "menuitem", menuitemcheckbox: "menuitemcheckbox", menuitemradio: "menuitemradio", }` |

<hr/>



### class: `FASTMenuItem`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name       | Privacy | Type           | Default | Description                        | Inherited From |
| ---------- | ------- | -------------- | ------- | ---------------------------------- | -------------- |
| `disabled` | public  | `boolean`      |         | The disabled state of the element. |                |
| `expanded` | public  | `boolean`      |         | The expanded state of the element. |                |
| `role`     | public  | `MenuItemRole` |         | The role of the element.           |                |
| `checked`  | public  | `boolean`      |         | The checked value of the element.  |                |

#### Methods

| Name              | Privacy   | Description | Parameters                             | Return | Inherited From |
| ----------------- | --------- | ----------- | -------------------------------------- | ------ | -------------- |
| `expandedChanged` | protected |             | `oldValue: boolean`                    | `void` |                |
| `checkedChanged`  | protected |             | `oldValue: boolean, newValue: boolean` | `void` |                |

#### Events

| Name              | Type | Description                                                                                                                              | Inherited From |
| ----------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `expanded-change` |      | Fires a custom 'expanded-change' event when the expanded state changes                                                                   |                |
| `change`          |      | Fires a custom 'change' event when a non-submenu item with a role of \`menuitemcheckbox\`, \`menuitemradio\`, or \`menuitem\` is invoked |                |

#### Attributes

| Name   | Field    | Inherited From |
| ------ | -------- | -------------- |
|        | disabled |                |
|        | expanded |                |
| `role` | role     |                |
|        | checked  |                |

#### CSS Parts

| Name                              | Description                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| `input-container`                 | The element representing the visual checked or radio indicator |
| `checkbox`                        | The element wrapping the \`menuitemcheckbox\` indicator        |
| `radio`                           | The element wrapping the \`menuitemradio\` indicator           |
| `content`                         | The element wrapping the menu item content                     |
| `expand-collapse-glyph-container` | The element wrapping the expand collapse element               |
| `expand-collapse`                 | The expand/collapse element                                    |
| `submenu-region`                  | The container for the submenu, used for positioning            |

#### Slots

| Name                        | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `checked-indicator`         | The checked indicator                                      |
| `radio-indicator`           | The radio indicator                                        |
| `start`                     | Content which can be provided before the menu item content |
| `end`                       | Content which can be provided after the menu item content  |
|                             | The default slot for menu item content                     |
| `expand-collapse-indicator` | The expand/collapse indicator                              |
| `submenu`                   | Used to nest menu's within menu items                      |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-menu)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/menu/menu.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#menu)