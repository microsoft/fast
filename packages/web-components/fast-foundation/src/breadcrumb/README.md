---
id: breadcrumb
title: fast-breadcrumb
sidebar_label: breadcrumb
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/breadcrumb/README.md
---

`fast-breadcrumb` is used as a navigational aid, allowing users to maintain awareness of their navigated path within a program, app, or a website.

## Usage

```html live
<fast-design-system-provider use-defaults>
    <fast-breadcrumb>
        <fast-breadcrumb-item href="#">Breadcrumb item 1</fast-breadcrumb-item>
        <fast-breadcrumb-item href="#">Breadcrumb item 2</fast-breadcrumb-item>
        <fast-breadcrumb-item >Breadcrumb item 3</fast-breadcrumb-item>
    </fast-breadcrumb>
</fast-design-system-provider>
```

## Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Breadcrumb, BreadcrumbTemplate as template } from "@microsoft/fast-foundation";
import { BreadcrumbStyles as styles } from "./breadcrumb.styles";

@customElement({
    name: "fast-breadcrumb",
    template,
    styles,
})
export class FASTBreadcrumb extends Breadcrumb {}
```