---
id: breadcrumb-item
title: fast-breadcrumb-item
sidebar_label: breadcrumb-item
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/breadcrumb-item/README.md
---

The `fast-breadcrumb-item` is a widget meant to be used with `fast-breadcrumb`.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-breadcrumb-item href="#">Breadcrumb item</fast-breadcrumb-item>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { BreadcrumbItem, BreadcrumbItemTemplate as template } from "@microsoft/fast-foundation";
import { BreadcrumbItemStyles as styles } from "./breadcrumb-item.styles";

@customElement({
    name: "fast-breadcrumb-item",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
export class FASTBreadcrumbItem extends BreadcrumbItem {}
```