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

## API

## `src/accordion/accordion.ts`:

### class: `Accordion`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name                  | Privacy | Type                                         | Default  | Description                                                                                                                                                                                           | Inherited From    |
| --------------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `expandmode`          | public  | `AccordionExpandMode`                        |          | Controls the expand mode of the Accordion, either allowing&#xD;&#xA;single or multiple item expansion.                                                                                                |                   |
| `activeid`            | private | `string \| null`                             |          |                                                                                                                                                                                                       |                   |
| `activeItemIndex`     | private | `number`                                     | `0`      |                                                                                                                                                                                                       |                   |
| `accordionIds`        | private | `Array<string \| null>`                      |          |                                                                                                                                                                                                       |                   |
| `change`              | private |                                              |          |                                                                                                                                                                                                       |                   |
| `setItems`            | private |                                              |          |                                                                                                                                                                                                       |                   |
| `removeItemListeners` | private |                                              |          |                                                                                                                                                                                                       |                   |
| `activeItemChange`    | private |                                              |          |                                                                                                                                                                                                       |                   |
| `handleItemKeyDown`   | private |                                              |          |                                                                                                                                                                                                       |                   |
| `handleItemFocus`     | private |                                              |          |                                                                                                                                                                                                       |                   |
| `_presentation`       | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                       | FoundationElement |
| `$presentation`       | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                      | FoundationElement |
| `template`            | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.          | FoundationElement |
| `styles`              | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name                 | Privacy   | Description | Parameters           | Return                  | Inherited From    |
| -------------------- | --------- | ----------- | -------------------- | ----------------------- | ----------------- |
| `findExpandedItem`   | private   |             |                      | `AccordionItem \| null` |                   |
| `resetItems`         | private   |             |                      | `void`                  |                   |
| `getItemIds`         | private   |             |                      | `Array<string \| null>` |                   |
| `isSingleExpandMode` | private   |             |                      | `boolean`               |                   |
| `adjust`             | private   |             | `adjustment: number` | `void`                  |                   |
| `focusItem`          | private   |             |                      | `void`                  |                   |
| `templateChanged`    | protected |             |                      | `void`                  | FoundationElement |
| `stylesChanged`      | protected |             |                      | `void`                  | FoundationElement |

#### Attributes

| Name          | Field      | Inherited From |
| ------------- | ---------- | -------------- |
| `expand-mode` | expandmode |                |

<hr/>

### Exports

| Kind | Name        | Declaration | Module                     | Package |
| ---- | ----------- | ----------- | -------------------------- | ------- |
| `js` | `Accordion` | Accordion   | src/accordion/accordion.ts |         |

## `src/accordion-item/accordion-item.ts`:

### class: `AccordionItem`

#### Superclass

| Name                | Module                  | Package |
| ------------------- | ----------------------- | ------- |
| `FoundationElement` | /src/foundation-element |         |

#### Static Methods

| Name      | Privacy | Description                                                                     | Parameters                      | Return                                                                                                             | Inherited From    |
| --------- | ------- | ------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `compose` | public  | Defines an element registry function with a set of element definition defaults. | `this: K, elementDefinition: T` | `(         overrideDefinition?: OverrideFoundationElementDefinition<T>     ) => FoundationElementRegistry<T, K>` | FoundationElement |

#### Fields

| Name            | Privacy | Type                                         | Default  | Description                                                                                                                                                                                           | Inherited From    |
| --------------- | ------- | -------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `headinglevel`  | public  | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                 | `2`      | Configures the {@link https\://www\.w3.org/TR/wai-aria-1.1/#aria-level \| level} of the&#xD;&#xA;heading element.                                                                                     |                   |
| `expanded`      | public  | `boolean`                                    | `false`  | Expands or collapses the item.                                                                                                                                                                        |                   |
| `id`            | public  | `string`                                     |          | The item ID                                                                                                                                                                                           |                   |
| `change`        | private |                                              |          |                                                                                                                                                                                                       |                   |
| `_presentation` | private | `ComponentPresentation \| null \| undefined` | `void 0` |                                                                                                                                                                                                       | FoundationElement |
| `$presentation` | public  | `ComponentPresentation \| null`              |          | A property which resolves the ComponentPresentation instance&#xD;&#xA;for the current component.                                                                                                      | FoundationElement |
| `template`      | public  | `ElementViewTemplate \| void \| null`        |          | Sets the template of the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve the template from&#xD;&#xA;the associated presentation or custom element definition.          | FoundationElement |
| `styles`        | public  | `ElementStyles \| void \| null`              |          | Sets the default styles for the element instance. When undefined,&#xD;&#xA;the element will attempt to resolve default styles from&#xD;&#xA;the associated presentation or custom element definition. | FoundationElement |

#### Methods

| Name              | Privacy   | Description | Parameters | Return | Inherited From    |
| ----------------- | --------- | ----------- | ---------- | ------ | ----------------- |
| `templateChanged` | protected |             |            | `void` | FoundationElement |
| `stylesChanged`   | protected |             |            | `void` | FoundationElement |

#### Attributes

| Name            | Field        | Inherited From |
| --------------- | ------------ | -------------- |
| `heading-level` | headinglevel |                |
|                 | expanded     |                |
| `id`            | id           |                |

<hr/>

### Exports

| Kind | Name            | Declaration   | Module                               | Package |
| ---- | --------------- | ------------- | ------------------------------------ | ------- |
| `js` | `AccordionItem` | AccordionItem | src/accordion-item/accordion-item.ts |         |


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-accordion)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/accordion/accordion.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#accordion)