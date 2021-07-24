---
id: breadcrumb
title: fast-breadcrumb
sidebar_label: breadcrumb
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/breadcrumb/README.md
---

`fast-breadcrumb` is used as a navigational aid, allowing users to maintain awareness of their navigated path within a program, app, or a website.

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

## Additional resources

View the full specification for breadcrumb along with additional configuration options [here](https://github.com/microsoft/fast/blob/master/packages/web-components/fast-foundation/src/breadcrumb/breadcrumb.spec.md)