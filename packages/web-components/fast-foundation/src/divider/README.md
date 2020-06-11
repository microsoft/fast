---
id: fast-divider
title: fast-divider
sidebar_label: fast-divider
custom_edit_url: https://github.com/microsoft/fast-dna/edit/master/packages/web-components/fast-foundation/src/divider/README.md
---

A web component implementation of a [horizontal rule](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr).

##  Applying Custom Styles

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

## Usage
```html live
<fast-design-system-provider use-defaults>
    <fast-divider></fast-divider>
</fast-design-system-provider>
```