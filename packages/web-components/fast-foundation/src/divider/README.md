---
id: divider
title: fast-divider
sidebar_label: divider
custom_edit_url: https://github.com/microsoft/fast/edit/master/packages/web-components/fast-foundation/src/divider/README.md
---

A web component implementation of a [horizontal rule](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr).

## Usage

```html
<fast-divider></fast-divider>
```

##  Applying custom styles

```ts
import { customElement } from "@microsoft/fast-element";
import { Divider, DividerTemplate as template } from "@microsoft/fast-foundation";
import { DividerStyles as styles } from "./divider.styles";

@customElement({
    name: "fast-divider",
    template,
    styles,
})
export class FASTDivider extends Divider {}
```