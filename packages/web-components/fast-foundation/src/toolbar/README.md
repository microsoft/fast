---
id: toolbar
title: fast-toolbar
sidebar_label: toolbar
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/toolbar/README.md
description: fast-toolbar is a web component implementation of a toolbar.
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#toolbar):

> A toolbar is a container for grouping a set of controls, such as buttons, menubuttons, or checkboxes.
>
> When a set of controls is visually presented as a group, the toolbar role can be used to communicate the presence and purpose of the grouping to screen reader users. Grouping controls into toolbars can also be an effective way of reducing the number of tab stops in the keyboard interface.

## Setup

```ts
import {
    provideFASTDesignSystem,
    fastToolbar
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastToolbar()
    );
```

## Usage

```html live
<fast-toolbar>
    <fast-button>Button</fast-button>
    <fast-radio-group>
        <fast-radio checked>One</fast-radio>
        <fast-radio>Two</fast-radio>
        <fast-radio>Three</fast-radio>
    </fast-radio-group>
    <fast-combobox>
        <fast-option>Please Please Me</fast-option>
        <fast-option>With The Beatles</fast-option>
        <fast-option>A Hard Day's Night</fast-option>
        <fast-option>Beatles for Sale</fast-option>
        <fast-option>Help!</fast-option>
        <fast-option>Rubber Soul</fast-option>
        <fast-option>Revolver</fast-option>
        <fast-option>Sgt. Pepper's Lonely Hearts Club Band</fast-option>
        <fast-option>Magical Mystery Tour</fast-option>
        <fast-option>The Beatles</fast-option>
        <fast-option>Yellow Submarine</fast-option>
        <fast-option>Abbey Road</fast-option>
        <fast-option>Let It Be</fast-option>
    </fast-combobox>
    <fast-button>Button</fast-button>
    <fast-select>
        <fast-option>Option 1</fast-option>
        <fast-option>Second option</fast-option>
        <fast-option>Option 3</fast-option>
    </fast-select>
</fast-toolbar>
```

## Create your own design

```ts
import {
    Toolbar,
    toolbarTemplate as template,
} from "@microsoft/fast-foundation";
import { toolbarStyles as styles } from "./my-toolbar.styles";

export const myToolbar = Toolbar.compose({
    baseName: "toolbar",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

## API



### class: `FASTToolbar`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name          | Privacy | Type          | Default | Description                     | Inherited From |
| ------------- | ------- | ------------- | ------- | ------------------------------- | -------------- |
| `activeIndex` |         |               |         |                                 |                |
| `orientation` | public  | `Orientation` |         | The orientation of the toolbar. |                |
| `childItems`  | public  | `Element[]`   |         |                                 |                |

#### Methods

| Name                  | Privacy   | Description | Parameters                                      | Return | Inherited From |
| --------------------- | --------- | ----------- | ----------------------------------------------- | ------ | -------------- |
| `slottedItemsChanged` | protected |             |                                                 | `void` |                |
| `childItemsChanged`   | protected |             | `prev: undefined or Element[], next: Element[]` | `void` |                |

#### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `orientation` | orientation |                |

#### CSS Parts

| Name                 | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `positioning-region` | The element containing the items, start and end slots |

#### Slots

| Name    | Description                                            |
| ------- | ------------------------------------------------------ |
| `start` | Content which can be provided before the slotted items |
| `end`   | Content which can be provided after the slotted items  |
|         | The default slot for slotted items                     |
| `label` | The toolbar label                                      |

<hr/>

### class: `DelegatesARIAToolbar`

#### Fields

| Name             | Privacy | Type             | Default | Description                                   | Inherited From |
| ---------------- | ------- | ---------------- | ------- | --------------------------------------------- | -------------- |
| `ariaLabelledby` | public  | `string or null` |         | The id of the element labeling the toolbar.   |                |
| `ariaLabel`      | public  | `string or null` |         | The label surfaced to assistive technologies. |                |

#### Attributes

| Name              | Field          | Inherited From |
| ----------------- | -------------- | -------------- |
| `aria-labelledby` | ariaLabelledby |                |
| `aria-label`      | ariaLabel      |                |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-toolbar)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/toolbar/toolbar.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#toolbar)