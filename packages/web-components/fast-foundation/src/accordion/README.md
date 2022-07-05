---
id: accordion
title: fast-accordion
sidebar_label: accordion
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/accordion/README.md
description: fast-accordion is a web component implementation of an accordion.
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#accordion):

> An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. The headings function as controls that enable users to reveal or hide their associated sections of content. Accordions are commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastAccordion,
    fastAccordionItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastAccordion(),
        fastAccordionItem()
    );
```

### Customizing Icons

```ts
import {
    provideFASTDesignSystem,
    fastAccordion,
    fastAccordionItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastAccordion(),
        fastAccordionItem({
            collapsedIcon: `...your collapsed icon...`,
            expandedIcon: `...your expanded icon...`,
        })
    );
```

## Usage

```html live
<fast-accordion>
    <fast-accordion-item expanded>
        <span slot="heading">Panel one</span>
        Panel one content
    </fast-accordion-item>
    <fast-accordion-item>
        <span slot="heading">Panel two</span>
        Panel two content
    </fast-accordion-item>
    <fast-accordion-item expanded>
        <span slot="heading">Panel three</span>
        Panel three content
    </fast-accordion-item>
</fast-accordion>
```

## Create your own design

### Accordion

```ts
import { Accordion, accordionTemplate as template } from "@microsoft/fast-foundation";
import { accordionStyles as styles } from "./my-accordion.styles";

export const myAccordion = Accordion.compose({
    baseName: "accordion",
    template,
    styles,
});
```

### AccordionItem

```ts
import {
    AccordionItem,
    AccordionItemOptions,
    accordionItemTemplate as template,
} from "@microsoft/fast-foundation";
import { accordionItemStyles as styles } from "./my-accordion-item.styles";

export const myAccordionItem = AccordionItem.compose<AccordionItemOptions>({
    baseName: "accordion-item",
    template,
    styles,
    collapsedIcon: `...default collapsed icon...`,
    expandedIcon: `...default expanded icon...`,
});
```

## API



### class: `FASTAccordion`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name         | Privacy | Type                  | Default | Description                                                                                   | Inherited From |
| ------------ | ------- | --------------------- | ------- | --------------------------------------------------------------------------------------------- | -------------- |
| `expandmode` | public  | `AccordionExpandMode` |         | Controls the expand mode of the Accordion, either allowing single or multiple item expansion. |                |

#### Events

| Name     | Type | Description                                                | Inherited From |
| -------- | ---- | ---------------------------------------------------------- | -------------- |
| `change` |      | Fires a custom 'change' event when the active item changes |                |

#### Attributes

| Name          | Field      | Inherited From |
| ------------- | ---------- | -------------- |
| `expand-mode` | expandmode |                |

#### CSS Parts

| Name   | Description                      |
| ------ | -------------------------------- |
| `item` | The slot for the accordion items |

<hr/>

### Variables

| Name                  | Description                   | Type                                    |
| --------------------- | ----------------------------- | --------------------------------------- |
| `AccordionExpandMode` | Expand mode for FASTAccordion | `{ single: "single", multi: "multi", }` |

<hr/>



### class: `FASTAccordionItem`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Fields

| Name           | Privacy | Type                         | Default | Description                                                                                        | Inherited From |
| -------------- | ------- | ---------------------------- | ------- | -------------------------------------------------------------------------------------------------- | -------------- |
| `headinglevel` | public  | `1 or 2 or 3 or 4 or 5 or 6` | `2`     | Configures the [level](https://www.w3.org/TR/wai-aria-1.1/#aria-level) of the heading element. |                |
| `expanded`     | public  | `boolean`                    | `false` | Expands or collapses the item.                                                                     |                |
| `id`           | public  | `string`                     |         | The item ID                                                                                        |                |

#### Events

| Name     | Type | Description                                              | Inherited From |
| -------- | ---- | -------------------------------------------------------- | -------------- |
| `change` |      | Fires a custom 'change' event when the button is invoked |                |

#### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `heading-level` | headinglevel |                |
|                 | expanded     |                |
| `id`            | id           |                |

#### CSS Parts

| Name              | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `heading`         | Wraps the button                                         |
| `button`          | The button which serves to invoke the item               |
| `heading-content` | Wraps the slot for the heading content within the button |
| `icon`            | The icon container                                       |
| `region`          | The wrapper for the accordion item content               |

#### Slots

| Name             | Description                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `start`          | Content which can be provided between the heading and the icon                   |
| `end`            | Content which can be provided between the start slot and icon                    |
| `heading`        | Content which serves as the accordion item heading and text of the expand button |
|                  | The default slot for accordion item content                                      |
| `expanded-icon`  | The expanded icon                                                                |
| `collapsed-icon` | The collapsed icon                                                               |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-accordion)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/accordion/accordion.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#accordion)