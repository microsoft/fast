---
id: accordion
title: fast-accordion
sidebar_label: accordion
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/accordion/README.md
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

## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-accordion)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/accordion/accordion.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#accordion)