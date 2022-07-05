---
id: breadcrumb
title: fast-breadcrumb
sidebar_label: breadcrumb
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/breadcrumb/README.md
description: fast-breadcrumb is a web component used as a navigational aid.
---

As defined by the [W3C](https://w3c.github.io/aria-practices/#breadcrumb):

> A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order. It helps users find their place within a website or web application. Breadcrumbs are often placed horizontally before a page's main content.

## Setup

### Basic Setup

```ts
import {
    provideFASTDesignSystem,
    fastBreadcrumb,
    fastBreadcrumbItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastBreadcrumb(),
        fastBreadcrumbItem()
    );
```

### Custom Separator

```ts
import {
    provideFASTDesignSystem,
    fastBreadcrumb,
    fastBreadcrumbItem
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .register(
        fastBreadcrumb(),
        fastBreadcrumbItem({
            separator: " -> "
        })
    );
```

## Usage

```html live
<fast-breadcrumb>
    <fast-breadcrumb-item href="#">Breadcrumb item 1</fast-breadcrumb-item>
    <fast-breadcrumb-item href="#">Breadcrumb item 2</fast-breadcrumb-item>
    <fast-breadcrumb-item >Breadcrumb item 3</fast-breadcrumb-item>
</fast-breadcrumb>
```

## Create your own design

### Breadcrumb

```ts
import { Breadcrumb, breadcrumbTemplate as template } from "@microsoft/fast-foundation";
import { breadcrumbStyles as styles } from "./my-breadcrumb.styles";

export const myBreadcrumb = Breadcrumb.compose({
    baseName: "breadcrumb",
    template,
    styles,
});
```

### Breadcrumb Item

```ts
import {
    BreadcrumbItem,
    BreadcrumbItemOptions,
    breadcrumbItemTemplate as template,
} from "@microsoft/fast-foundation";
import { breadcrumbItemStyles as styles } from "./my-breadcrumb-item.styles";

export const myBreadcrumbItem = BreadcrumbItem.compose<BreadcrumbItemOptions>({
    baseName: "breadcrumb-item",
    template,
    styles,
    separator: "/",
    shadowOptions: {
        delegatesFocus: true,
    },
});
```

:::note
This component is built with the expectation that focus is delegated to the anchor element rendered into the shadow DOM.
:::

## API



### class: `FASTBreadcrumb`

#### Superclass

| Name          | Module | Package                 |
| ------------- | ------ | ----------------------- |
| `FASTElement` |        | @microsoft/fast-element |

#### Methods

| Name                            | Privacy   | Description | Parameters | Return | Inherited From |
| ------------------------------- | --------- | ----------- | ---------- | ------ | -------------- |
| `slottedBreadcrumbItemsChanged` | protected |             |            |        |                |

#### CSS Parts

| Name   | Description                            |
| ------ | -------------------------------------- |
| `list` | The element wrapping the slotted items |

#### Slots

| Name | Description                               |
| ---- | ----------------------------------------- |
|      | The default slot for the breadcrumb items |

<hr/>



### class: `FASTBreadcrumbItem`

#### Superclass

| Name         | Module                | Package |
| ------------ | --------------------- | ------- |
| `FASTAnchor` | /src/anchor/anchor.js |         |

#### Fields

| Name             | Privacy | Type                                         | Default | Description                                                                                                                                                               | Inherited From |
| ---------------- | ------- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `download`       | public  | `string`                                     |         | Prompts the user to save the linked URL. See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.          | FASTAnchor     |
| `href`           | public  | `string`                                     |         | The URL the hyperlink references. See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                 | FASTAnchor     |
| `hreflang`       | public  | `string`                                     |         | Hints at the language of the referenced resource. See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information. | FASTAnchor     |
| `ping`           | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   | FASTAnchor     |
| `referrerpolicy` | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   | FASTAnchor     |
| `rel`            | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   | FASTAnchor     |
| `target`         | public  | `"_self" or "_blank" or "_parent" or "_top"` |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   | FASTAnchor     |
| `type`           | public  | `string`                                     |         | See [`<a>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) for more information.                                                   | FASTAnchor     |
| `control`        | public  | `HTMLAnchorElement`                          |         | References the root element                                                                                                                                               | FASTAnchor     |

#### Attributes

| Name             | Field          | Inherited From |
| ---------------- | -------------- | -------------- |
| `download`       | download       | FASTAnchor     |
| `href`           | href           | FASTAnchor     |
| `hreflang`       | hreflang       | FASTAnchor     |
| `ping`           | ping           | FASTAnchor     |
| `referrerpolicy` | referrerpolicy | FASTAnchor     |
| `rel`            | rel            | FASTAnchor     |
| `target`         | target         | FASTAnchor     |
| `type`           | type           | FASTAnchor     |

<hr/>


## Additional resources

* [Component explorer examples](https://explore.fast.design/components/fast-breadcrumb)
* [Component technical specification](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/breadcrumb/breadcrumb.spec.md)
* [W3C Component Aria Practices](https://w3c.github.io/aria-practices/#breadcrumb)
* [Open UI Analysis](https://open-ui.org/components/Breadcrumb)